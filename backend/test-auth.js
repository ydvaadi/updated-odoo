// Simple test script to verify backend authentication
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api';

async function testAuth() {
  console.log('Testing authentication endpoints...\n');

  try {
    // Test registration
    console.log('1. Testing registration...');
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);
    console.log('Status:', registerResponse.status);

    if (registerResponse.ok) {
      console.log('✅ Registration successful!');
      
      // Test login
      console.log('\n2. Testing login...');
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      console.log('Status:', loginResponse.status);

      if (loginResponse.ok) {
        console.log('✅ Login successful!');
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Registration failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth();

