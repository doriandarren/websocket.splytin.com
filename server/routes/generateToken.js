const jwt = require('jsonwebtoken');

const SECRET_KEY = 'token-public-123';



const generateToken = (username) => {
  const payload = { username };
  const options = { expiresIn: '24h' };
  const token = jwt.sign(payload, SECRET_KEY, options);
  //console.log(`Generated JWT Token for ${username}:`, token);
  return token;
};

const token1 = generateToken('user1');
const token2 = generateToken('user2');
const token3 = generateToken('user3');

console.log(`Token for user1: ${token1}`);
console.log(`Token for user2: ${token2}`);
console.log(`Token for user3: ${token3}`);