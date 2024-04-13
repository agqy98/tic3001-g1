const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://admin:admin-user-service@:your_port/your_database';

// Create a new MongoClient
const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to the MongoDB server
    await client.connect();

    console.log('Connected to the MongoDB server');

    // Use the client to interact with the database
    const database = client.db('your_database');

    // Perform database operations (e.g., CRUD operations)

  } catch (error) {
    console.error('Error connecting to the MongoDB server:', error);
  } finally {
    // Close the connection when done
    await client.close();
  }
}

main();
