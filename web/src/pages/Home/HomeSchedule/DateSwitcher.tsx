import { memo, useContext, useMemo } from "react";

// components
import { ArrowLeftIcon, ArrowRightIcon } from "react-line-awesome";

// util
import { getISOWeek } from "date-fns";
import { getFormattedDateString } from "../../../util/date";

// context
import { HomeScheduleContext } from ".";

// types
import { Spacetime } from "spacetime";

// styles
import styles from "./HomeSchedule.module.css";

function DateSwitcher() {
  const { viewedDate } = useContext(HomeScheduleContext);

  return (
    <div>
      <div className={styles.dateSwitcher}>
        <DateSwitcherButton dateAction="subtract" />
        <div className={styles.viewedDate}>
          {getFormattedDateString(viewedDate)}
        </div>
        <DateSwitcherButton dateAction="add" />
      </div>
    </div>
  );
}

export default memo(DateSwitcher);

function DateSwitcherButton({
  dateAction,
}: {
  dateAction: "add" | "subtract";
}) {
  const { viewedDate, setViewedDate } = useContext(HomeScheduleContext);

  // the date to which the button would change the date
  const buttonDate = useMemo(
    () => viewedDate[dateAction](1, "day"),
    [viewedDate, dateAction]
  );

  return (
    <button
      className={styles[dateAction === "add" ? "right" : "left"]}
      // either add or subtract a day
      onClick={() => setViewedDate(viewedDate[dateAction](1, "day"))}
      disabled={
        getISOWeekFromSpacetime(buttonDate) !==
        getISOWeekFromSpacetime(viewedDate)
      }
      title={`${
        dateAction === "add" ? "Next" : "Previous"
      } Day (${buttonDate.format("day")})`}
    >
      {dateAction === "add" ? <ArrowRightIcon /> : <ArrowLeftIcon />}
    </button>
  );
}

const getISOWeekFromSpacetime = (date: Spacetime) =>
  getISOWeek(date.toLocalDate());
