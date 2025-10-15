// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: "vanguox-702bb.firebaseapp.com",
  projectId: "vanguox-702bb",
  storageBucket: "vanguox-702bb.firebasestorage.app",
  messagingSenderId: "416425412193",
  appId: "1:416425412193:web:580636abe0b457c3a7cc20",
  measurementId: "G-RZ58VKHV31",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };

// Initialize analytics only if on client and supported
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) {
      const analytics = getAnalytics(app);
      return analytics;
    }
  }
  return null;
};
