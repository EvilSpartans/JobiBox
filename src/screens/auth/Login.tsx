import React, { useEffect } from "react";
import LoginForm from "../../forms/LoginForm";
import { useNavigate } from "react-router-dom";
import GoBack from "../../components/core/GoBack";

export default function Login(): React.JSX.Element {

  const navigate = useNavigate();

  useEffect(() => {
    const existingBusiness = localStorage.getItem("businessId");
    if (!existingBusiness) {
      navigate("/config");
    }
  }, []);


  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-4xl font-bold">Connexion</h2>
          <p className="mt-6 text-xl">
              Tu peux te connecter avec tes <span className="text-blue-400">identifiants</span> Jobissim.
          </p>
        </div>
        <LoginForm />
        </div>
        </div>
      </div>
    </div>
  );
}
