const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

let store = null;
async function getStore() {
 if (!store) {
  const Store = (await import("electron-store")).default;
  store = new Store();
 }
 return store;
}

function getResourcePath(...relativePath) {
 if (process.mainModule.filename.includes("app.asar")) {
  return path.join(process.resourcesPath, "extra-packages", ...relativePath);
 }
 return path.join(__dirname, "..", "src", "extra-packages", ...relativePath);
}

function startRustDesk(rustDeskPath, env = {}) {
 try {
  const platform = process.platform;
  if (platform === "linux") {
   try {
    const process = spawn("/usr/bin/rustdesk", {
     detached: true,
     stdio: "ignore",
    });
    process.unref();
    console.log("🚀 RustDesk started via systemd/fallback");
    return;
   } catch {
    console.log("⚠️ Failed systemd start, using spawn directly...");
   }
  }

  const child = spawn(rustDeskPath, [], {
   detached: true,
   stdio: "ignore",
   env: { ...process.env, ...env },
  });
  child.unref();
  console.log("🚀 RustDesk started in background:", rustDeskPath);
 } catch (err) {
  console.error("❌ Error starting RustDesk:", err.message);
 }
}

function getRustDeskId(rustDeskPath) {
 try {
  const id = execSync(`"${rustDeskPath}" --get-id`, { timeout: 15000 })
   .toString()
   .trim();
  return id && /^\d+$/.test(id) && id.length >= 5 ? id : null;
 } catch {
  return null;
 }
}

async function waitForRustDeskId(
 rustDeskPath,
 maxAttempts = 60,
 delayMs = 5000
) {
 console.log(
  `⏳ Waiting for RustDesk ID (up to ${maxAttempts * delayMs}ms)...`
 );
 for (let i = 0; i < maxAttempts; i++) {
  const id = getRustDeskId(rustDeskPath);
  if (id) {
   console.log(`✅ RustDesk ID obtained: ${id}`);
   return id;
  }
  await new Promise((resolve) => setTimeout(resolve, delayMs));
 }
 console.error("❌ RustDesk did not provide a valid ID in time.");
 return null;
}

async function tryManualDebInstall(rustDeskDebPath) {
 if (!fs.existsSync(rustDeskDebPath)) return false;

 try {
  execSync(`sudo -n dpkg -i "${rustDeskDebPath}" 2>&1`, {
   timeout: 30000,
   stdio: "pipe",
  });
  console.log("✅ RustDesk installed via sudo");
  return true;
 } catch {
  execSync(
   `pkexec env DEBIAN_FRONTEND=noninteractive dpkg -i "${rustDeskDebPath}"`,
   {
    timeout: 90000,
    stdio: "inherit",
   }
  );
  console.log("✅ RustDesk installed via pkexec");
  return true;
 }
}

