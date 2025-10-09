#!/bin/bash
set -e

LOG_FILE="$HOME/.jobibox/logs/rustdesk-install.log"
RUSTDESK_DEB_PATH="/opt/jobibox/resources/extra-packages/rustdesk/rustdesk-1.4.2-x86_64.deb"

mkdir -p "$(dirname "$LOG_FILE")"

echo "--- Starting silent installation of RustDesk (DEB) ---" > "$LOG_FILE"
echo "Searching for installer at: $RUSTDESK_DEB_PATH" >> "$LOG_FILE"

if [ -f "$RUSTDESK_DEB_PATH" ]; then
    echo "✅ RustDesk installer found." >> "$LOG_FILE"

    INSTALL_COMMAND="( \
        sleep 5 && \
        DEBIAN_FRONTEND=noninteractive dpkg -i \"$RUSTDESK_DEB_PATH\" \
    ) || ( \
        DEBIAN_FRONTEND=noninteractive apt-get install -fy \"$RUSTDESK_DEB_PATH\" \
    )"

    nohup bash -c "$INSTALL_COMMAND" >> "$LOG_FILE" 2>&1 &
    echo "🚀 RustDesk installation has been scheduled to run in the background." >> "$LOG_FILE"
else
    echo "❌ CRITICAL ERROR: RustDesk .deb installer not found at the expected path." >> "$LOG_FILE"
fi

echo "--- End of silent RustDesk installation ---" >> "$LOG_FILE"


JOBIBOX_BIN="/opt/jobibox/jobibox"

sleep 3

if [ -x "$JOBIBOX_BIN" ]; then
    echo "🚀 Launching Jobibox..." >> "$LOG_FILE"
    nohup "$JOBIBOX_BIN" >/dev/null 2>&1 &
else
    echo "⚠️ Jobibox binary not found or not executable: $JOBIBOX_BIN" >> "$LOG_FILE"
fi

if command -v rustdesk >/dev/null 2>&1; then
    echo "🚀 Launching RustDesk..." >> "$LOG_FILE"
    nohup rustdesk >/dev/null 2>&1 &
else
    echo "⚠️ RustDesk not found yet, will be launched on next startup." >> "$LOG_FILE"
fi

exit 0
