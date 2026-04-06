import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromCache, getDocFromServer } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

const isPlaceholder = (config: any) => {
  return !config || !config.projectId || config.projectId.includes("REPLACE_WITH_YOUR_PROJECT_ID");
};

if (isPlaceholder(firebaseConfig)) {
  console.warn("Firebase configuration is missing or contains placeholders. Please update firebase-applet-config.json.");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Connection test as required by instructions
async function testConnection() {
  try {
    console.log("Firebase: Testing Firestore connection...");
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firebase: Firestore connection successful");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase: Please check your Firebase configuration. The client is offline.");
    } else {
      console.log("Firebase: Connection test finished (expected error if doc missing is fine)");
    }
  }
}
testConnection();

export default app;
