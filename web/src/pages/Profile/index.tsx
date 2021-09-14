import { useContext, useState, useMemo, useEffect, useRef } from "react";

// context
import { AuthenticatedLayoutContext } from "../../App";

// interfaces
import StudentClass from "../../interfaces/StudentClass";

// components
import LoadingPlaceholderScreen from "../../components/LoadingPlaceholderScreen";
import SetupClassesTable, {
  SetupClassesTableContext,
} from "../../components/SetupClassesTable";

// hooks
import usePageTitle from "../../hooks/usePageTitle";
import useStudentAdapter from "../../hooks/useStudentAdapter";
import StudentAdapter from "../../util/StudentAdapter";
import studentDivisions from "../../config/studentDivisions";

// styles
import styles from "./Profile.module.css";

export default function Profile() {
  // const auth = useContext(AuthContext);
  const studentAdapter = useStudentAdapter();
  const { setTitle } = usePageTitle();
  const { studentInfoHookValue, studentClassesHookValue } = useContext(
    AuthenticatedLayoutContext
  );

  // student classes
  const [studentClassesInState, setStudentClassesInState] = useState(
    [] as StudentClass[]
  );

  // classes table loading overlay state
  const [
    classesTableShowingLoadingOverlay,
    setClassesTableShowingLoadingOverlay,
  ] = useState(false);

  const firstUpdate = useRef(true); // holds if it is first render
  useEffect(() => {
    if (firstUpdate.current) {
      // if it is the first render,
      // we don't execute the task
      // after this block
      firstUpdate.current = false;
      return;
    }
    // update classes in database
    setClassesTableShowingLoadingOverlay(true);
    studentAdapter
      .updateStudentClasses(studentClassesInState)
      .then(() => setClassesTableShowingLoadingOverlay(false));
  }, [studentAdapter, studentClassesInState]);

  const [studentInfo, studentInfoLoading, studentInfoError] = useMemo(
    () => studentInfoHookValue,
    [studentInfoHookValue]
  );
  const [studentClasses, studentClassesLoading, studentClassesError] = useMemo(
    () => studentClassesHookValue,
    [studentClassesHookValue]
  );
  // set page title
  useEffect(() => {
    setTitle("Profile");
  }, [setTitle]);

  const gradYear: number | null | undefined = useMemo(
    () => studentInfo?.gradYear,
    [studentInfo]
  );

  const setupClassesTable = useMemo(() => {
    const divisionName = StudentAdapter.getStudentDivisionNameFromGradYear(
      gradYear || 0
    );
    const divisionInfo = studentDivisions.find(
      (division) => division.name === divisionName
    );
    return (
      <SetupClassesTable
        periodNumbers={divisionInfo?.periods || []}
        initialClassList={studentClasses}
        showSaveButton={true}
        saveButtonText="Save"
        showLoadingOverlay={classesTableShowingLoadingOverlay}
      />
    );
  }, [studentClasses, gradYear, classesTableShowingLoadingOverlay]);

  // error handling
  if (studentInfoError || studentClassesError) {
    return <div>Database Error</div>;
  }

  // if no error
  return studentInfoLoading || studentClassesLoading ? (
    <LoadingPlaceholderScreen title="Loading Profile..." />
  ) : (
    <div>
      <h1 className="mainHeading">Profile</h1>
      <h2 className={styles.subheading}>Classes</h2>
      <SetupClassesTableContext.Provider
        value={{
          classes: studentClassesInState,
          setClasses: setStudentClassesInState,
        }}
      >
        {setupClassesTable}
      </SetupClassesTableContext.Provider>
      <PrivacyArea />
    </div>
  );
}

function PrivacyArea() {
  return (
    <>
      <h2 className={styles.subheading}>Privacy</h2>
      <p>
        In compliance with California privacy laws, Schoop allows students to
        delete their accounts. If you have any questions about this, please{" "}
        <a href="mailto:zstjohn22@windwardschool.org">let us know</a>, and we
        will try to help you to the best of our ability.{" "}
        <strong>
          Deleting your account irreversible, and we will not be able to restore
          your data once you have done so.
        </strong>
      </p>
      <button className={styles.deleteAccountButton}>Delete Account</button>
    </>
  );
}
