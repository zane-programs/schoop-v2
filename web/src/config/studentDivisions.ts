export interface StudentDivision {
  name: string;
  displayName: string;
  periods: number[];
}

const studentDivisions: StudentDivision[] = [
  {
    name: "MIDDLE",
    displayName: "Middle School",
    periods: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    name: "UPPER",
    displayName: "High School",
    periods: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
];

export default studentDivisions;
