import React from "react";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        w-full
        flex items-center justify-center gap-3
        px-6 py-4
        rounded-2xl
        border border-emerald-500/30
        bg-emerald-500/10
        text-emerald-300
        font-semibold
        transition
        hover:bg-emerald-500/20
        hover:border-emerald-400/60
      "
    >
      <span
        className="
          flex items-center justify-center
          w-9 h-9
          rounded-full
          bg-emerald-500/20
          group-hover:bg-emerald-500/30
          transition
        "
      >
        <FontAwesomeIcon icon={faPlus} />
      </span>
      {children}
    </button>
  );
}