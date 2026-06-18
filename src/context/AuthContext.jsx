import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext(null);

const normalizeUser = (data) => {
  if (!data) return null;
  const role = data.role ? (data.role.toLowerCase() === 'admin' ? 'Admin' : 'Employee') : 'Employee';
  return { ...data, role };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [company, setCompany] = useState({ name: '', email: '', phone: '', address: '', website: '', industry: '' });
  const [loading, setLoading] = useState(true);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          const q = query(collection(db, 'users'), where('email', '==', firebaseUser.email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const userData = { ...normalizeUser(snap.docs[0].data()), uid: firebaseUser.uid };
            console.log(`[User Login Info] Logged-in User:`, userData);
            console.log(`[User Login Info] Login Timestamp:`, new Date().toLocaleString());
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Company Info and Users List
  useEffect(() => {
    if (!user) return;

    const unsubCompany = onSnapshot(doc(db, 'company', 'info'), (docSnap) => {
      if (docSnap.exists()) {
        setCompany(docSnap.data());
      }
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const list = [];
      snapshot.forEach(d => {
        list.push(normalizeUser(d.data()));
      });
      setUsers(list);
    });

    return () => {
      unsubCompany();
      unsubUsers();
    };
  }, [user]);


  

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const q = query(collection(db, 'users'), where('email', '==', email));
      const snap = await getDocs(q);
      let userData = null;
      if (!snap.empty) {
        userData = { ...normalizeUser(snap.docs[0].data()), uid: userCredential.user.uid };
        setUser(userData);
      }
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      // Auto-provision user if they exist in Firestore database but not Firebase Auth
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const q = query(collection(db, 'users'), where('email', '==', email));
          const snap = await getDocs(q);
          if (!snap.empty) {
            const userDoc = snap.docs[0].data();
            if (userDoc.password === password) {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              const userData = { ...normalizeUser(userDoc), uid: userCredential.user.uid };
              setUser(userData);
              setLoading(false);
              return { success: true, user: userData };
            }
          }
        } catch (provisionErr) {
          console.error('Auto-provisioning failed:', provisionErr);
        }
      }
      setLoading(false);
      return { success: false, error: 'Invalid email or password.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!auth.currentUser) return { success: false, error: 'No active user session.' };
      await updatePassword(auth.currentUser, newPassword);

      // Keep Firestore document in sync
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docRef = doc(db, 'users', snap.docs[0].id);
        await updateDoc(docRef, { password: newPassword });
      }

      setUser(prev => ({ ...prev, password: newPassword }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addUser = async (userData) => {
    const id = `u_${Date.now()}`;
    const avatar = userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const newUser = { ...userData, id, avatar };
    await setDoc(doc(db, 'users', id), newUser);
    return newUser;
  };

  const updateUser = async (id, data) => {
    await updateDoc(doc(db, 'users', id), data);
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, 'users', id));
  };

  const updateCompany = async (data) => {
    await setDoc(doc(db, 'company', 'info'), data);
  };


  

  return (
    <AuthContext.Provider value={{ user, users, company, loading, login, logout, changePassword, addUser, updateUser, deleteUser, updateCompany }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
