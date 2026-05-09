import React from "react";

/** Même hauteur de carte que Welcome / Home (borne). */
export const AUTH_CARD_MIN_HEIGHT = { minHeight: "88vh" };

/**
 * Halo harmonisé (rose JobiBox + bleus) sur fond dark_bg_2 — identique sur welcome, login, register.
 */
export function AuthAmbientBackdrop() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background: `
          radial-gradient(ellipse 95% 52% at 50% -8%, rgba(226, 150, 242, 0.22) 0%, transparent 55%),
          radial-gradient(ellipse 70% 48% at 95% 92%, rgba(135, 138, 240, 0.16) 0%, transparent 52%),
          radial-gradient(ellipse 60% 44% at 5% 55%, rgba(83, 189, 235, 0.12) 0%, transparent 48%)
        `,
      }}
    />
  );
}

/**
 * Conteneur scroll + carte : à utiliser dans l’arbre sous h-screen dark:bg-dark_bg_1.
 */
export function AuthPageShell({ children, outerClassName = "p-4" }) {
  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center overflow-y-auto box-border ${outerClassName}`}
    >
      <div
        className="relative flex w-full min-w-[60%] tall:w-[90%] flex-col min-h-[60%] h-fit tall:h-[90%] dark:bg-dark_bg_2 rounded-2xl overflow-hidden shrink-0 max-h-[92vh] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
        style={AUTH_CARD_MIN_HEIGHT}
      >
        <AuthAmbientBackdrop />
        <div className="relative z-[1] flex min-h-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
