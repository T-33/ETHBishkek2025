import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the entire Hephaestus Protocol: GameItems, EconomyController, and Lootbox.
 * It also handles the post-deploy wiring of ownership and permissions.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployHephaestusProtocol: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get } = hre.deployments;

  const initialOwner = "0x0Da5B502C97a8340F9677026641E2AADf7cFCa5D";
  console.log("🚀 Deploying Hephaestus Protocol...");

  // ----------------- DEPLOYMENT -----------------

  // 1. Deploy the GameItems contract
  // You must replace this with your actual IPFS CID from Pinata!
  const baseURI = "ipfs://bafybeif4h6amxotyx5xdud5lwydpxmairclfxlpzn76ccpy5adzyfn3hbq"; // <-- IMPORTANT: REPLACE THIS
  await deploy("GameItems", {
    from: deployer,
    args: [baseURI, initialOwner], // The baseURI is a constructor argument
    log: true,
    autoMine: true, // Speeds up local deployments
  });
  const gameItemsDeployment = await get("GameItems");
  console.log("✅ GameItems deployed to:", gameItemsDeployment.address);

  // 2. Deploy the EconomyController contract
  await deploy("EconomyController", {
    from: deployer,
    args: [gameItemsDeployment.address, initialOwner], // Pass the GameItems address to the constructor
    log: true,
    autoMine: true,
  });
  const economyControllerDeployment = await get("EconomyController");
  console.log("✅ EconomyController deployed to:", economyControllerDeployment.address);

  // 3. Deploy the Lootbox contract
  await deploy("Lootbox", {
    from: deployer,
    args: [economyControllerDeployment.address, initialOwner], // Pass the EconomyController address to the constructor
    log: true,
    autoMine: true,
  });
  const lootboxDeployment = await get("Lootbox");
  console.log("✅ Lootbox deployed to:", lootboxDeployment.address);

  // ----------------- POST-DEPLOY WIRING -----------------

  console.log("\n🔗 Wiring contracts together...");

  // 4. Transfer ownership of GameItems to EconomyController
  // This is so only the controller can mint new items.
  const gameItemsContract = await hre.ethers.getContractAt("GameItems", gameItemsDeployment.address);
  const economyControllerContract = await hre.ethers.getContractAt(
    "EconomyController",
    economyControllerDeployment.address,
  );
  const lootBoxContract = await hre.ethers.getContractAt("Lootbox", lootboxDeployment.address);

  const gameItemsOwner = await gameItemsContract.owner();
  console.log("GameItems Owber:", gameItemsOwner);
  if (gameItemsOwner === deployer) {
    console.log("... Transferring GameItems ownership to EconomyController");
    await gameItemsContract.transferOwnership(economyControllerContract.address);
    console.log("... Ownership transferred!");
  }

  // 5. Transfer ownership of Lootbox to EconomyController
  // This is so the controller can, for example, change the lootbox price in the future.
  const lootboxOwner = await lootBoxContract.owner();
  if (lootboxOwner === deployer) {
    console.log("... Transferring Lootbox ownership to EconomyController");
    await lootBoxContract.transferOwnership(economyControllerContract.address);
    console.log("... Ownership transferred!");
  }

  // 6. Set the Lootbox address in the EconomyController
  // This is a critical security step to authorize the lootbox to request mints.
  console.log("... Setting authorized Lootbox address in EconomyController");
  console.log("lootBoxContract:", lootBoxContract);
  // console.log("lootBoxContract address:", lootBoxContract.address);
  // await economyControllerContract.setLootboxAddress("0x59b670e9fA9D0A427751Af201D676719a970857b");
  console.log("... Lootbox address authorized!");

  console.log("\n🎉 Hephaestus Protocol deployed and configured successfully!");
};

export default deployHephaestusProtocol;

// Tags are useful for running partial deployments
deployHephaestusProtocol.tags = ["Hephaestus", "GameItems", "EconomyController", "Lootbox"];
