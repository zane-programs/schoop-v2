import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";

// components
import SetupClassesTable, {
  SetupClassesTableContext,
} from "../../components/SetupClassesTable";
import LoadingSpinner from "../../components/LoadingSpinner";

// interfaces
import StudentClass from "../../interfaces/StudentClass";

// context
import AppConfigContext from "../../context/AppConfigContext";
import { AuthContext, UserExistenceState } from "../../auth/AuthProvider";

// hooks
import useWindowDimensions from "../../hooks/useWindowDimensions";
// import usePageTitle from "../../hooks/usePageTitle";

// auth/firebase
import app from "../../auth/base";

// util
import StudentAdapter from "../../util/StudentAdapter";
import { removePx } from "../../App";

// misc
// import StudentClass from "../../interfaces/StudentClass";
import studentDivisions, {
  StudentDivision,
} from "../../config/studentDivisions";

// styles
import styles from "./Setup.module.css";
import LoadingPlaceholderScreen from "../../components/LoadingPlaceholderScreen";

interface SetupProps {
  userExistenceState: UserExistenceState;
}

export default function Setup({ userExistenceState }: SetupProps) {
  const auth = useContext(AuthContext); // auth
  const appConfig = useContext(AppConfigContext);
  const { width, height } = useWindowDimensions();

  // storage of loading state
  const [isLoading, setIsLoading] = useState(false);
  // user nickname storage
  const [userNickname, setUserNickname] = useState(
    (auth.currentUser?.displayName || "Nickname").split(" ")[0]
  );
  // storage for student's classes
  const [classes, setClasses] = useState([] as StudentClass[]);
  // student selection for their division
  const [division, setDivision] = useState({} as StudentDivision);
  const [gradYear, setGradYear] = useState(0); // will attempt to be set later

  // get student grad year from email
  useEffect(() => {
    if (auth.currentUser?.email) {
      // set grad year
      const grYear = getGradYearFromEmail(auth.currentUser.email);
      setGradYear(grYear);

      // set division
      const divisionInfo = getDivisionInfoFromGrade(
        StudentAdapter.getGradeFromGradYear(grYear)
      );
      if (divisionInfo) setDivision(divisionInfo);
    }
  }, [auth.currentUser, setGradYear, setDivision]);

  // CALLED ON COMPLETE BUTTON CLICK
  useEffect(() => {
    async function writeClasses() {
      if (classes.length > 0) {
        if (auth.currentUser?.uid) {
          setIsLoading(true); // show loading overlay
          await new StudentAdapter(
            app,
            auth.currentUser?.uid || ""
          ).writeStudentDoc(userNickname, gradYear, classes);
          auth.setUserAlreadyExists(UserExistenceState.Exists);
        }
      }
    }
    writeClasses(); // run async function
  }, [classes, auth, userNickname, gradYear]);

  const pageWidth = useMemo(
    () => width - 2 * removePx(appConfig.appPadding),
    [width, appConfig.appPadding]
  );

  const minHeight = useMemo(
    () => height - 2 * removePx(appConfig.appPadding),
    [height, appConfig.appPadding]
  );

  // handles grade change
  const handleGradeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const grYear = parseInt(event.target.value);
      const divisionInfo = getDivisionInfoFromGrade(
        StudentAdapter.getGradeFromGradYear(grYear)
      );
      if (divisionInfo) setDivision(divisionInfo); // set division
      setGradYear(grYear); // set grad year
    },
    [setDivision]
  );

  const setupClassesTableElem = useMemo(
    () =>
      division.periods?.length > 0 ? (
        <>
          <h2 className={styles.setupSubheading}>Classes</h2>
          <p className={styles.subheadingDescriptor}>
            Enter your class schedule in the form below. Leave any periods you
            have free blank.
          </p>
          <SetupClassesTableContext.Provider value={{ classes, setClasses }}>
            <SetupClassesTable
              periodNumbers={division.periods}
              showSaveButton={true}
              saveButtonText="Complete"
              // saveButtonClassName={styles.setupClassesTableSaveButton}
            />
          </SetupClassesTableContext.Provider>
        </>
      ) : null,
    [division, classes]
  );

  const loadingOverlayIfApplicable = useMemo(
    () =>
      isLoading ? (
        <SetupLoadingOverlay
          title="Creating account..."
          width={width}
          height={height}
          position="fixed"
        />
      ) : null,
    [isLoading, width, height]
  );

  // set page title
  // usePageTitle("Setup");

  // we are now FOR SURE on the setup page
  if (userExistenceState === UserExistenceState.Initializing) {
    return <LoadingPlaceholderScreen independent={true} />;
  }

  return (
    <>
      {loadingOverlayIfApplicable}
      <div
        className={styles.setupContainer}
        style={{ minHeight, width: pageWidth }}
      >
        <h1 className={styles.setupHeading}>Set Up</h1>
        <form>
          <label className={styles.nicknameInputLabel}>
            <strong>What would you like us to call you?</strong>
            <input
              type="text"
              value={userNickname}
              onChange={(event) => setUserNickname(event.target.value)}
              placeholder="Nickname or Preferred Name"
              className={styles.nicknameInput}
            />
          </label>
          <div className={styles.setupClassesTable}>
            {/* TODO: De-jankify this! */}
            <label className={styles.nicknameInputLabel}>
              <strong style={{ display: "block", marginBottom: 5 }}>
                What grade are you in?
              </strong>
              {/* <DivisionPicker onChange={handleDivisionChange} /> */}
              <GradePicker value={gradYear} onChange={handleGradeChange} />
            </label>
            {setupClassesTableElem}
          </div>
        </form>
      </div>
    </>
  );
}

