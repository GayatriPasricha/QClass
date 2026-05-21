const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./src/models/User');
  const users = await User.find({});
  console.log('Users in DB:');
  users.forEach(u => console.log(u.email));
  process.exit(0);
});
