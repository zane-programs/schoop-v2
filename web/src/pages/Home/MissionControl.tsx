// hooks
import useDate from "../../hooks/useDate";
import { generateTimeFromDate } from "../../util/date";

export default function MissionControl() {
  const date = useDate();

  return (
    <div>
      <h1 className="mainHeading">Your Schoop</h1>
      <div
        className="gridded-mission-control fix-border-radius"
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
