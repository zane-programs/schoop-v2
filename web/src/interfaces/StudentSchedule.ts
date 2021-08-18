import ScheduleItem from "./ScheduleItem";

export interface StudentScheduleWithMessage {
  message: string;
}

// either an actual schedule or just a message
type StudentSchedule = ScheduleItem[] | StudentScheduleWithMessage;

export default StudentSchedule;
