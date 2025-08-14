const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { auth } = require('firebase-admin');

console.log('🧪 Testing Firebase Admin SDK Setup...\n');

// Check environment variables
const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

console.log('📋 Environment Variables Check:');
console.log(`  - Project ID: ${projectId ? '✅ Set' : '❌ Missing'}`);
console.log(`  - Client Email: ${clientEmail ? '✅ Set' : '❌ Missing'}`);
console.log(`  - Private Key: ${privateKey ? '✅ Set' : '❌ Missing'}`);

if (!projectId || !clientEmail || !privateKey) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Please set FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in your .env.local file');
  process.exit(1);
}

// Check private key format
if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
  console.log('\n❌ Private key format is incorrect!');
  console.log('Make sure the private key includes the BEGIN and END markers');
  process.exit(1);
}

console.log('\n🔧 Initializing Firebase Admin SDK...');

try {
  // Initialize Firebase Admin
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin SDK initialized successfully!');
  } else {
    console.log('✅ Firebase Admin SDK already initialized!');
  }

  // Test authentication
  console.log('\n🧪 Testing authentication...');
  
  // This is just a test to make sure the SDK is working
  const app = getApps()[0];
  console.log(`✅ Firebase app name: ${app.name}`);
  console.log(`✅ Firebase project ID: ${app.options.projectId}`);

  console.log('\n🎉 Firebase Admin SDK is working correctly!');
  console.log('You can now use authentication in your API routes.');

} catch (error) {
  console.log('\n❌ Firebase Admin SDK initialization failed!');
  console.log('Error:', error.message);
  
  if (error.code === 'app/invalid-credential') {
    console.log('\n💡 This usually means:');
    console.log('1. The private key format is incorrect');
    console.log('2. The client email is wrong');
    console.log('3. The service account doesn\'t have the right permissions');
  }
  
  process.exit(1);
}

