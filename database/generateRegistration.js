const bcrypt = require('bcrypt');
const fs = require('fs');

const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    { username: 'user3', password: 'password3' },
    { username: 'user4', password: 'password4' },
    { username: 'user5', password: 'password5' },
    { username: 'user6', password: 'password6' },
    { username: 'user7', password: 'password7' },
    { username: 'user8', password: 'password8' },
    { username: 'user9', password: 'password9' },
    { username: 'user10', password: 'password10' },
];

const hashPasswords = async () => {
    const registrations = await Promise.all(users.map(async (user) => {
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(user.password, salt); // Hash the password
        return { username: user.username, password: hashedPassword };
    }));

    fs.writeFileSync('registration.json', JSON.stringify(registrations, null, 2));
    console.log('registration.json has been created with hashed passwords.');
};

hashPasswords().catch(console.error);
