export const isFirebaseAdminConfigured = (): boolean => {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedApp: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedFirestore: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedAuth: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAdminApp(): any | null {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }
  if (cachedApp) return cachedApp;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getApps, initializeApp, cert } = require("firebase-admin/app");
    const currentApps = getApps();
    if (currentApps.length > 0) {
      cachedApp = currentApps[0];
      return cachedApp;
    }

    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey?.startsWith('"') && privateKey?.endsWith('"')) {
      try {
        privateKey = JSON.parse(privateKey);
      } catch {
        // ignore parse error if plain string
      }
    }
    privateKey = privateKey?.replace(/\\n/g, "\n");

    cachedApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
    return cachedApp;
  } catch (error) {
    console.warn("Failed to initialize Firebase Admin SDK:", error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAdminFirestore(): any | null {
  if (!isFirebaseAdminConfigured()) return null;
  if (cachedFirestore) return cachedFirestore;
  const app = getAdminApp();
  if (!app) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getFirestore } = require("firebase-admin/firestore");
    cachedFirestore = getFirestore(app);
    return cachedFirestore;
  } catch (error) {
    console.warn("Failed to get Firestore from Firebase Admin:", error);
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAdminAuth(): any | null {
  if (!isFirebaseAdminConfigured()) return null;
  if (cachedAuth) return cachedAuth;
  const app = getAdminApp();
  if (!app) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAuth } = require("firebase-admin/auth");
    cachedAuth = getAuth(app);
    return cachedAuth;
  } catch (error) {
    console.warn("Failed to get Auth from Firebase Admin:", error);
    return null;
  }
}
