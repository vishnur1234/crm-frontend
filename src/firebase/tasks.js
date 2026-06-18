import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./firebase";

const taskRef = collection(db, "tasks");

export const addTask = async (data) => {
  return await addDoc(taskRef, data);
};

export const getTasks = async () => {
  const snapshot = await getDocs(taskRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
};