#!/usr/bin/env node

/**
 * Simple script to test the concept functionality
 */

console.log('🐾 Pet Service Marketplace - Concept Test');
console.log('=========================================');

const testAccounts = [
  { email: 'admin@example.com', password: 'admin', role: 'OWNER' },
  { email: 'user@example.com', password: 'user', role: 'OWNER' },
  { email: 'provider@example.com', password: 'provider', role: 'PROVIDER' }
];

console.log('\n📝 Test Accounts Available:');
testAccounts.forEach(account => {
  console.log(`   ${account.email} / ${account.password} (${account.role})`);
});

console.log('\n🚀 To test the concept:');
console.log('   1. Run: npm run dev');
console.log('   2. Open: http://localhost:3000');
console.log('   3. Login with any test account above');
console.log('   4. Explore the dashboard for different roles');

console.log('\n✅ Mock authentication is enabled by default');
console.log('   Set NEXT_PUBLIC_USE_MOCK_API=false to use real database');

console.log('\n🎉 Happy testing! 🐕');
