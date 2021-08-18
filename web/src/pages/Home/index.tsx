import React, { useEffect, useContext, useMemo } from "react";

// hooks
import usePageTitle from "../../hooks/usePageTitle";

// interfaces
import StudentInfo from "../../interfaces/StudentInfo";
import StudentClass from "../../interfaces/StudentClass";

// util
import LoadingPlaceholderScreen from "../../components/LoadingPlaceholderScreen";

// components
import MissionControl from "./MissionControl";
import HomeSchedule from "./HomeSchedule";

// context
import { AuthenticatedLayoutContext } from "../../App";

// styles
import styles from "./Home.module.css";

export default function Home() {
  const { setTitle } = usePageTitle();

  const { studentInfoHookValue, studentClassesHookValue } = useContext(
    AuthenticatedLayoutContext
  );

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
    setTitle("Home");
  }, [setTitle]);

  if (studentInfoError || studentClassesError)
    return (
      <div>
        <strong>Error:</strong>{" "}
        {studentInfoError?.message ||
          studentClassesError?.message ||
          "Unknown Error"}
      </div>
    );

  return studentInfoLoading || studentClassesLoading ? (
    <LoadingPlaceholderScreen />
  ) : (
    <HomeContext.Provider
      value={{
        studentInfo: studentInfo as StudentInfo,
        studentClasses: studentClasses as StudentClass[],
      }}
    >
      <div className={styles.griddedItems}>
        <HomeSchedule />
        <MissionControl />
      </div>
    </HomeContext.Provider>
  );
}

export const HomeContext = React.createContext({
  studentInfo: {} as StudentInfo,
  studentClasses: {} as StudentClass[],
});
