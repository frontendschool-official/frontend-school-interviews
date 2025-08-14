#!/usr/bin/env node

/**
 * Environment Variables Check Script
 * Run this script to verify all required environment variables are set
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if it exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.log('⚠️  .env.local file not found. Checking system environment variables...');
}

// Required environment variables
const requiredVars = {
  // Firebase
  'NEXT_PUBLIC_FIREBASE_API_KEY': 'Firebase API Key (Public)',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': 'Firebase Auth Domain (Public)',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID': 'Firebase Project ID (Public)',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': 'Firebase Storage Bucket (Public)',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': 'Firebase Messaging Sender ID (Public)',
  'NEXT_PUBLIC_FIREBASE_APP_ID': 'Firebase App ID (Public)',
  'FIREBASE_ADMIN_PROJECT_ID': 'Firebase Admin Project ID (Private)',
  'FIREBASE_ADMIN_CLIENT_EMAIL': 'Firebase Admin Service Account Email (Private)',
  'FIREBASE_ADMIN_PRIVATE_KEY': 'Firebase Admin Private Key (Private)',
  
  // Razorpay
  'NEXT_PUBLIC_RAZORPAY_KEY_ID': 'Razorpay Key ID (Public)',
  'RAZORPAY_KEY_SECRET': 'Razorpay Key Secret (Private)',
  
  // Gemini
  'NEXT_PUBLIC_GEMINI_API_KEY': 'Gemini API Key (Public)',
};

console.log('🔍 Checking Environment Variables...\n');

let allSet = true;
const results = [];

for (const [key, description] of Object.entries(requiredVars)) {
  const value = process.env[key];
  const isSet = !!value;
  const status = isSet ? '✅' : '❌';
  const displayValue = isSet ? 
    (key.includes('SECRET') || key.includes('PRIVATE_KEY') ? 
      `${value.substring(0, 10)}...` : value) : 
    'NOT SET';
  
  results.push({
    key,
    description,
    status,
    isSet,
    displayValue
  });
  
  if (!isSet) {
    allSet = false;
  }
}

// Display results
results.forEach(({ key, description, status, displayValue }) => {
  console.log(`${status} ${key}`);
  console.log(`   Description: ${description}`);
  console.log(`   Value: ${displayValue}`);
  console.log('');
});

// Summary
console.log('📊 Summary:');
console.log(`Total variables: ${results.length}`);
console.log(`Set: ${results.filter(r => r.isSet).length}`);
console.log(`Missing: ${results.filter(r => !r.isSet).length}`);

if (allSet) {
  console.log('\n🎉 All environment variables are set! Your application should work correctly.');
} else {
  console.log('\n⚠️  Some environment variables are missing. Please set them in your .env.local file.');
  console.log('\n📝 Missing variables:');
  results.filter(r => !r.isSet).forEach(({ key, description }) => {
    console.log(`   - ${key}: ${description}`);
  });
  
  console.log('\n💡 To fix this:');
  console.log('1. Copy env.example to .env.local');
  console.log('2. Fill in the missing values');
  console.log('3. Restart your development server');
}

// Check for common issues
console.log('\n🔧 Additional Checks:');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('   Create it by copying env.example to .env.local');
} else {
  console.log('✅ .env.local file exists');
}

// Check if Firebase config is valid
const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (firebaseApiKey && firebaseApiKey.length < 20) {
  console.log('⚠️  Firebase API Key seems too short - check if it\'s correct');
} else if (firebaseApiKey) {
  console.log('✅ Firebase API Key format looks correct');
}

// Check if Razorpay config is valid
const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
if (razorpayKeyId && !razorpayKeyId.startsWith('rzp_')) {
  console.log('⚠️  Razorpay Key ID should start with "rzp_"');
} else if (razorpayKeyId) {
  console.log('✅ Razorpay Key ID format looks correct');
}

console.log('\n✨ Environment check complete!');
