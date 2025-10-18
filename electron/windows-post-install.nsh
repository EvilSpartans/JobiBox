!macro customInstall
  ; Optionnel : tu peux lancer une action post-install ici
  ; Exemple : lancement silencieux de RustDesk après l’installation
  ExecWait '"$INSTDIR\\resources\\app.asar.unpacked\\electron\\rustDeskInstaller.js"'
!macroend
