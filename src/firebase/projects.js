import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const projectRef = collection(db, "projects");

export const getProjects = async () => {
  const snapshot = await getDocs(projectRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addProject = async (data) => {
  return await addDoc(projectRef, data);
};

export const updateProject = async (id, data) => {
  return await updateDoc(doc(db, "projects", id), data);
};

export const deleteProject = async (id) => {
  return await deleteDoc(doc(db, "projects", id));
};