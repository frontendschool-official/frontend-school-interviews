const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testSessionWithProfile() {
  console.log('🧪 Testing Session API with User Profile Data...\n');

  try {
    // Test 1: Check session (should fail without session)
    console.log('1️⃣ Testing GET /api/auth/session (no session)...');
    const checkResponse = await fetch(`${BASE_URL}/api/auth/session`, {
      method: 'GET',
    });
    
    const checkData = await checkResponse.json();
    console.log('Response:', JSON.stringify(checkData, null, 2));
    console.log('Status:', checkResponse.status);
    console.log('');

    // Test 2: Try to create session without token (should fail)
    console.log('2️⃣ Testing POST /api/auth/session (no token)...');
    const createResponse = await fetch(`${BASE_URL}/api/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
    
    const createData = await createResponse.json();
    console.log('Response:', JSON.stringify(createData, null, 2));
    console.log('Status:', createResponse.status);
    console.log('');

    // Test 3: Test user profile API (should fail without auth)
    console.log('3️⃣ Testing GET /api/user-profile/get (no auth)...');
    const profileResponse = await fetch(`${BASE_URL}/api/user-profile/get`, {
      method: 'GET',
    });
    
    const profileData = await profileResponse.json();
    console.log('Response:', JSON.stringify(profileData, null, 2));
    console.log('Status:', profileResponse.status);
    console.log('');

    console.log('✅ Session API tests completed!');
    console.log('\n📝 Expected Results:');
    console.log('- GET /api/auth/session: 401 (no session)');
    console.log('- POST /api/auth/session: 400 (no token)');
    console.log('- GET /api/user-profile/get: 401 (no auth)');
    console.log('\n💡 To test with real authentication:');
    console.log('1. Visit http://localhost:3000/test-optimized-auth');
    console.log('2. Sign in with Google');
    console.log('3. Check browser cookies for session');
    console.log('4. Refresh page to test session persistence');
    console.log('5. Session should now include user profile data');

  } catch (error) {
    console.error('❌ Error testing session API:', error);
  }
}

// Run the test
testSessionWithProfile();
