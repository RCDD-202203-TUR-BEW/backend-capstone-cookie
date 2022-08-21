const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const url = process.env.DB_URL;

const connectToMongo = () => {
  mongoose.connect(url, { useNewUrlParser: true });

  const db = mongoose.connection;

  db.once('open', () => {
    console.log('Database connected: ', url);
  });

  // err deleted
  db.on('error', (err) => {
    console.error('Database connection error: ', err);
  });
};

module.exports = {
  connectToMongo,

  // for testing purposes
  clearDatabase: async () => {
    const keepIDs = {
      users: ['63017b363dbead97f329ba6e'],
    };
    const { collections } = mongoose.connection;
    await collections.users.deleteMany({
      _id: { $not: { $in: keepIDs.users.map(ObjectId) } },
    });
  },
};
