import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";

// util
import studentDivisions from "../config/studentDivisions";

// interfaces
import StudentClass from "../interfaces/StudentClass";
import StudentInfo from "../interfaces/StudentInfo";
import { WWResourceItemInterface } from "../pages/WWResources";

export default class StudentAdapter {
  private db: firebase.firestore.Firestore;
  private userId: string;

  constructor(app: firebase.app.App, userId: string) {
    this.db = app.firestore();
    this.userId = userId;
  }

  get studentID() {
    return this.userId;
  }

  async writeStudentDoc(
    nickname: string,
    gradYear: number,
    classes: StudentClass[]
  ) {
    // set basic profile information
    const userDoc = this.getUserDocRef();
    await userDoc.set({
      userId: this.userId,
      gradYear: gradYear,
      nickname: nickname,
    });

    // filter classes and then add the
    // valid ones to the user doc
    const filteredClasses = StudentAdapter.filterForValidClasses(classes);
    for (const studentClass of filteredClasses) {
      await this.writeClass(studentClass);
    }
  }

  async updateStudentClasses(classes: StudentClass[]) {
    // get division info
    const studentDivision = await this.getStudentDivision();

    if (studentDivision) {
      let currentWrittenClass: StudentClass,
        currentClassInGivenList: StudentClass | undefined;
      for (const period of studentDivision.periods) {
        // check if class exists or not
        currentWrittenClass = await this.getClass(`P${period}`);
        currentClassInGivenList = classes.find((cl) => cl.period === period);
        if (
          currentClassInGivenList &&
          StudentAdapter.isClassValid(currentClassInGivenList)
        ) {
          console.log(
            currentClassInGivenList.period + " is valid",
            currentClassInGivenList
          );
          // class in current list exists
          if (currentWrittenClass) {
            // the class currently exists in
            // DB, so we must update it!
            await this.updateClass(currentClassInGivenList);
          } else {
            // it does not yet exist in DB,
            // so we should write it
            await this.writeClass(currentClassInGivenList);
          }
        } else {
          // class in current list does
          // not exist
          console.log(period + " does not exist");
          await this.deleteClass(period);
        }
      }
    }
  }

  async writeClass(studentClass: StudentClass | undefined) {
    if (studentClass && StudentAdapter.isClassValid(studentClass)) {
      await this.getUserDocRef()
        .collection("classes")
        .doc(`P${studentClass.period}`)
        .set(studentClass);
    }
  }

  async updateClass(studentClass: StudentClass | undefined) {
    // update user class if there is one
    if (studentClass && StudentAdapter.isClassValid(studentClass)) {
      await this.getUserDocRef()
        .collection("classes")
        .doc(`P${studentClass.period}`)
        .update(studentClass);
    }
  }

  async deleteClass(period: number) {
    // update user class if there is one
    await this.getUserDocRef().collection("classes").doc(`P${period}`).delete();
  }

  async getStudentInfo() {
    const userInfo = await this.getUserDocRef().get();
    return userInfo.data() as StudentInfo;
  }

  async getStudentDivision() {
    const studentInfo = await this.getStudentInfo();
    return studentDivisions.find(
      (division) =>
        division.name ===
        StudentAdapter.getStudentDivisionNameFromGradYear(studentInfo.gradYear)
    );
  }

  async getClasses() {
    const userClasses = await this.getUserDocRef().collection("classes").get();
    return userClasses.docs.map((doc) => doc.data() as StudentClass);
  }

  async getClass(classDocName: string) {
    const userClass = await this.getUserDocRef()
      .collection("classes")
      .doc(classDocName)
      .get();

    return userClass.data() as StudentClass;
  }

  // React hook
  useStudentInfo() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useDocumentData<StudentInfo>(this.getUserDocRef(), {
      snapshotListenOptions: { includeMetadataChanges: true },
    });
  }

  // React hook
  useStudentClasses() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCollectionData<StudentClass>(
      this.getUserDocRef().collection("classes"),
      {
        snapshotListenOptions: { includeMetadataChanges: true },
      }
    );
  }

  // React hook
  useWWResources() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCollectionData<WWResourceItemInterface>(
      this.db.collection("wwResources"),
      {
        snapshotListenOptions: { includeMetadataChanges: true },
      }
    );
  }

  ////////// static methods //////////
  private static filterForValidClasses(classes: StudentClass[]) {
    return classes.filter((studentClass) => this.isClassValid(studentClass));
  }

  private static isClassValid(studentClass: StudentClass | undefined) {
    // return studentClass?.className !== "" && studentClass?.zoomLink !== "";
    // link is not needed to be valid! just class name (for now)
    return studentClass?.className !== "";
  }

  static getStudentDivisionName(grade: number) {
    switch (grade) {
      case 7:
      case 8:
        return "MIDDLE";
      case 9:
      case 10:
      case 11:
      case 12:
        return "UPPER";
      default:
        return "UNKNOWN"; // should I handle this case differently?
    }
  }

  static getGradYearFromGrade(grade: number) {
    if (grade >= 0 && grade <= 12) {
      let date = new Date(); // current date
      let yearTimeAdded = date.getMonth() >= 7 && date.getMonth() <= 11 ? 1 : 0;
      let adjustedYear = date.getFullYear() + yearTimeAdded;

      return adjustedYear + 12 - grade;
    } else {
      throw new Error("invalid grade given");
    }
  }

  static getGradeFromGradYear(year: number) {
    let date = new Date(); // current date
    let yearTimeAdded = date.getMonth() >= 7 && date.getMonth() <= 11 ? 1 : 0;
    // let yearTimeDeducted = (date.getMonth() <= 6 || date.getMonth() > 11) ? 1 : 0
    let adjustedYear = date.getFullYear() + yearTimeAdded;

    // return (year - adjustedYear) + 7
    return adjustedYear - year + 12;
  }

  static getStudentDivisionNameFromGradYear(year: number) {
    return this.getStudentDivisionName(this.getGradeFromGradYear(year));
  }

  static get studentGrades() {
    return [7, 8, 9, 10, 11, 12];
  }

  private getUserDocRef() {
    return this.db.collection("users").doc(this.userId);
  }
}
