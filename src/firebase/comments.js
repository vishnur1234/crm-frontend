import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "./firebase";

const commentRef = collection(db, "comments");

export const addComment = async (data) => {
  return await addDoc(commentRef, data);
};

export const getComments = async () => {
  const snapshot = await getDocs(commentRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};