import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';
import { generateNextOccurrence } from '../utils/recurrence';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) {
      setCustomers([]);
      setProjects([]);
      setTasks([]);
      return;
    }

    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snap) => {
      const list = [];
      snap.forEach(d => list.push(d.data()));
      setCustomers(list);
    });

    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      const list = [];
      snap.forEach(d => list.push(d.data()));
      setProjects(list);
    });

    const unsubTasks = onSnapshot(collection(db, 'tasks'), (snap) => {
      const list = [];
      snap.forEach(d => list.push(d.data()));
      setTasks(list);
    });

    return () => {
      unsubCustomers();
      unsubProjects();
      unsubTasks();
    };
  }, [user]);

  const addCustomer = async (data) => {
    const id = `c_${Date.now()}`;
    const c = { ...data, id, createdAt: new Date().toISOString().split('T')[0] };
    await setDoc(doc(db, 'customers', id), c);
    return c;
  };

  const updateCustomer = async (id, data) => {
    await updateDoc(doc(db, 'customers', id), data);
  };

  const deleteCustomer = async (id) => {
    await deleteDoc(doc(db, 'customers', id));
  };

  const addProject = async (data) => {
    const id = `p_${Date.now()}`;
    const p = {
      ...data,
      id,
      name: data.name || '',
      projectName: data.name || '',
      members: data.members || []
    };
    await setDoc(doc(db, 'projects', id), p);
    return p;
  };

  const updateProject = async (id, data) => {
    const p = {
      ...data,
      name: data.name || '',
      projectName: data.name || ''
    };
    await updateDoc(doc(db, 'projects', id), p);
  };

  const deleteProject = async (id) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  const addTask = async (data) => {
    const id = `t_${Date.now()}`;
    const t = { ...data, id, createdAt: new Date().toISOString().split('T')[0], comments: [] };
    await setDoc(doc(db, 'tasks', id), t);
    return t;
  };

  const updateTask = async (id, data) => {
    const docRef = doc(db, 'tasks', id);
    await updateDoc(docRef, data);

    if (data.status === 'Completed') {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const task = docSnap.data();
        if (task.recurrence && task.recurrence !== 'None') {
          const next = generateNextOccurrence(task);
          if (next) {
            await setDoc(doc(db, 'tasks', next.id), next);
          }
        }
      }
    }
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const addComment = async (taskId, comment) => {
    const docRef = doc(db, 'tasks', taskId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const task = docSnap.data();
      const newComment = {
        ...comment,
        id: `cm_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      await updateDoc(docRef, {
        comments: [...(task.comments || []), newComment]
      });
    }
  };

  return (
    <AppContext.Provider value={{
      customers, projects, tasks,
      addCustomer, updateCustomer, deleteCustomer,
      addProject, updateProject, deleteProject,
      addTask, updateTask, deleteTask,
      addComment,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
