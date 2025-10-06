const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

(async () => {
  const Store = (await import('electron-store')).default;
  const store = new Store();

  store.set("rustdeskConfig", { rustdeskId: "abc", rustdeskPassword: "123" });
})();


const generatePassword = require(path.join(
 __dirname,
 "..",
 "src",
 "utils",
 "GeneratePasswordRustDesk"
));

function installRustDesk() {
 if (process.platform !== "win32") {
  console.log("RustDesk installation skipped: not Windows");
  return;
 }

 const rustDeskPath = path.join(
  __dirname,
  "extra-packages",
  "rustdesk",
  "rustdesk-1.4.2-x86_64.exe"
 );

 const installDir = "C:\\Program Files\\RustDesk";
 const configDir = path.join(installDir, "config");

 const passwordAccess = generatePassword();

 execFile(
  rustDeskPath,
  [
   "--install",
   installDir,
   "--start-with-win",
   "--set-password",
   passwordAccess,
   "--silent",
  ],
  (err) => {
   if (err) {
    console.error("Error installing RustDesk:", err);
    return;
   }

   console.log("RustDesk installed successfully!");

   const rustdeskIdPath = path.join(configDir, "id_ed25519.pub");
   let rustdeskId = null;
   if (fs.existsSync(rustdeskIdPath)) {
    rustdeskId = fs.readFileSync(rustdeskIdPath, "utf8").trim();
   }

   const data = {
    rustdeskId,
    rustdeskPassword: passwordAccess,
   };

   if (data) {
    store.set("rustdeskConfig", data);
   }
  }
 );
}

module.exports = { installRustDesk };
