const {MongoClient} = require('mongodb');

const uri = process.env.DB_URL;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Failed to connect to MongoDB', err);
  }
}

connect();

module.exports = client;
