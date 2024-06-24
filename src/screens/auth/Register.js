import React, { useEffect } from "react";
import RegisterForm from "../../components/forms/RegisterForm";
// import Tuto from "../components/Tuto";
import { useNavigate } from "react-router-dom";
import GoBack from "../../components/core/GoBack";

export default function Register() {

  const navigate = useNavigate();

  useEffect(() => {
    const existingBusiness = localStorage.getItem("businessId");
    if (!existingBusiness) {
      navigate("/config");
    }
  }, []);

  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack />
      {/*Container */}
      <div className="flex w-full mx-auto h-full">
        {/*Register form */}
        <RegisterForm />
      </div>
      {/* <Tuto
        steps={[
          {
            intro:
              "L'inscription te permettra de bénéficier d’un référencement sur Jobissim pour être visible auprès des recruteurs et te permettra de recevoir ta vidéo par mail après l’enregistrement.",
          },
        ]}
        tutorialKey="registerTuto"
      /> */}
    </div>
  );
}
