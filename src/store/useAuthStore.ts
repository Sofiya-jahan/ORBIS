import { create } from 'zustand';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { syncUserProfileToNeon } from '../services/neonService';
import { 
  clearSecuritySession, 
  updateSecuritySessionRole, 
  verifySecuritySession, 
  logSecurityEvent,
  sanitizeInput
} from '../services/securityService';
import { ORGANIZATIONS } from '../config/platformConfig';
import { formatUserName } from '../utils/userUtils';

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
  loginAsDemo: (customEmail?: string, customName?: string) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isAuthLoaded: false,
  theme: (typeof window !== 'undefined' && (localStorage.getItem('orbis_theme') as 'light' | 'dark')) || 'dark',
  organization: null,
  role: null,
  user: null,
  firebaseUser: null,

  initAuthListener: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, fetch their profile from Firestore
        const fallbackOrg = get().organization || 'hospital';
        const fallbackRole = get().role || 'cmo';
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            set({
              isAuthenticated: true,
              firebaseUser: user,
              user: {
                name: formatUserName(data.name || user.displayName, user.email),
                email: user.email || '',
                id: data.id || user.uid.substring(0, 8).toUpperCase(),
                department: data.department || 'General',
                contact: data.contact || '',
                photoURL: data.photoURL || user.photoURL || '',
                lastLogin: new Date().toLocaleString()
              },
              organization: data.organization || fallbackOrg,
              role: data.role || fallbackRole,
              isAuthLoaded: true
            });
          } else {
            // Profile doesn't exist yet (just signed up)
            set({
              isAuthenticated: true,
              firebaseUser: user,
              user: {
                name: formatUserName(user.displayName, user.email),
                email: user.email || '',
                id: user.uid.substring(0, 8).toUpperCase(),
                department: 'General',
                contact: '',
                photoURL: user.photoURL || '',
                lastLogin: new Date().toLocaleString()
              },
              organization: fallbackOrg,
              role: fallbackRole,
              isAuthLoaded: true
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({ 
            isAuthenticated: true, 
            firebaseUser: user, 
            user: {
              name: formatUserName(user.displayName, user.email),
              email: user.email || '',
              id: user.uid.substring(0, 8).toUpperCase(),
              department: 'General',
              contact: '',
              photoURL: user.photoURL || '',
              lastLogin: new Date().toLocaleString()
            },
            organization: fallbackOrg,
            role: fallbackRole,
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
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    clearSecuritySession();
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
          name: formatUserName(user.displayName, user.email),
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

  loginAsDemo: (customEmail?: string, customName?: string) => {
    const org = get().organization || 'hospital';
    const currentOrg = ORGANIZATIONS[org] || ORGANIZATIONS.hospital;
    const defaultRole = get().role || (currentOrg.roles[0]?.id || 'cmo');
    const defaultEmail = customEmail || `executive@${currentOrg.id}.orbis.ai`;
    const defaultName = customName || (currentOrg.roles.find(r => r.id === defaultRole)?.title || 'Chief Executive Officer');

    set({
      isAuthenticated: true,
      user: {
        name: defaultName,
        email: defaultEmail,
        id: `DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        department: 'Executive Governance',
        contact: '+1 (555) 019-2834',
        lastLogin: new Date().toLocaleString()
      },
      organization: org,
      role: defaultRole,
      isAuthLoaded: true
    });
  },

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orbis_theme', theme);
    }
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  setOrganization: (org: string) => {
    const validOrg = (ORGANIZATIONS as any)[org] ? org : (Object.keys(ORGANIZATIONS).includes(org.toLowerCase()) ? org.toLowerCase() : 'hospital');
    const prevOrg = get().organization;
    
    if (prevOrg && prevOrg.toLowerCase() !== validOrg.toLowerCase()) {
      // Switching tenants requires re-verification of the target tenant's key
      const session = verifySecuritySession();
      if (session.session && session.session.organization.toLowerCase() !== validOrg.toLowerCase()) {
        clearSecuritySession();
      }
      logSecurityEvent(
        'KEY_ROTATED',
        'INFO',
        `Tenant switch requested from '${prevOrg}' to '${validOrg}'. Security session aligned.`,
        get().user?.email || 'operator@orbis.ai'
      );
    }
    set({ organization: validOrg });
  },

  setRole: (role: string) => {
    const cleanRole = sanitizeInput(role);
    // Synchronize cryptographic signature if session exists
    updateSecuritySessionRole(cleanRole);
    set({ role: cleanRole });
  },

  verifyPIN: async (pin) => {
    const { organization, role, firebaseUser, user } = get();
    // If institutional key is not provided, default to 123456
    const effectivePin = (!pin || pin.trim() === '') ? '123456' : pin.trim();

    try {
      let isValid = false;
      // Default institutional master key is always 123456
      if (effectivePin === '123456') {
        isValid = true;
      } else if (organization) {
        const orgRef = doc(db, 'organizations', organization.toLowerCase());
        const orgDoc = await getDoc(orgRef);
        if (orgDoc.exists()) {
          const data = orgDoc.data();
          if (data.pin === effectivePin) {
            isValid = true;
          }
        }
      }

      if (isValid) {
        if (firebaseUser) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            await setDoc(userDocRef, {
              name: user?.name,
              email: firebaseUser.email,
              id: user?.id,
              department: user?.department,
              contact: user?.contact,
              organization: organization || 'hospital',
              role: role || 'admin',
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (e) {
            console.warn("Could not save to firestore in verifyPIN:", e);
          }
        }

        // Guarantee fully authenticated session with selected org and role
        set({ 
          isAuthenticated: true, 
          organization: organization || 'hospital', 
          role: role || 'admin' 
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verifying PIN:", error);
      if (effectivePin === '123456') {
        set({ 
          isAuthenticated: true, 
          organization: organization || 'hospital', 
          role: role || 'admin' 
        });
        return true;
      }
      return false;
    }
  },

  updateUser: (partial) => {
    const { user, organization, role, firebaseUser } = get();
    if (user) {
      const updatedUser = { 
        ...user, 
        ...partial,
        name: partial.name !== undefined ? formatUserName(partial.name, user.email) : user.name
      };
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