async function installRustDesk() {
 const platform = process.platform;
 const store = await getStore();

 const fixedPassword = "Jobibox@Remote";
 let rustDeskPath,
  rustDeskConfPath,
  rustDeskId = null;

 if (platform === "linux") {
  rustDeskPath = "/usr/bin/rustdesk";
  const configDir = path.join(process.env.HOME, ".config", "rustdesk");
  rustDeskConfPath = path.join(configDir, "RustDesk.toml");

  if (!fs.existsSync(rustDeskPath)) {
   console.log("⚠️ RustDesk binary not found, attempting installation...");
   const debPath = getResourcePath("rustdesk", "rustdesk-1.4.2-x86_64.deb");
   const installed = await tryManualDebInstall(debPath);
   if (!installed)
    return console.error("❌ Cannot install RustDesk automatically.");
  }

  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

  try {
   execSync("pkill -9 rustdesk || true", { timeout: 5000, stdio: "ignore" });
   console.log("🛑 Existing RustDesk processes killed.");
   // Aguarda um pouco para garantir que o processo foi encerrado
   await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch {
   console.log("ℹ️ No RustDesk service running.");
  }

  try {
   execSync(`"${rustDeskPath}" --password "${fixedPassword}"`, {
    timeout: 5000,
   });
   console.log("🔐 Permanent password set via CLI on stopped binary (Linux)");

   let tomlContent = fs.readFileSync(rustDeskConfPath, "utf8");
   if (
    tomlContent.includes("password = ''") ||
    !tomlContent.includes("password")
   ) {
    console.warn(
     "⚠️ Primary password command failed to persist in TOML. Trying '--set-password' fallback..."
    );
    try {
     execSync(`"${rustDeskPath}" --password "${fixedPassword}"`, {
      timeout: 45000,
     });
     console.log("🔐 Password set via '--set-password' fallback.");
     await new Promise((resolve) => setTimeout(resolve, 2000));

     tomlContent = fs.readFileSync(rustDeskConfPath, "utf8");
     if (
      tomlContent.includes("password = ''") ||
      !tomlContent.includes("password")
     ) {
      console.error(
       "❌ Fallback also failed to persist password. Manual intervention may be needed."
      );
     } else {
      console.log("✅ Fallback successful: Password key found in TOML.");
     }
    } catch (err2) {
     console.error("❌ Fallback password command failed:", err2.message);
    }
   } else {
    console.log(
     "✅ Password setting check passed (found 'password' key in TOML)."
    );
   }
  } catch (err) {
   console.error("❌ Primary password CLI method failed (Linux):", err.message);
  }

  startRustDesk(rustDeskPath);

  rustDeskId = await waitForRustDeskId(rustDeskPath);
  if (!rustDeskId) return;
 } else if (platform === "win32") {
  const appData =
   process.env.LOCALAPPDATA || path.join(process.env.APPDATA, "..", "Local");
  rustDeskPath = path.join(appData, "RustDesk", "RustDesk.exe");
  rustDeskConfPath = path.join(appData, "RustDesk", "RustDesk.toml");

  if (!fs.existsSync(rustDeskPath))
   return console.error("❌ RustDesk executable not found.");

  try {
   execSync("taskkill /F /IM rustdesk.exe /T", {
    timeout: 5000,
    stdio: "ignore",
   });
   await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch {}

  try {
   execSync(`"${rustDeskPath}" --password "${fixedPassword}" --password`, {
    timeout: 15000,
    stdio: "pipe",
   });
   console.log("🔐 Permanent password set via CLI on stopped binary (Windows)");
  } catch (err) {
   console.error("❌ Failed to set password (Windows):", err.message);
  }

  startRustDesk(rustDeskPath);

  rustDeskId = await waitForRustDeskId(rustDeskPath);
  if (!rustDeskId) return;
 } else {
  return console.error("❌ Unsupported platform:", platform);
 }

 try {
  store.set("rustdeskConfig", {
   rustdeskId: rustDeskId,
   rustdeskPassword: fixedPassword,
   timestamp: new Date().toISOString(),
   passwordSetByAutomation: true,
  });
  console.log("✅ RustDesk credentials saved:", {
   rustdeskId: rustDeskId,
   rustdeskPassword: fixedPassword,
  });
 } catch (err) {
  console.warn("⚠️ Failed to save RustDesk config:", err.message);
 }

 try {
  const finalToml = fs.readFileSync(rustDeskConfPath, "utf8");
  console.log("📋 Final RustDesk.toml content:\n", finalToml);
 } catch (err) {
  console.warn("⚠️ Could not read final TOML:", err.message);
 }
}

async function launchRustDeskOnStartup() {
 const platform = process.platform;
 const store = await getStore();
 const savedConfig = store.get("rustdeskConfig");

 if (!savedConfig || !savedConfig.rustdeskId) {
  console.log("⏭️ RustDesk not configured yet. Skipping startup.");
  return;
 }

 let rustDeskPath;
 if (platform === "linux") rustDeskPath = "/usr/bin/rustdesk";
 else if (platform === "win32") {
  const appData =
   process.env.LOCALAPPDATA || path.join(process.env.APPDATA, "..", "Local");
  rustDeskPath = path.join(appData, "RustDesk", "RustDesk.exe");
 }

 startRustDesk(rustDeskPath);
 const id = await waitForRustDeskId(rustDeskPath);
 if (id) console.log("✅ RustDesk running with ID:", id);
 else console.warn("⚠️ RustDesk ID not available yet.");
}

module.exports = { installRustDesk, launchRustDeskOnStartup };
