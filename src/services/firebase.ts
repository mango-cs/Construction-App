import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZv3PbWGSH0UGsSNVm-hAMi_KKCBzRqgU",
  authDomain: "construction-app-7ee8a.firebaseapp.com",
  projectId: "construction-app-7ee8a",
  storageBucket: "construction-app-7ee8a.firebasestorage.app",
  messagingSenderId: "831835599834",
  appId: "1:831835599834:web:e61e694a1dc510c83946e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app; 