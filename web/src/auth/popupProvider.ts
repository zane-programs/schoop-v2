import firebase from "firebase/app";
import "firebase/auth";

const popupProvider = new firebase.auth.GoogleAuthProvider();

popupProvider.setCustomParameters({
  hd: process.env.REACT_APP_FIREBASE_ORGANIZATION_DOMAIN,
});

export default popupProvider;
