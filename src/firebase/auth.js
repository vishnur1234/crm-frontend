import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

export const registerUser = async (email, password) => {
  const user = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return user;
};

export const loginUser = async (email, password) => {
  const user = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return user;
};

export const logoutUser = async () => {
  await signOut(auth);
};