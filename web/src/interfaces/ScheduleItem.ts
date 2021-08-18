export default interface ScheduleItem {
  name?: string; // example: "Lunch"
  number?: number; // example: 1
  type: string; // example: "PERIOD"
  start: string; // "13:10" for 1:20 PM
  end: string; // "14:20" for 2:30 PM
  overrideSignifier?: string; // example: "MEET"
  overrideLink?: string; // override schedule link (for assemblies and such)
}
