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
        className={styles.missionControlMain + " fixBorderRadius"}
        // TODO: relate this to size of HomeSchedule table
        style={{ height: "425px" }}
      >
        <div className="mission-control-part current-status">
          <div className="mission-control-status-container now">
            <h4>
              Now:&nbsp;<span className="event-signifier">-----</span>
            </h4>
            <div className="mission-control-status-field-container">
              <div className="mission-control-status-field time">
                {generateTimeFromDate(date, " ")}
              </div>
              <div className="mission-control-status-field event">-----</div>
            </div>
          </div>
          <div className="mission-control-status-container up-next">
            <h4>
              Up Next:&nbsp;<span className="event-signifier">-----</span>
            </h4>
            <div className="mission-control-status-field-container">
              <div className="mission-control-status-field time">-----</div>
              <div className="mission-control-status-field event">-----</div>
            </div>
          </div>
        </div>
        <div className="mission-control-part qotd">
          <div className="quote-content">
            "
            <span>
              Accept the challenges so that you can feel the exhilaration of
              victory.
            </span>
            "
          </div>
          <div className="quote-author">
            –<span>George S. Patton</span>
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
