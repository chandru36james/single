import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "./firebase";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const firestoreStorage = {
  // Site Content
  getContent: async (id: string) => {
    const path = `site_content/${id}`;
    try {
      const docRef = doc(db, "site_content", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      return handleFirestoreError(error, OperationType.GET, path);
    }
  },
  saveContent: async (id: string, content: any) => {
    const path = `site_content/${id}`;
    try {
      const docRef = doc(db, "site_content", id);
      await setDoc(docRef, { ...content, updatedAt: serverTimestamp() });
    } catch (error) {
      return handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Leads
  getLeads: async () => {
    const path = "leads";
    try {
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return handleFirestoreError(error, OperationType.LIST, path);
    }
  },
  addLead: async (lead: any) => {
    const path = "leads";
    try {
      const docRef = await addDoc(collection(db, "leads"), {
        ...lead,
        createdAt: serverTimestamp(),
        status: lead.status || "new"
      });
      return { id: docRef.id, ...lead };
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, path);
    }
  },
  updateLeadStatus: async (id: string, status: string) => {
    const path = `leads/${id}`;
    try {
      const docRef = doc(db, "leads", id);
      await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    } catch (error) {
      return handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },
  deleteLead: async (id: string) => {
    const path = `leads/${id}`;
    try {
      await deleteDoc(doc(db, "leads", id));
    } catch (error) {
      return handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Pages
  getPages: async () => {
    const path = "pages";
    try {
      const querySnapshot = await getDocs(collection(db, "pages"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return handleFirestoreError(error, OperationType.LIST, path);
    }
  },
  savePage: async (id: string | null, page: any) => {
    const path = id ? `pages/${id}` : "pages";
    try {
      // Check for duplicate slug if it's a new page or slug is changing
      const pagesRef = collection(db, "pages");
      const q = query(pagesRef, where("slug", "==", page.slug));
      const querySnapshot = await getDocs(q);
      
      const isDuplicate = querySnapshot.docs.some(doc => doc.id !== id);
      if (isDuplicate) {
        throw new Error(`Slug "${page.slug}" is already in use.`);
      }

      if (id) {
        const docRef = doc(db, "pages", id);
        await updateDoc(docRef, { ...page, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "pages"), {
          ...page,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      return handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  },
  deletePage: async (id: string) => {
    const path = `pages/${id}`;
    try {
      await deleteDoc(doc(db, "pages", id));
    } catch (error) {
      return handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Posts
  getPosts: async () => {
    const path = "posts";
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return handleFirestoreError(error, OperationType.LIST, path);
    }
  },
  savePost: async (id: string | null, post: any) => {
    const path = id ? `posts/${id}` : "posts";
    try {
      // Check for duplicate slug if it's a new post or slug is changing
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("slug", "==", post.slug));
      const querySnapshot = await getDocs(q);
      
      const isDuplicate = querySnapshot.docs.some(doc => doc.id !== id);
      if (isDuplicate) {
        throw new Error(`Slug "${post.slug}" is already in use.`);
      }

      if (id) {
        const docRef = doc(db, "posts", id);
        await updateDoc(docRef, { ...post, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "posts"), {
          ...post,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      return handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  },
  deletePost: async (id: string) => {
    const path = `posts/${id}`;
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      return handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Brochures
  getBrochures: async () => {
    const path = "brochures";
    try {
      const q = query(collection(db, "brochures"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return handleFirestoreError(error, OperationType.LIST, path);
    }
  },
  addBrochure: async (brochure: any) => {
    const path = "brochures";
    try {
      const docRef = await addDoc(collection(db, "brochures"), {
        ...brochure,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...brochure };
    } catch (error) {
      return handleFirestoreError(error, OperationType.CREATE, path);
    }
  },
  deleteBrochure: async (id: string) => {
    const path = `brochures/${id}`;
    try {
      await deleteDoc(doc(db, "brochures", id));
    } catch (error) {
      return handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // Settings
  getSettings: async (id: string = 'global') => {
    const path = `settings/${id}`;
    try {
      const docRef = doc(db, "settings", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      return handleFirestoreError(error, OperationType.GET, path);
    }
  },
  saveSettings: async (id: string, settings: any) => {
    const path = `settings/${id}`;
    try {
      const docRef = doc(db, "settings", id);
      await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() });
    } catch (error) {
      return handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};
