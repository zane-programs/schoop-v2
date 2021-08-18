import spacetime, { Spacetime } from "spacetime";
import ScheduleItem from "../interfaces/ScheduleItem";
import StudentSchedule, {
  StudentScheduleWithMessage,
} from "../interfaces/StudentSchedule";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = MONTHS.map((month) => month.substring(0, 3));

// list of all time zones
export const timezoneNamesList = Object.keys(spacetime.now().timezones).sort(
  (a, b) => a.localeCompare(b, "en")
); // sort array alphabetically

// gets day name from date
export const getDateDayName = (date: Spacetime) => DAYS[date.day()];
// gets month name from date
export const getDateMonthName = (date: Spacetime, monthsList?: string[]) =>
  (monthsList || MONTHS)[date.month()];
// gets "Thursday, October 1" format
export const getFormattedDateString = (date: Spacetime) =>
  `${getDateDayName(date)}, ${getDateMonthName(date)} ${date.date()}`;
export const getShorterFormattedDateString = (date: Spacetime) =>
  `${getDateDayName(date)}, ${getDateMonthName(
    date,
    MONTHS_SHORT
  )} ${date.date()}`;

export const generateTime = (hour: number, min: number, space: string) => {
  let minuteString = min.toString();
  if (minuteString.length === 1) minuteString = "0" + minuteString;

  if (hour === 0) {
    return `12:${minuteString}${space}AM`;
  } else {
    let amOrPm = hour >= 12 ? "PM" : "AM";
    let hourAdjusted = hour > 12 ? hour - 12 : hour;
    return `${hourAdjusted}:${minuteString}${space}${amOrPm}`;
  }
};

export const generateTimeFromDate = (d: Spacetime, space = "") =>
  generateTime(d.hour(), d.minute(), space);

export const convertDateStringToArray = (str: string) =>
  str.split(":").map((num) => parseInt(num));

export const generateTimeFromDateString = (str: string, space: string) => {
  const dateArr = convertDateStringToArray(str);
  return generateTime(dateArr[0], dateArr[1], space);
};

export const generateTimestampFromDateStrings = (
  str1: string,
  str2: string,
  space = ""
) =>
  generateTimeFromDateString(str1, space) +
  "-" +
  generateTimeFromDateString(str2, space);

export function transformScheduleToTimezone(
  studentSchedule: StudentSchedule,
  timezone: string
) {
  console.log("INTIIAL SCHEDULE:", studentSchedule);

  // if it's just a message, just return the unmodified schedule
  if ((studentSchedule as StudentScheduleWithMessage).message)
    return studentSchedule;

  // now we're sure the schedule is a ScheduleItem list
  const transformedSchedule = (studentSchedule as ScheduleItem[])
    .slice()
    .map((originalItem) => {
      // if (!scheduleItem.number) return scheduleItem;
      // transform start and end to proper timezone
      const scheduleItem = Object.assign(originalItem); // copy item

      scheduleItem.start = transformTimestampToTimezone(
        scheduleItem.start,
        timezone
      );
      scheduleItem.end = transformTimestampToTimezone(
        scheduleItem.end,
        timezone
      );

      return scheduleItem;
    });

  console.log("TRANSFORMED SCHEDULE:", transformedSchedule);

  return transformedSchedule;
}

export function transformTimestampToTimezone(
  timestamp: string,
  timezone: string
) {
  const timestampParsed = timestamp.split(":").map((t) => parseInt(t));
  const dateObj = new Date();
  dateObj.setHours(timestampParsed[0], timestampParsed[1], 0);
  const st = spacetime(dateObj.getTime(), timezone); // create spacetime

  let minuteString =
    st.minute() < 10 ? "0" + st.minute() : st.minute().toString();
  return st.hour() + ":" + minuteString;
}
