import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const customerRef = collection(db, "customers");

export const getCustomers = async () => {
  const snapshot = await getDocs(customerRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addCustomer = async (data) => {
  return await addDoc(customerRef, data);
};

export const updateCustomer = async (id, data) => {
  const docRef = doc(db, "customers", id);
  return await updateDoc(docRef, data);
};

export const deleteCustomer = async (id) => {
  const docRef = doc(db, "customers", id);
  return await deleteDoc(docRef);
};