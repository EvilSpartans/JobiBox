const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

function installRustDesk() {
 if (process.platform !== "win32") {
  console.log("RustDesk installation skipped: not Windows");
  return;
 }

 const businessId = 1; // businessId jobissim

 const rustDeskPath = path.join(
  __dirname,
  "extra-packages",
  "rustdesk",
  "rustdesk-1.4.2-x86_64.exe"
 );

 const installDir = "C:\\Program Files\\RustDesk";
 const configDir = path.join(installDir, "config");

 execFile(
  rustDeskPath,
  [
   "--install",
   installDir,
   "--start-with-win",
   "--set-password",
   "Jb9$4kP!qR7vX2mZ", // password
   "--silent",
  ],
  (err) => {
   if (err) {
    console.error("Error installing RustDesk:", err);
    return;
   }

   console.log("RustDesk installed successfully!");

   const rustDeskIdPath = path.join(configDir, "id_ed25519.pub");
   let rustDeskId = null;
   if (fs.existsSync(rustDeskIdPath)) {
    rustDeskId = fs.readFileSync(rustDeskIdPath, "utf8").trim();
   }

   const data = {
    businessId,
    rustDeskId,
    password: "Jb9$4kP!qR7vX2mZ",
   };

   console.log("Jobibox config :", data); // Ideally, save it in the backend
  }
 );
}

module.exports = { installRustDesk };
