const bcrypt = require('bcryptjs');

async function generateHashes() {
  const passwords = ['admin', 'user', 'provider'];

  for (const password of passwords) {
    const hash = await bcrypt.hash(password, 12);
    console.log(`${password}: ${hash}`);
  }
}

generateHashes();
