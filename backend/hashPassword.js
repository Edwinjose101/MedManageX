const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'admin1234';  // Replace with your desired password
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Bcrypt hash:', hash);
}

hashPassword();
