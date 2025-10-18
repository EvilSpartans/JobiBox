const { execSync, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

let store = null;
async function getStore() {
  if (!store) {
    try {
      const Store = (await import("electron-store")).default;
      store = new Store();
    } catch (e) {
      console.error("❌ Failed to load electron-store. Config saving disabled.", e);
      store = { get: () => ({}), set: () => {} };
    }
  }
  return store;
}

/**
 * Retourne le chemin vers un fichier embarqué,
 * compatible dev et prod (packagé)
 */
function getResourcePath(...relativePath) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "extra-packages", ...relativePath);
  }
  return path.join(__dirname, "extra-packages", ...relativePath);
}

/**
 * Vérifie si RustDesk est installé sur Windows
 */
function isRustDeskInstalled() {
  const rustDeskExe = "C:\\Program Files\\RustDesk\\RustDesk.exe";
  return fs.existsSync(rustDeskExe);
}

/**
 * Lance RustDesk sans bloquer l’app
 */
function startRustDesk(rustDeskPath) {
  try {
    const child = spawn(rustDeskPath, [], { detached: true, stdio: "ignore" });
    child.unref();
    console.log("🚀 RustDesk lancé :", rustDeskPath);
  } catch (err) {
    console.error("❌ Erreur lancement RustDesk:", err.message);
  }
}

/**
 * Installe RustDesk s’il n’est pas présent
 */
async function installRustDesk() {
  const platform = process.platform;
  if (platform !== "win32") {
    console.warn("⚠️ Installation RustDesk ignorée (plateforme non Windows).");
    return;
  }

  const store = await getStore();
  const rustDeskExe = "C:\\Program Files\\RustDesk\\RustDesk.exe";
  const basePath = getResourcePath("rustdesk");
  const exePath = path.join(basePath, "rustdesk_installer.exe");
  const msiPath = path.join(basePath, "rustdesk_installer.msi");
  const rustDeskDir = path.join(process.env.APPDATA, "RustDesk", "config");
  const rustDeskConfPath = path.join(rustDeskDir, "RustDesk.toml");

  const fixedPassword = "Jobibox@Remote12";
  const jobiboxId = store.get("jobibox_id") || null;

  // ✅ Si déjà installé
  if (isRustDeskInstalled()) {
    console.log("✅ RustDesk déjà installé, vérification config...");
  } else {
    // ⚙️ Choisir le bon installeur
    let installerPath = null;
    if (fs.existsSync(msiPath)) installerPath = msiPath;
    else if (fs.existsSync(exePath)) installerPath = exePath;

    if (!installerPath) {
      console.error("❌ Aucun installeur RustDesk trouvé dans :", basePath);
      return;
    }

    console.log(`🔧 Installation silencieuse de RustDesk (${path.basename(installerPath)})...`);

    try {
      if (installerPath.endsWith(".msi")) {
        execSync(`msiexec /i "${installerPath}" /qn /norestart`, {
          stdio: "ignore",
          shell: true,
        });
      } else {
        execSync(`"${installerPath}" /VERYSILENT /NORESTART`, {
          stdio: "ignore",
          shell: true,
        });
      }
      console.log("✅ RustDesk installé avec succès.");
    } catch (err) {
      console.error("❌ Échec installation RustDesk :", err.message);
      return;
    }
  }

  // ✅ Créer le dossier config
  if (!fs.existsSync(rustDeskDir)) fs.mkdirSync(rustDeskDir, { recursive: true });

  // 📝 Config TOML
  try {
    let toml = fs.existsSync(rustDeskConfPath)
      ? fs.readFileSync(rustDeskConfPath, "utf8")
      : "";

    toml = toml
      .replace(/password\s*=\s*".*"/g, "")
      .replace(/allow-remote-config-modification\s*=\s*".*"/g, "")
      .trim();

    toml += `\npassword = "${fixedPassword}"\nallow-remote-config-modification = "Y"\n`;
    if (jobiboxId) toml += `jobibox_id = "${jobiboxId}"\n`;

    fs.writeFileSync(rustDeskConfPath, toml, "utf8");
    console.log("✅ RustDesk.toml mis à jour avec mot de passe et ID.");
  } catch (err) {
    console.error("❌ Erreur d’écriture RustDesk.toml :", err.message);
  }

  // 🚀 Lancement RustDesk
  startRustDesk(rustDeskExe);

  // 💾 Sauvegarde état
  store.set("rustdeskConfig", {
    installed: true,
    rustdeskPassword: fixedPassword,
    jobiboxId,
    timestamp: new Date().toISOString(),
  });

  console.log("✅ RustDesk installé et configuré avec succès.");
}

/**
 * Lance RustDesk au démarrage
 */
async function launchRustDeskOnStartup() {
  if (process.platform !== "win32") return;

  const store = await getStore();
  const config = store.get("rustdeskConfig");

  if (!config || !config.installed || !isRustDeskInstalled()) {
    console.log("⏭️ RustDesk non encore installé, démarrage ignoré.");
    return;
  }

  console.log("🚀 Lancement automatique de RustDesk...");
  startRustDesk("C:\\Program Files\\RustDesk\\RustDesk.exe");
}

module.exports = { installRustDesk, launchRustDeskOnStartup };
