import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import dotenv from 'dotenv';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectRoot = path.resolve(process.cwd());
dotenv.config({ path: path.join(projectRoot, '.env.local') });

function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env: ${name}`);
    }
    return value;
}

function getDb() {
    const databaseId = process.env.FIREBASE_DATABASE_ID;

    if (!getApps().length) {
        initializeApp({
            credential: cert({
                projectId: requireEnv('FIREBASE_PROJECT_ID'),
                clientEmail: requireEnv('FIREBASE_CLIENT_EMAIL'),
                privateKey: requireEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
            }),
            projectId: requireEnv('FIREBASE_PROJECT_ID'),
        });
    }

    return databaseId ? getFirestore(databaseId) : getFirestore();
}

async function seedCollection(db, collectionName, rows) {
    for (const row of rows) {
        const data = { ...row };
        const docId = typeof data.id === 'string' ? data.id : null;
        delete data.id;

        if (docId) {
            await db.collection(collectionName).doc(docId).set(data, { merge: true });
        } else {
            await db.collection(collectionName).add(data);
        }
    }
}

async function main() {
    const schemaPath = path.join(projectRoot, 'firebase-schema-example.json');
    const raw = fs.readFileSync(schemaPath, 'utf8');
    const payload = JSON.parse(raw);
    const db = getDb();

    const collections = Object.entries(payload);
    for (const [collectionName, rows] of collections) {
        if (!Array.isArray(rows)) continue;
        await seedCollection(db, collectionName, rows);
        console.log(`Seeded ${rows.length} row(s) into ${collectionName}`);
    }

    console.log('Firestore seed completed.');
}

main().catch((error) => {
    console.error('Firestore seed failed:', error.message);
    process.exit(1);
});
