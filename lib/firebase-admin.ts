import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function parsePrivateKey(value: string) {
    return value.replace(/\\n/g, '\n');
}

function getFirebaseConfig() {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const databaseId = process.env.FIREBASE_DATABASE_ID;

    if (!projectId || !clientEmail || !privateKey) {
        return null;
    }

    return {
        projectId,
        clientEmail,
        privateKey: parsePrivateKey(privateKey),
        databaseId,
    };
}

export function isFirebaseConfigured() {
    return !!getFirebaseConfig();
}

export function getFirebaseDb() {
    const config = getFirebaseConfig();
    if (!config) {
        throw new Error('Firebase credentials are not configured');
    }

    if (!getApps().length) {
        initializeApp({
            credential: cert(config),
            projectId: config.projectId,
        });
    }

    return config.databaseId ? getFirestore(config.databaseId) : getFirestore();
}
