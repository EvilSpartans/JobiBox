const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { app } = require("electron");

let store = null;
async function getStore() {
 if (!store) {
  try {
   const Store = (await import("electron-store")).default;
   store = new Store();
  } catch (e) {
   console.error(
    "❌ Failed to load electron-store. Config saving disabled.",
    e
   );
   store = {
    get: () => ({}),
    set: () => {},
   };
  }
 }
 return store;
}

function getResourcePath(...relativePath) {
 if (process.mainModule && process.mainModule.filename.includes("app.asar")) {
  return path.join(process.resourcesPath, "extra-packages", ...relativePath);
 }
 return path.join(__dirname, "..", "src", "extra-packages", ...relativePath);
}

function startRustDesk(rustDeskPath, env = {}) {
 try {
  const platform = process.platform;

  if (platform === "linux" && fs.existsSync("/usr/bin/rustdesk")) {
   try {
    execSync("systemctl start rustdesk.service || true", {
     timeout: 5000,
     stdio: "ignore",
    });
    console.log("🚀 RustDesk service started via systemctl.");
   } catch (e) {
    console.log("⚠️ systemctl start failed, falling back to user spawn...");
   }
  }

  const child = spawn(rustDeskPath, [], {
   detached: true,
   stdio: "ignore",
   env: { ...process.env, ...env },
  });
  child.unref();
  console.log("🚀 RustDesk user application spawned:", rustDeskPath);
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
 } catch (e) {
  console.warn(
   "⚠️ Sudo installation failed or required password. Trying pkexec fallback..."
  );
  try {
   execSync(
    `pkexec env DEBIAN_FRONTEND=noninteractive dpkg -i "${rustDeskDebPath}"`,
    {
     timeout: 90000,
     stdio: "inherit",
    }
   );
   console.log("✅ RustDesk installed via pkexec (user interaction required).");
   return true;
  } catch (e2) {
   console.error("❌ pkexec installation also failed:", e2.message);
   return false;
  }
 }
}

async function installRustDesk() {
 const platform = process.platform;
 const store = await getStore();

 const fixedPassword = "Jobibox@Remote12";
 let rustDeskPath,
  rustDeskConfPath,
  rustDeskId = null;

 if (platform === "linux") {
  rustDeskPath = "/usr/bin/rustdesk";
  const configDir = path.join(os.homedir(), ".config", "rustdesk");

  const RUSTDESK_TOML_NAME = "RustDesk.toml";
  rustDeskConfPath = path.join(configDir, RUSTDESK_TOML_NAME);

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
   await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch {}

  let cliFailed = false;
  try {
   console.log("🔐 Attempting to set permanent password using SUDO CLI...");
   execSync(`sudo -n "${rustDeskPath}" --password "${fixedPassword}"`, {
    timeout: 15000,
    stdio: "pipe",
   });
   console.log(`🔐 Permanent password set via SUDO CLI on stopped binary.`);
  } catch (err) {
   console.error(
    "❌ Primary password CLI method failed (Linux SUDO required or failed):",
    err.message
   );
   cliFailed = true;
  }

  console.warn(
   "⚠️ CLI failed. Attempting manual TOML edit for CORRECT PASSWORD LOCATION and UNLOCK..."
  );
  try {
   let tomlContent = fs.existsSync(rustDeskConfPath)
    ? fs.readFileSync(rustDeskConfPath, "utf8")
    : "";

   tomlContent = tomlContent.replace(/password\s*=\s*("|').*("|')/g, "").trim();
   tomlContent = tomlContent.replace(/password\s*=\s*''/g, "").trim();
   tomlContent = tomlContent
    .replace(/allow-remote-config-modification\s*=\s*.*/g, "")
    .trim();

   let newTomlContent = tomlContent;

   if (newTomlContent.includes("enc_id")) {
    newTomlContent = newTomlContent.replace(
     /(enc_id\s*=\s*['"].*['"])/,
     `$1\npassword = "${fixedPassword}"`
    );
   } else {
    newTomlContent = `password = "${fixedPassword}"\n` + newTomlContent;
   }

   let optionsContent = "";

   if (newTomlContent.includes("[options]")) {
    optionsContent = `\nallow-remote-config-modification = "Y"\n`;
   } else {
    optionsContent = `\n[options]\nallow-remote-config-modification = "Y"\n`;
   }

   const finalContent = newTomlContent.trim() + optionsContent;
   fs.writeFileSync(rustDeskConfPath, finalContent, "utf8");
   console.log(
    `🛠️ Manually set 'password' in main body and UNLOCKED configurations in ${RUSTDESK_TOML_NAME}.`
   );
  } catch (err3) {
   console.error("❌ Manual TOML edit failed:", err3.message);
  }

  startRustDesk(rustDeskPath);

  rustDeskId = await waitForRustDeskId(rustDeskPath);
  if (!rustDeskId) return;
 } else if (platform === "win32") {
  const possiblePaths = [
   path.join(
    process.env["ProgramFiles"] || "C:\\Program Files",
    "RustDesk",
    "rustdesk.exe"
   ),
   path.join(
    process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)",
    "RustDesk",
    "rustdesk.exe"
   ),
   path.join(
    process.env.LOCALAPPDATA || "",
    "Programs",
    "RustDesk",
    "rustdesk.exe"
   ),
  ];

  let rustDeskPath = possiblePaths.find((p) => fs.existsSync(p));
  const rustDeskConfPath = path.join(
   process.env.APPDATA || "",
   "RustDesk",
   "RustDesk.toml"
  );
  const installerPath = getResourcePath(
   "rustdesk",
   "rustdesk-1.4.2-x86_64.msi"
  );

  if (!rustDeskPath) {
   try {
    execSync(`start "" /wait msiexec /i "${installerPath}" /qn`, {
     shell: "cmd.exe",
     stdio: "inherit",
    });

    console.log("✅ RustDesk instalado com sucesso via instalador do Windows.");
   } catch (err) {
    console.error(
     "❌ Falha ao instalar RustDesk automaticamente:",
     err.message
    );
    return;
   }

   rustDeskPath = possiblePaths.find((p) => fs.existsSync(p));
   if (!rustDeskPath) {
    console.error("❌ RustDesk.exe não encontrado após instalação.");
    return;
   }
  }

  try {
   execSync("taskkill /F /IM rustdesk-1.4.2-x86_64.msi /T", {
    timeout: 5000,
    stdio: "ignore",
   });
   await new Promise((resolve) => setTimeout(resolve, 2000));
  } catch {}

  try {
   execSync(`"${rustDeskPath}" --password "${fixedPassword}"`, {
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
  console.log(
   `📋 Final ${path.basename(rustDeskConfPath)} content:\n`,
   finalToml
  );
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
  rustDeskPath = path.join(appData, "RustDesk", "rustdesk-1.4.2-x86_64.msi");
 } else {
  return;
 }

 startRustDesk(rustDeskPath);
 const id = await waitForRustDeskId(rustDeskPath);
 if (id) console.log("✅ RustDesk running with ID:", id);
 else console.warn("⚠️ RustDesk ID not available yet.");
}

module.exports = { installRustDesk, launchRustDeskOnStartup };
