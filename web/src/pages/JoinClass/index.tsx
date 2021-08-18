import React, { useContext, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
// @ts-ignore
import parse from "qs/lib/parse";

// util
import StudentAdapter from "../../util/StudentAdapter";

// context
import { AuthContext } from "../../auth/AuthProvider";

// hooks
import useGAFromContext from "../../hooks/useGAFromContext";

// auth
import firebaseApp from "../../auth/base";

// components
import LoadingPlaceholderScreen from "../../components/LoadingPlaceholderScreen";

export default function JoinClass() {
  const { classDocName } = useParams();
  const { search } = useLocation();
  const auth = useContext(AuthContext);
  const googleAnalytics = useGAFromContext();

  // create student adapter
  const studentAdapter = useMemo(
    () => new StudentAdapter(firebaseApp, auth.currentUser?.uid || ""),
    [auth.currentUser]
  );

  useEffect(() => {
    async function getClass() {
      const studentClass = await studentAdapter.getClass(classDocName);
      if (studentClass) {
        const sourceLabel: string = search
          ? parse(search.substring(1)).source.toLowerCase()
          : "unknown";
        googleAnalytics.event({
          category: "JoinMeeting",
          action: "Class",
          label: sourceLabel,
        });
        window.location.replace(studentClass.zoomLink);
      }
    }
    getClass();
  }, [studentAdapter, classDocName, googleAnalytics, search]);

  return (
    <LoadingPlaceholderScreen
      independent={true}
      // should I show class doc name (ex: P2) or no?
      title={`Joining ${classDocName}...`}
      showText={true}
    />
  );
}
