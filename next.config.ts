import type { NextConfig } from "next";
import { initializeAppData } from "./lib/initializeAppData";

// Perform initialization when the server starts
(async () => {
  try {
    await initializeAppData();
    console.log("Data initialization completed.");
  } catch (error) {
    console.error("Failed to initialize data during server startup:", error);
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;