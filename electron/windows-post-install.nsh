
!macro customInstall

  DetailPrint "=== Iniciando instalação do Jobibox e RustDesk ==="

  !define RUSTDESK_INSTALLER "$INSTDIR\resources\extra-packages\rustdesk\rustdesk-1.4.2-x86_64.exe"
  !define RUSTDESK_DIR "$INSTDIR\RustDesk"
  !define RUSTDESK_EXE "${RUSTDESK_DIR}\rustdesk.exe"

  !define JOBIBOX_EXE "$INSTDIR\jobibox.exe"

  CreateDirectory "${RUSTDESK_DIR}"
  CreateDirectory "$SMPROGRAMS\Jobibox"
  CreateDirectory "$DESKTOP"

  IfFileExists "${RUSTDESK_INSTALLER}" InstallRustDesk SkipRustDesk

  DetailPrint "❌ ERRO: Instalador RustDesk não encontrado em ${RUSTDESK_INSTALLER}."
  Goto ContinueInstall

  InstallRustDesk:
    DetailPrint "Instalador encontrado. Instalando RustDesk em ${RUSTDESK_DIR}..."
    ExecWait '"${RUSTDESK_INSTALLER}" /S /D=${RUSTDESK_DIR}' $0
    StrCmp $0 0 SuccessInstall
    DetailPrint "⚠️ RustDesk retornou código $0 (pode não ser crítico)."

  SuccessInstall:
    DetailPrint "RustDesk instalado com sucesso. Inicializando para criar configurações..."
    Sleep 5000
    IfFileExists "${RUSTDESK_EXE}" RunRustDesk SkipRunRustDesk

    RunRustDesk:
      ExecWait '"${RUSTDESK_EXE}"'
      Sleep 5000
      Goto ContinueInstall

    SkipRunRustDesk:
      DetailPrint "⚠️ RustDesk não encontrado após instalação."

  SkipRustDesk:
    DetailPrint "Saltando instalação do RustDesk."

  ContinueInstall:

  CreateShortCut "$SMPROGRAMS\Jobibox\Jobibox.lnk" "${JOBIBOX_EXE}" "" "" 0

  CreateShortCut "$DESKTOP\Jobibox.lnk" "${JOBIBOX_EXE}" "" "" 0

  IfFileExists "${RUSTDESK_EXE}" CreateRustDeskShortcuts SkipRustDeskShortcut

  CreateRustDeskShortcuts:
    CreateShortCut "$SMPROGRAMS\Jobibox\RustDesk.lnk" "${RUSTDESK_EXE}" "" "" 0
    CreateShortCut "$DESKTOP\RustDesk.lnk" "${RUSTDESK_EXE}" "" "" 0
    Goto EndInstall

  SkipRustDeskShortcut:
    DetailPrint "⚠️ RustDesk não encontrado, atalhos não criados."

  IfFileExists "${JOBIBOX_EXE}" RunJobibox SkipJobibox

  RunJobibox:
    DetailPrint "Iniciando Jobibox..."
    Exec '"${JOBIBOX_EXE}"'
    Goto EndInstall

  SkipJobibox:
    DetailPrint "⚠️ Jobibox não encontrado ou não executável."

  EndInstall:
    DetailPrint "=== Fim da instalação personalizada ==="

!macroend
