import React, {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import firebase from "firebase";
import app from "./base";
import useGAFromContext from "../hooks/useGAFromContext";
// import { useNavigate } from "react-router-dom";

// user is either a Firebase User or null
type User = firebase.User | null;

interface AuthProviderProps {
  children: React.ReactNode;
}

export enum UserExistenceState {
  Initializing = 0, // loading state
  DoesNotExist = -1, // user does not exist
  Exists = 1, // user exists
}

interface AuthContextInterface {
  currentUser: User;
  userAlreadyExists: UserExistenceState;
  setUserAlreadyExists: Dispatch<SetStateAction<UserExistenceState>>;
  hasAuth?: boolean | null;
  logOut: Function;
}
const contextConfig: AuthContextInterface = {
  currentUser: null,
  userAlreadyExists: UserExistenceState.Initializing,
  setUserAlreadyExists: () => {},
  hasAuth: false,
  logOut: () => {},
};

export const AuthContext = createContext(contextConfig);

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User>({} as User);
  const [userAlreadyExists, setUserAlreadyExists] = useState(
    UserExistenceState.Initializing
  );
  const googleAnalytics = useGAFromContext(); // google analytics
  // const navigate = useNavigate(); // router navigation

  useEffect(() => {
    try {
      app.auth().onAuthStateChanged(async (user) => {
        setCurrentUser(user);
        if (user) {
          // assuming user exists
          try {
            let userDoc = (
              await app.firestore().collection("users").doc(user.uid).get()
            ).data();
            if (!userDoc) {
              setUserAlreadyExists(UserExistenceState.DoesNotExist);
              return;
            }
            setUserAlreadyExists(UserExistenceState.Exists);
          } catch (e) {
            // error handling
            alert(`Auth Error: ${e.message}`);
          }
        } else {
          // user is not logged in
          // keep this ready for the next user:
          setUserAlreadyExists(UserExistenceState.Initializing);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userAlreadyExists,
        setUserAlreadyExists,
        hasAuth: !isEmptyUser(currentUser),
        logOut: (label?: string) => {
          // navigate("/home"); // go home before logout
          app
            .auth()
            .signOut()
            .then(() => {
              let eventInfo: any = { category: "Auth", action: "Logout" };
              if (label) eventInfo.label = label; // set label if available
              googleAnalytics.event(eventInfo);
            });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const isEmptyUser = (userObj: User | null) => {
  const user = userObj || {};
  return Object.keys(user).length === 0 && user.constructor === Object;
};
