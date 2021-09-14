import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useContext,
} from "react";

// components
import { SetupLoadingOverlay } from "../../pages/Setup";

// interfaces
import StudentClass from "../../interfaces/StudentClass";

// styles
import styles from "./SetupClassesTable.module.css";

interface SetupClassesTableContextType {
  classes: StudentClass[];
  setClasses?: (classes: StudentClass[]) => void;
}
export const SetupClassesTableContext = createContext({
  classes: [],
} as SetupClassesTableContextType);

interface SetupClassesTableProps {
  periodNumbers: number[];
  showSaveButton?: boolean;
  saveButtonText?: string;
  // saveButtonClassName?: string;
  initialClassList?: StudentClass[];
  showLoadingOverlay?: boolean;
}
export default function SetupClassesTable(props: SetupClassesTableProps) {
  // classes in context
  const { setClasses } = useContext(SetupClassesTableContext);
  // student classes
  const [studentClasses, setStudentClasses] = useState(
    props.initialClassList || ([] as StudentClass[])
  );

  // allows for popup warning users before leaving
  useEffect(() => {
    const beforeUnload = (event: any) => {
      const confirmationMessage =
        "Warning: Leaving this page will result in any unsaved data being lost. Are you sure you wish to continue?";
      (event || window.event).returnValue = confirmationMessage; // Gecko + IE
      return confirmationMessage; // WebKit
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, []);

  // handles change of inputs
  const handlePeriodRowChange = useCallback(
    (studentClass: StudentClass) => {
      setStudentClasses((prevClasses) => {
        const classes = prevClasses
          .slice()
          .filter(
            (currentClass) => currentClass.period !== studentClass.period
          );
        classes.push(studentClass);
        return classes;
      });
    },
    [setStudentClasses]
  );

  const rows = useMemo(
    () =>
      props.periodNumbers.map((period) => (
        <PeriodRow
          period={period}
          defaultClass={
            props.initialClassList?.find(
              (studentClass) => studentClass.period === period
            ) || null
          }
          key={period}
          onChange={handlePeriodRowChange}
        />
      )),
    [props.periodNumbers, props.initialClassList, handlePeriodRowChange]
  );

  const saveButton = useMemo(
    () =>
      props?.showSaveButton ? (
        <button
          onClick={() => {
            if (setClasses) setClasses(studentClasses);
          }}
          // className={props?.saveButtonClassName}
          className={styles.saveButton}
          type="button"
        >
          {props.saveButtonText || "Save"}
        </button>
      ) : null,
    [props, setClasses, studentClasses]
  );

  const loadingOverlay = useMemo(
    () =>
      props?.showLoadingOverlay ? (
        <SetupLoadingOverlay
          title="Saving..."
          width="100%"
          height="100%"
          position="absolute"
        />
      ) : null,
    [props]
  );

  return (
    <div className={styles.classesTableContainer}>
      {loadingOverlay}
      <table className={styles.classesTable}>
        <tbody>
          <tr>
            <th className={styles.period}>Period</th>
            <th className={styles.className}>Class Name</th>
            <th className={styles.roomNumber}>Room</th>
            <th className={styles.zoomLink}>Link (Optional)</th>
            <th className={styles.classColor}>Color</th>
          </tr>
          {rows}
        </tbody>
      </table>
      {saveButton}
    </div>
  );
}

function PeriodRow({
  period,
  onChange,
  defaultClass,
}: {
  period: number;
  onChange: Function;
  defaultClass: StudentClass | null;
}) {
  // const { classes, setClasses } = useContext(SetupClassesTableContext);

  // BTW, className refers to the name of the school class
  // and is NOT a reference to the React className prop.
  // now uses default valeus when available
  const [className, setClassName] = useState(defaultClass?.className || "");
  const [zoomLink, setZoomLink] = useState(defaultClass?.zoomLink || "");
  const [room, setRoom] = useState(defaultClass?.room || "");

  useEffect(() => {
    onChange({ period, className, room, zoomLink });
  }, [onChange, period, className, room, zoomLink]);

  const handleClassNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setClassName(event.target.value);
    },
    []
  );

  const handleZoomLinkChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setZoomLink(event.target.value);
    },
    []
  );

  const handleRoomChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRoom(event.target.value);
    },
    []
  );

  return (
    <tr>
      <td className={styles.period}>P{period}</td>
      <td className={styles.className}>
        <input
          type="text"
          placeholder={`P${period} Name`}
          value={className}
          onChange={handleClassNameChange}
        />
      </td>
      <td className={styles.roomNumber}>
        <input
          type="text"
          placeholder="Room"
          value={room}
          onChange={handleRoomChange}
        />
      </td>
      <td className={styles.zoomLink}>
        <input
          type="text"
          placeholder="Link/Code"
          value={zoomLink}
          onChange={handleZoomLinkChange}
        />
      </td>
      <td className={styles.classColor}>
        <input type="text" placeholder="Color" />
      </td>
    </tr>
  );
}
