import { initializePopulationData } from "./dataInitializer";
import { initializeGDPData } from "./dataInitializer";

let hasInitialized = false;

export async function initializeAppData() {
  if (hasInitialized) {
    console.log("Initialization logic has already been run. Skipping...");
    return;
  }

  console.log("Running application data initialization...");
  try {
    await initializePopulationData();
    await initializeGDPData();
  } catch (error) {
    console.error("Error during app initialization:", error);
  } finally {
    hasInitialized = true; // Prevent re-running
    console.log("Initialization logic completed.");
  }
}