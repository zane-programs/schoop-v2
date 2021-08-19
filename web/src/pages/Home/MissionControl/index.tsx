import { useContext } from "react";

// hooks
import useDate from "../../../hooks/useDate";

// context
import { HomeContext } from "..";

// util
import { generateTimeFromDate } from "../../../util/date";

// types
import { Spacetime } from "spacetime";

// styles
import styles from "./MissionControl.module.css";

export default function MissionControl() {
  const date = useDate();
  const { studentInfo } = useContext(HomeContext);

  return (
    <div>
      {/* <h1 className="mainHeading">Your Schoop</h1> */}
      <div className={styles.missionControlGreeting}>
        Good {getTimeOfDay(date)}, {studentInfo.nickname}
      </div>
      <div
        className={styles.missionControlMain}
        // TODO: relate this to size of HomeSchedule table
        style={{ height: "425px" }}
      >
        {/* Now and Up Next */}
        <StatusCard />

        {/* QOTD and Twitter */}
        <QOTDAndTwitterCard />
      </div>
    </div>
  );
}

function StatusCard() {
  const date = useDate();

  return (
    <div
      className={
        styles.missionControlCard +
        " " +
        styles.statusContainer +
        " fixBorderRadius"
      }
    >
      <StatusCardPart title="Now" date={date} />
      <StatusCardPart title="Up Next" />
    </div>
  );
}

function StatusCardPart({ date, title }: { date?: Spacetime; title: string }) {
  return (
    <div className={styles.containerPart}>
      <h4 className={styles.eventHeading}>
        {title}:&nbsp;<span className="event-signifier">-----</span>
      </h4>
      <div className={styles.statusFieldContainer}>
        <div className={styles.time}>
          {date ? generateTimeFromDate(date, " ") : "-----"}
        </div>
        <div className={styles.eventName}>-----</div>
      </div>
    </div>
  );
}

function QOTDAndTwitterCard() {
  return (
    <div
      className={
        styles.missionControlCard +
        " " +
        styles.qotdAndTwitterCard +
        " fixBorderRadius"
      }
    >
      <div className={styles.qotd}>
        <div className={styles.content}>
          &ldquo;Accept the challenges so that you can feel the exhilaration of
          victory.&rdquo;
        </div>
        <div className={styles.author}>
          &ndash;<span>George S. Patton</span>
        </div>
      </div>

      <div className="mission-control-part twitter-feed">
        <iframe
          width="100%"
          height="100%"
          frameBorder={0}
          src={process.env.PUBLIC_URL + "/ww-twitter.html"}
          title="Windward Twitter"
        />
      </div>
    </div>
  );
}

// TODO: clean this method up
// gets time of day from Spacetime ("evening", "morning", or "afternoon")
const getTimeOfDay = (date: Spacetime) => {
  const hour = date.hour();
  if ((hour >= 17 && hour <= 23) || (hour >= 0 && hour < 5)) {
    return "evening";
  } else if (hour >= 5 && hour < 12) {
    return "morning";
  } else {
    return "afternoon";
  }
};
