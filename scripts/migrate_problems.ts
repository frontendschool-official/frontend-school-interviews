import { getFirestore } from 'firebase-admin/firestore';
import {
  initializeApp,
  cert,
  ServiceAccount,
  getApps,
} from 'firebase-admin/app';
import { problemSchema } from '@workspace/schemas';
import { createId, nowUnixMs } from '@workspace/utils';

const run = async () => {
  // Assumes admin SDK already configured elsewhere in the app; if not, do minimal init
  if (!getApps().length) {
    try {
      const creds: ServiceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      } as ServiceAccount;
      initializeApp({ credential: cert(creds) });
    } catch {
      // noop: already initialized
    }
  }

  const db = getFirestore();
  const src = db.collection('problems');
  const snap = await src.get();
  let migrated = 0;
  for (const doc of snap.docs) {
    const data = doc.data() as any;
    const id = data.id ?? doc.id ?? createId();
    const now = nowUnixMs();
    const mapped = {
      schemaVersion: '1.0.0',
      id,
      title: data.title ?? 'Untitled',
      company: data.company ?? undefined,
      role: data.role ?? undefined,
      round: data.round ?? undefined,
      source: data.source ?? 'admin',
      visibility: data.visibility ?? 'admin',
      ownerId: data.ownerId ?? null,
      createdAt: data.createdAt ?? now,
      updatedAt: now,
      kind: data.kind ?? 'theory',
      content: data.content ?? { prompt: 'TBD', difficulty: 'medium' },
    };

    try {
      const valid = problemSchema.parse(mapped);
      await src.doc(String(id)).set(valid);
      migrated += 1;
    } catch (e) {
      console.error(`Failed to migrate ${doc.id}:`, e);
    }
  }
  console.log(`Migrated ${migrated}/${snap.size} problems to schema v1.0.0`);
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});