function GradePicker({
  onChange,
  value,
}: {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: number;
}) {
  const pickerRef = useRef<HTMLSelectElement>(null);

  // set picker value if provided
  useEffect(() => {
    if (pickerRef.current && value) pickerRef.current.value = value.toString();
  }, [value]);

  const gradeOptions = useMemo(
    () =>
      StudentAdapter.studentGrades.map((grade) => (
        <option
          value={StudentAdapter.getGradYearFromGrade(grade).toString()}
          key={grade}
        >
          {grade}th ({StudentAdapter.getGradYearFromGrade(grade)})
        </option>
      )),
    []
  );

  return (
    <select
      onChange={onChange}
      defaultValue={0}
      className={styles.divisionPicker}
      ref={pickerRef}
    >
      <option disabled value={0}>
        Select Grade
      </option>
      {gradeOptions}
    </select>
  );
}

interface LoadingOverlayProps {
  title: string;
  width: string | number;
  height: string | number;
  position: "fixed" | "absolute";
}
export const SetupLoadingOverlay = React.memo(function LoadingOverlay({
  title,
  width,
  height,
  position,
}: LoadingOverlayProps) {
  const { themeColor } = useContext(AppConfigContext);
  // const { width, height } = useWindowDimensions();
  return (
    <div
      style={{
        width,
        height,
        position,
        zIndex: position === "fixed" ? 9999 : 1,
      }}
      className={styles.loadingOverlay}
    >
      <div className={styles.centeredArea}>
        <div className={styles.spinnerHolder} title={title}>
          <LoadingSpinner
            color={themeColor}
            title={title}
            thickness="5px"
            size="100px"
          />
        </div>
        <div className={styles.spinnerMessage}>{title}</div>
      </div>
    </div>
  );
});

function getGradYearFromEmail(email: string) {
  const lastTwoOfEmail = email.split("@")[0].slice(-2);

  return /^\d+$/.test(lastTwoOfEmail)
    ? // last two chars of email were numbers -> return grad year
      parseInt(lastTwoOfEmail) +
        Math.floor(new Date().getFullYear() / 100) * 100
    : // last two chars of email were not numbers -> return 0
      0;
}

function getDivisionInfoFromGrade(grade: number) {
  return studentDivisions.find(
    (division) => division.name === StudentAdapter.getStudentDivisionName(grade)
  );
}
