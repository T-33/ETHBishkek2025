import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

/**
 * Simple script to import a private key for zkSync deployment
 * This bypasses the Hardhat plugin conflicts
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("=".repeat(60));
  console.log("🔑 Import Private Key for zkSync Deployment");
  console.log("=".repeat(60));
  console.log("");

  const privateKey = await question("Enter your private key (with or without 0x prefix): ");

  if (!privateKey || privateKey.trim() === "") {
    console.error("❌ Error: Private key cannot be empty");
    process.exit(1);
  }

  // Normalize private key (add 0x if missing)
  const normalizedKey = privateKey.trim().startsWith("0x") ? privateKey.trim() : `0x${privateKey.trim()}`;

  // Validate private key format (should be 66 characters with 0x prefix)
  if (normalizedKey.length !== 66) {
    console.error("❌ Error: Invalid private key length. Expected 64 hex characters (66 with 0x prefix)");
    process.exit(1);
  }

  // Check if .env file exists
  const envPath = path.join(__dirname, "..", ".env");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
    console.log("📄 Found existing .env file");
  } else {
    console.log("📄 Creating new .env file");
  }

  // Update or add __RUNTIME_DEPLOYER_PRIVATE_KEY
  const keyName = "__RUNTIME_DEPLOYER_PRIVATE_KEY";
  const keyRegex = new RegExp(`^${keyName}=.*$`, "m");

  if (keyRegex.test(envContent)) {
    // Replace existing key
    envContent = envContent.replace(keyRegex, `${keyName}=${normalizedKey}`);
    console.log(`✅ Updated ${keyName} in .env file`);
  } else {
    // Add new key
    if (envContent && !envContent.endsWith("\n")) {
      envContent += "\n";
    }
    envContent += `${keyName}=${normalizedKey}\n`;
    console.log(`✅ Added ${keyName} to .env file`);
  }

  // Write to .env file
  fs.writeFileSync(envPath, envContent);

  console.log("");
  console.log("=".repeat(60));
  console.log("✅ Private key successfully imported!");
  console.log("=".repeat(60));
  console.log("");
  console.log("You can now deploy to zkSync with:");
  console.log("  yarn deploy:zksync");
  console.log("");

  rl.close();
}

main().catch(error => {
  console.error("❌ Error:", error);
  process.exit(1);
});
