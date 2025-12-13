const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

const logFile = path.join(
  process.env.APPDATA,
  "Jobibox",
  "anydesk-install.log"
);

function debugLog(msg) {
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, new Date().toISOString() + " - " + msg + "\n");
  } catch (_) {}
}

// Chemin des ressources embarquées (packaged/dev)
function getResourcePath(...p) {
  return app.isPackaged
    ? path.join(process.resourcesPath, "extra-packages", ...p)
    : path.join(__dirname, "extra-packages", ...p);
}

// ---- Paths AnyDesk ----
function getDesktopAnyDeskPath() {
  // Desktop de l'utilisateur courant (celui qui lance JobiBox)
  return path.join(process.env.USERPROFILE || "", "Desktop", "anydesk.exe");
}

function getAnyDeskSystemConfPath() {
  return path.join(process.env.APPDATA, "AnyDesk", "system.conf");
}

// ---- Install check ----
// Ici, "installé" = on a notre anydesk.exe sur le Desktop (ton choix)
function isAnyDeskPresent() {
  return fs.existsSync(getDesktopAnyDeskPath());
}

// ---- Copy embedded -> Desktop ----
function deployAnyDeskToDesktop() {
  // Mets le bon nom selon ton extra-packages
  const embeddedExe = getResourcePath("anydesk", "anydesk_installer.exe");
  const targetExe = getDesktopAnyDeskPath();

  if (!fs.existsSync(embeddedExe)) {
    debugLog("❌ AnyDesk embarqué introuvable: " + embeddedExe);
    throw new Error("AnyDesk embarqué introuvable: " + embeddedExe);
  }

  // Copie (écrase si déjà présent)
  fs.copyFileSync(embeddedExe, targetExe);
  debugLog("✅ AnyDesk copié sur Desktop: " + targetExe);

  return targetExe;
}

// Close anydesk window
function minimizeAnyDeskWindow() {
  spawn(
    "powershell.exe",
    [
      "-NoProfile",
      "-Command",
      `
      $p = Get-Process -Name AnyDesk -ErrorAction SilentlyContinue;
      if ($p) {

        $sig = @"
        [DllImport("user32.dll")]
        public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);

        [DllImport("user32.dll")]
        public static extern bool SetWindowPos(
          IntPtr hWnd,
          IntPtr hWndInsertAfter,
          int X, int Y, int cx, int cy,
          uint uFlags
        );
"@

        Add-Type -MemberDefinition $sig -Name Win32 -Namespace Native

        $HWND_BOTTOM = [IntPtr]1
        $SWP_NOMOVE = 0x0002
        $SWP_NOSIZE = 0x0001
        $SWP_NOACTIVATE = 0x0010

        foreach ($proc in $p) {

          # 1️⃣ Forcer la fenêtre derrière SANS activation
          [Native.Win32]::SetWindowPos(
            $proc.MainWindowHandle,
            $HWND_BOTTOM,
            0,0,0,0,
            $SWP_NOMOVE -bor $SWP_NOSIZE -bor $SWP_NOACTIVATE
          )

          # 2️⃣ Minimiser sans focus
          [Native.Win32]::ShowWindowAsync($proc.MainWindowHandle, 6)
        }
      }
      `,
    ],
    { windowsHide: true }
  );

  debugLog("🪟 AnyDesk minimisé sans jamais passer devant JobiBox");
}

// ---- Launch minimized (sans voler le focus JobiBox) ----
function launchAnyDeskMinimized(exePath) {
  // Lancement NORMAL d’AnyDesk portable (fiable)
  const child = spawn(exePath, [], {
    detached: true,
    stdio: "ignore",
    windowsHide: false, // fenêtre autorisée
  });

  child.unref();
  debugLog("🚀 AnyDesk lancé (normal): " + exePath);
}

// ---- Read AnyDesk ID (no shell) ----
function readAnyDeskIdFromSystemConf() {
  const conf = getAnyDeskSystemConfPath();
  if (!fs.existsSync(conf)) return null;

  const content = fs.readFileSync(conf, "utf8");
  // ad.anynet.id=1917118183
  const match = content.match(/^ad\.anynet\.id=(.+)$/m);
  return match ? match[1].trim() : null;
}

// ---- Wait until ID available ----
async function waitForAnyDeskId({ timeoutMs = 30000, stepMs = 500 } = {}) {
  const start = Date.now();
  let id = null;

  while (Date.now() - start < timeoutMs) {
    id = readAnyDeskIdFromSystemConf();
    if (id) return id;
    await new Promise((r) => setTimeout(r, stepMs));
  }
  return null;
}

// ---- Main entry ----
async function ensureAnyDeskRunningAndSynced() {
  debugLog("---- ensureAnyDeskRunningAndSynced() ----");

  let exePath = getDesktopAnyDeskPath();

  if (!isAnyDeskPresent()) {
    exePath = deployAnyDeskToDesktop();
  } else {
    debugLog("✅ AnyDesk déjà présent: " + exePath);
  }

  function isAnyDeskRunning() {
    try {
      require("child_process").execSync('tasklist | findstr /i "anydesk.exe"', {
        stdio: "ignore",
      });
      return true;
    } catch {
      return false;
    }
  }

  // ✅ EXACTEMENT ta logique : firstRun basé sur la conf
  const firstRun = !hasAnyDeskConfig();

  if (!isAnyDeskRunning()) {
    if (firstRun) {
      launchAnyDeskFirstRun(exePath);
      debugLog("🟠 AnyDesk first run (visible)");

      setTimeout(() => {
        minimizeAnyDeskWindow();
      }, 1500);
    } else {
      // Lancements suivants : silencieux
      launchAnyDeskMinimized(exePath);

      // ⏱️ On laisse AnyDesk créer sa fenêtre
      setTimeout(() => {
        minimizeAnyDeskWindow();
      }, 1200);
      debugLog("🟢 AnyDesk launch minimized");
    }
  } else {
    debugLog("ℹ️ AnyDesk déjà en cours d'exécution");
  }

  // Attends l'ID (création system.conf + ad.anynet.id)
  const id = await waitForAnyDeskId({ timeoutMs: 30000, stepMs: 500 });

  if (id) {
    debugLog("💾 anydeskConfig overwritten with fresh ID=" + id);
  } else {
    debugLog("⚠️ AnyDesk ID null → store NOT touched");
  }

  return { id };
}

function hasAnyDeskConfig() {
  return fs.existsSync(getAnyDeskSystemConfPath());
}

function launchAnyDeskFirstRun(exePath) {
  // Lancement NORMAL pour forcer la création de l’ID
  spawn(exePath, [], {
    detached: true,
    stdio: "ignore",
    windowsHide: false,
  }).unref();

  debugLog("🟠 AnyDesk lancé en mode FIRST RUN (visible)");
}

module.exports = {
  isAnyDeskPresent,
  ensureAnyDeskRunningAndSynced,
  readAnyDeskIdFromSystemConf,
};
