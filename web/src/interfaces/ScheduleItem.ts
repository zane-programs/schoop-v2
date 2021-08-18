export default interface ScheduleItem {
  name?: string // example: "Lunch"
  number?: number // example: 1
  type: string // example: "PERIOD"
  // start: number[] // example: [9, 0] for 9:00
  // end: number[] // example: [10, 20] for 10:20
  start: string // "13:10" for 1:20 PM
  end: string // "14:20" for 2:30 PM
  overrideSignifier?: string // example: "MEET"
}