import { createContext, useContext } from "react";
import StudentAdapter from "../util/StudentAdapter";
import app from "../auth/base";

export const StudentAdapterContext = createContext(new StudentAdapter(app, ""));

export default function useStudentAdapter() {
  return useContext(StudentAdapterContext);
}
