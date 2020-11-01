const { SecretBox } = require('daf-libsodium');
const key = '41f569b3828c4ead9e0d94d4d2a57cc2'

async function bla() {
    const secretKey = await SecretBox.createSecretKey(key);
    console.log(secretKey);
}

bla();