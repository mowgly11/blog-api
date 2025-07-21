import dotenv from "dotenv";
import MongoDBConnect from "./backend/database/connect.js";
import AuthCollection from "./backend/database/authCollectionActions.js";
import readline from "readline";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createUser() {
  try {
    // Connect to database
    await MongoDBConnect.connect(process.env.MONGODB_CONNECT_URL);
    console.log("✅ Connected to database");

    // Get username
    const username = await new Promise(resolve => {
      rl.question("Enter username: ", resolve);
    });

    if (!username.trim()) {
      console.log("❌ Username cannot be empty");
      process.exit(1);
    }

    // Get password
    const password = await new Promise(resolve => {
      rl.question("Enter password: ", resolve);
    });

    if (!password.trim()) {
      console.log("❌ Password cannot be empty");
      process.exit(1);
    }

    // Create user
    console.log("🔄 Creating user...");
    const result = await AuthCollection.createUser(username.trim(), password.trim());

    if (result) {
      console.log("✅ User created successfully!");
    } else {
      console.log("❌ Failed to create user");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Handle command line arguments
if (process.argv.length === 4) {
  const [,, username, password] = process.argv;
  
  (async () => {
    try {
      await MongoDBConnect.connect(process.env.MONGODB_CONNECT_URL);
      console.log("✅ Connected to database");
      
      console.log("🔄 Creating user...");
      const result = await AuthCollection.createUser(username, password);
      
      if (result) {
        console.log("✅ User created successfully!");
      } else {
        console.log("❌ Failed to create user");
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
    } finally {
      process.exit(0);
    }
  })();
} else {
  // Interactive mode
  createUser();
} 