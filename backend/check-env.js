// Check environment variables
require('dotenv').config();

console.log('Environment Variables Check:');
console.log('==========================');

const requiredVars = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'PORT',
  'NODE_ENV',
  'FRONTEND_URL'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***' : value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allPresent = false;
  }
});

console.log('\nDatabase URL check:');
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl.includes('postgresql://')) {
    console.log('✅ Database URL format looks correct');
  } else {
    console.log('❌ Database URL format might be incorrect');
  }
} else {
  console.log('❌ DATABASE_URL not set');
}

console.log('\nJWT Secrets check:');
if (process.env.JWT_ACCESS_SECRET && process.env.JWT_REFRESH_SECRET) {
  if (process.env.JWT_ACCESS_SECRET.length >= 32 && process.env.JWT_REFRESH_SECRET.length >= 32) {
    console.log('✅ JWT secrets are set and have sufficient length');
  } else {
    console.log('❌ JWT secrets might be too short (should be at least 32 characters)');
  }
} else {
  console.log('❌ JWT secrets not properly set');
}

if (allPresent) {
  console.log('\n🎉 All required environment variables are present!');
} else {
  console.log('\n⚠️  Some environment variables are missing. Please check your .env file.');
}

