import React, { useContext, useMemo } from "react";
import { Route } from "react-router-dom";

// auth
// import { isEmptyUser } from "./AuthProvider";

// context
import { AuthContext, UserExistenceState } from "./AuthProvider";

// const Login = React.lazy(() => import("../pages/Login"));
import Login from "../pages/Login";
import Setup from "../pages/Setup";

interface PrivateRouteProps {
  path: string;
  element: React.ReactElement;
  children?: React.ReactNode;
}

export default function PrivateRoute(props: PrivateRouteProps) {
  const auth = useContext(AuthContext);

  const routeComponent = useMemo(() => {
    if (!auth.hasAuth) return <Login isAuthed={auth.hasAuth} />;
    return auth.userAlreadyExists === UserExistenceState.Exists ? (
      props.element
    ) : (
      <Setup userExistenceState={auth.userAlreadyExists} />
    );
  }, [auth.hasAuth, auth.userAlreadyExists, props.element]);

  return (
    <Route path={props.path} element={routeComponent}>
      {props?.children}
    </Route>
  );
}
