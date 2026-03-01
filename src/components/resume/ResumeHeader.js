import React from "react";
import Logout from "../core/Logout";
import GoBack from "../core/GoBack";
import LanguageSwitcher from "../core/LanguageSwitcher";

export default function ResumeHeader({ goBackProps = {} }) {
  return (
    <>
      <GoBack {...goBackProps} />
      <div className="fixed top-3 right-4 z-50 flex items-center gap-3">
        <LanguageSwitcher />
        <Logout position="static" />
      </div>
    </>
  );
}
