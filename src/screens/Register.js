import React from "react";
import RegisterForm from "../components/forms/RegisterForm";
import Tuto from "../components/Tuto";

export default function Register() {
  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[39px] overflow-hidden">
      {/*Container */}
      <div className="flex w-full mx-auto h-full">
        {/*Register form */}
        <RegisterForm />
      </div>
      <Tuto
        steps={[
          {
            intro:
              "L'inscription te permettra de bénéficier d’un référencement sur Jobissim pour être visible auprès des recruteurs et te permettra de recevoir ta vidéo par mail après l’enregistrement.",
          },
        ]}
        tutorialKey="registerTuto"
      />
    </div>
  );
}
