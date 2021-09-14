import {
  useState,
  useContext,
  useEffect,
  useMemo,
  createContext,
  memo,
} from "react";
import spacetime, { Spacetime } from "spacetime";

// interfaces
import { StudentScheduleWithMessage } from "../../../interfaces/StudentSchedule";
import ScheduleItem from "../../../interfaces/ScheduleItem";

// hooks
import useDate from "../../../hooks/useDate";

// context
import { HomeContext } from "..";

// components
import DateSwitcher from "./DateSwitcher";
import ScheduleItemComponent from "./ScheduleItemComponent";
import ScheduleMessage from "./ScheduleMessage";

// styles
import styles from "./HomeSchedule.module.css";

type ImmutableStudentSchedule =
  | ReadonlyArray<ScheduleItem>
  | StudentScheduleWithMessage;

const TEST_SCHEDULE: ImmutableStudentSchedule = Object.freeze([
  {
    number: 1,
    type: "PERIOD",
    start: "9:00",
    end: "9:55",
  },
  {
    name: "Meeting/Break",
    type: "ASSEMBLY",
    start: "9:55",
    end: "10:40",
    overrideSignifier: "MEET",
  },
  {
    number: 3,
    type: "PERIOD",
    start: "10:40",
    end: "11:35",
  },
  {
    name: "Lunch",
    type: "BREAK",
    start: "11:35",
    end: "12:20",
  },
  {
    number: 5,
    type: "PERIOD",
    start: "12:20",
    end: "13:15",
  },
  {
    name: "Break",
    type: "BREAK",
    start: "13:15",
    end: "13:35",
  },
  {
    number: 7,
    type: "PERIOD",
    start: "13:35",
    end: "14:30",
  },
]);
// const TEST_SCHEDULE: ImmutableStudentSchedule = Object.freeze({
//   message: "School is on break. We look forward to seeing you soon!",
// });

function HomeSchedule() {
  const currentDate = useDate();
  const { studentClasses } = useContext(HomeContext);

  const [viewedDate, setViewedDate] = useState<Spacetime>(spacetime.now());

  // this is a placeholder for now
  const currentSchedule: ImmutableStudentSchedule = useMemo(
    () => TEST_SCHEDULE,
    []
  );

  const scheduleItemComponents = useMemo(
    () =>
      // NOTE: changed schedule variable in use from
      // currentSchedule to TEST_SCHEDULE to demonstrate
      // mutability problem
      Array.isArray(currentSchedule) ? (
        (currentSchedule as ScheduleItem[]).map((scheduleItem, index) => (
          <ScheduleItemComponent
            scheduleItem={scheduleItem}
            classInfo={
              scheduleItem.type === "PERIOD"
                ? studentClasses.find(
                    (studentClass) =>
                      studentClass.period === scheduleItem.number
                  )
                : null
            }
            key={
              scheduleItem.type === "PERIOD"
                ? "P" + scheduleItem.number // example: P1
                : scheduleItem.type + "_" + index // example: BREAK_0
            }
          />
        ))
      ) : (
        <ScheduleMessage
          message={(currentSchedule as StudentScheduleWithMessage).message}
        />
      ),
    [currentSchedule, studentClasses]
  );

  useEffect(() => {
    // when the day changes, set the date
    // currently in view to the new date
    if (
      currentDate.hour() === 0 &&
      currentDate.minute() === 0 &&
      currentDate.second() === 0
    )
      setViewedDate(spacetime.now());
  }, [currentDate, setViewedDate]);

  return (
    <HomeScheduleContext.Provider value={{ viewedDate, setViewedDate }}>
      <div>
        <DateSwitcher />
        <table className={styles.homeSchedule + " fixBorderRadius"}>
          <tbody>{scheduleItemComponents}</tbody>
        </table>
      </div>
    </HomeScheduleContext.Provider>
  );
}

export const HomeScheduleContext = createContext(
  {} as {
    viewedDate: Spacetime;
    setViewedDate: React.Dispatch<React.SetStateAction<Spacetime>>;
  }
);

export default memo(HomeSchedule);
