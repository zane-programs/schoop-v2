import React, { useContext, useState, useMemo, useEffect, useRef } from "react";

// context
import { AuthContext } from "../../auth/AuthProvider";
import { AuthenticatedLayoutContext } from "../../App";

// firebase
// import StudentAdapter from "../../util/StudentAdapter";
// import app from "../../auth/base";

// interfaces
import StudentClass from "../../interfaces/StudentClass";
// import StudentInfo from "../../interfaces/StudentInfo";

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

export default function Profile() {
  const auth = useContext(AuthContext);
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

  const [studentInfo, studentInfoLoading, studentInfoError] =
    studentInfoHookValue;
  const [studentClasses, studentClassesLoading, studentClassesError] =
    studentClassesHookValue;

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
        periodNumbers={divisionInfo?.periods || ([] as number[])}
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
      {/* <img
        src={auth.currentUser?.photoURL as string}
        alt={auth.currentUser?.displayName as string}
        style={{ width: 110, height: 110, borderRadius: "50%" }}
      /> */}
      <SetupClassesTableContext.Provider
        value={{
          classes: studentClassesInState,
          setClasses: setStudentClassesInState,
        }}
      >
        {setupClassesTable}
      </SetupClassesTableContext.Provider>
      <p>
        User is {auth.currentUser?.displayName} with email{" "}
        {auth.currentUser?.email}
      </p>
      <p>{JSON.stringify(studentInfo)}</p>
      <p>{JSON.stringify(studentClasses)}</p>
    </div>
  );
}
