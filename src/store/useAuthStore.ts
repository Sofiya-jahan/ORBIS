import { create } from 'zustand';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { syncUserProfileToNeon } from '../services/neonService';

interface UserProfile {
  name: string;
  email: string;
  id: string;
  department: string;
  contact: string;
  lastLogin: string;
  photoURL?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  theme: 'light' | 'dark';
  organization: string | null;
  role: string | null;
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  
  // Actions
  initAuthListener: () => void;
  logout: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark') => void;
  setOrganization: (org: string) => void;
  setRole: (role: string) => void;
  verifyPIN: (pin: string) => Promise<boolean>;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateUser: (partial: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isAuthLoaded: false,
  theme: 'light',
  organization: null,
  role: null,
  user: null,
  firebaseUser: null,

  initAuthListener: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch their profile from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            set({
              isAuthenticated: true,
              firebaseUser: user,
              user: {
                name: data.name || user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                id: data.id || user.uid.substring(0, 8).toUpperCase(),
                department: data.department || 'General',
                contact: data.contact || '',
                photoURL: data.photoURL || user.photoURL || '',
                lastLogin: new Date().toLocaleString()
              },
              organization: data.organization || null,
              role: data.role || null,
              isAuthLoaded: true
            });
          } else {
            // Profile doesn't exist yet (just signed up)
            set({
              isAuthenticated: true,
              firebaseUser: user,
              user: {
                name: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                id: user.uid.substring(0, 8).toUpperCase(),
                department: 'General',
                contact: '',
                photoURL: user.photoURL || '',
                lastLogin: new Date().toLocaleString()
              },
              isAuthLoaded: true
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({ 
            isAuthenticated: true, 
            firebaseUser: user, 
            user: {
              name: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              id: user.uid.substring(0, 8).toUpperCase(),
              department: 'General',
              contact: '',
              photoURL: user.photoURL || '',
              lastLogin: new Date().toLocaleString()
            },
            isAuthLoaded: true 
          });
        }
      } else {
        // User is signed out
        document.documentElement.removeAttribute('data-org');
        set({ 
          isAuthenticated: false, 
          firebaseUser: null, 
          user: null, 
          organization: null, 
          role: null, 
          isAuthLoaded: true 
        });
      }
    });
  },
  
  logout: async () => {
    await signOut(auth);
    document.documentElement.removeAttribute('data-org');
    set({ isAuthenticated: false, organization: null, role: null, user: null, firebaseUser: null });
  },
  
  login: async (email, password) => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(auth, email, password);
  },

  register: async (email, password, name?: string) => {
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (name && res.user) {
      try {
        await updateProfile(res.user, { displayName: name });
      } catch (e) {
        console.warn('Could not update displayName:', e);
      }
      try {
        const userDocRef = doc(db, 'users', res.user.uid);
        await setDoc(userDocRef, {
          name: name,
          email: res.user.email || email,
          id: res.user.uid.substring(0, 8).toUpperCase(),
          department: 'Executive Governance',
          contact: '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Could not save initial user doc to Firestore:', e);
      }
    }
  },

  loginWithGoogle: async () => {
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Proactively persist or merge profile if Firestore is reachable
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          id: user.uid.substring(0, 8).toUpperCase(),
          department: 'General',
          contact: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }, { merge: true });
      } else {
        await setDoc(userDocRef, {
          lastLogin: new Date().toISOString(),
          photoURL: user.photoURL || ''
        }, { merge: true });
      }
    } catch (e) {
      console.warn("Could not save initial user doc to Firestore:", e);
    }
  },

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  setOrganization: (org) => {
    set({ organization: org });
  },

  setRole: (role) => set({ role }),

  verifyPIN: async (pin) => {
    const { organization, role, firebaseUser, user } = get();
    if (!organization || !role || !firebaseUser) return false;

    try {
      // 1. Verify PIN against Firestore organizations collection
      const orgRef = doc(db, 'organizations', organization.toLowerCase());
      const orgDoc = await getDoc(orgRef);
      
      let isValid = false;
      if (orgDoc.exists()) {
        const data = orgDoc.data();
        if (data.pin === pin) {
          isValid = true;
        }
      } else {
        // Fallback for development if the document doesn't exist
        if (pin === '123456') {
          isValid = true;
        }
      }

      if (isValid) {
        // 2. Save organization and role to user profile
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, {
          name: user?.name,
          email: firebaseUser.email,
          id: user?.id,
          department: user?.department,
          contact: user?.contact,
          organization: organization,
          role: role,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // Force local state update just in case
        set({ organization, role });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verifying PIN:", error);
      return false;
    }
  },

  updateUser: (partial) => {
    const { user, organization, role, firebaseUser } = get();
    if (user) {
      const updatedUser = { ...user, ...partial };
      set({ user: updatedUser });

      // Synchronize updated user profile directly to Neon PostgreSQL DB
      syncUserProfileToNeon({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        organization: organization || undefined,
        role: role || undefined,
        department: updatedUser.department,
        contact: updatedUser.contact,
        photoURL: updatedUser.photoURL
      }).catch(err => console.warn('Neon profile sync warning:', err));

      // Sync to Firestore if authenticated
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        setDoc(userDocRef, { ...partial, updatedAt: new Date().toISOString() }, { merge: true })
          .catch(err => console.warn('Firestore profile sync warning:', err));
      }
    }
  }
}));
