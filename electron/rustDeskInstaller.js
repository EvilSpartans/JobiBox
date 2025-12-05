const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// ----------------------------------------------------------
// Electron Store
// ----------------------------------------------------------
let store = null;
async function getStore() {
  if (!store) {
    const Store = (await import("electron-store")).default;
    store = new Store();
  }
  return store;
}

// ----------------------------------------------------------
// Vérifier installation RustDesk
// ----------------------------------------------------------
function isRustDeskInstalled() {
  return fs.existsSync("C:\\Program Files\\RustDesk\\RustDesk.exe");
}

// ----------------------------------------------------------
// Écrire le mot de passe dans RustDesk.toml
// ----------------------------------------------------------
function writeRustDeskConfig(password) {
  const dir = path.join(process.env.APPDATA, "RustDesk", "config");
  const file = path.join(dir, "RustDesk.toml");

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    file,
    `password="${password}"
allow-remote-config-modification="Y"
`,
    "utf8"
  );
}

// ----------------------------------------------------------
// Extraction ID via logs RustDesk
// ----------------------------------------------------------
const rustdeskLogDir = path.join(process.env.APPDATA, "RustDesk", "log");

function extractLatestRustDeskId() {
  if (!fs.existsSync(rustdeskLogDir)) return null;

  const files = fs
    .readdirSync(rustdeskLogDir)
    .filter((f) => f.endsWith(".log"))
    .map((f) => path.join(rustdeskLogDir, f));

  let lastId = null;
  let lastTimestamp = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");

    const regex = /\[([0-9\-: ]+)[^\]]*] INFO .* id updated from \d+ to (\d+)/g;

    let match;
    while ((match = regex.exec(content)) !== null) {
      const timestamp = new Date(match[1]).getTime();
      const newId = match[2];

      if (timestamp > lastTimestamp) {
        lastTimestamp = timestamp;
        lastId = newId;
      }
    }
  }

  return lastId;
}

// ----------------------------------------------------------
// Sync final (ID + mot de passe → Electron Store)
// ----------------------------------------------------------
async function syncRustDeskState() {
  const store = await getStore();

  const password = "Jobibox@Remote12";
  writeRustDeskConfig(password);

  let id = extractLatestRustDeskId();

  store.set("rustdeskConfig", {
    installed: true,
    rustdeskId: id || null,
    rustdeskPassword: password,
    timestamp: new Date().toISOString(),
  });

  console.log("💾 syncRustDeskState()", { id, password });
  return { id, password };
}

// ----------------------------------------------------------
// Lancement RustDesk et attente du nouvel ID dans les logs
// ----------------------------------------------------------
async function launchRustDeskOnStartup() {
  console.log("🚀 Lancement RustDesk…");

  const exe = "C:\\Program Files\\RustDesk\\RustDesk.exe";
  if (!fs.existsSync(exe)) {
    console.log("❌ RustDesk non installé.");
    return;
  }

  try {
    const child = spawn(exe, [], { detached: true, stdio: "ignore" });
    child.unref();
    // Réduire la fenetre
    setTimeout(() => {
      const ps = spawn(
        "powershell.exe",
        [
          "-Command",
          `
Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;

public class WinAPI {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")] 
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")] 
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

    [DllImport("user32.dll")] 
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
"@

$SW_MINIMIZE = 6

for ($i = 0; $i -lt 40; $i++) {
    $found = $false

    [WinAPI]::EnumWindows({
        param($hWnd, $lParam)

        $sb = New-Object System.Text.StringBuilder 1024
        [WinAPI]::GetWindowText($hWnd, $sb, $sb.Capacity) | Out-Null
        $title = $sb.ToString()

        if ($title -like "RustDesk*") {
            [WinAPI]::ShowWindow($hWnd, $SW_MINIMIZE) | Out-Null
            $script:found = $true
            return $false
        }

        return $true
    }, [IntPtr]::Zero)

    if ($found) { break }

    Start-Sleep -Milliseconds 250
}
`,
        ],
        { windowsHide: true }
      );
    }, 400);
  } catch (err) {
    console.error("❌ Erreur lancement RustDesk :", err.message);
  }

  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 1000));

    const id = extractLatestRustDeskId();
    if (id) {
      console.log("🔥 NEW RustDesk ID detected:", id);
      break;
    }
  }

  await syncRustDeskState();
}

// ----------------------------------------------------------
module.exports = {
  launchRustDeskOnStartup,
  syncRustDeskState,
  isRustDeskInstalled,
};
