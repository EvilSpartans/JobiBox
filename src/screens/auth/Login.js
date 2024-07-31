import React, { useEffect } from "react";
import LoginForm from "../../components/forms/LoginForm";
import { useNavigate } from "react-router-dom";
import GoBack from "../../components/core/GoBack";

export default function Login() {

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
        <LoginForm />
      </div>
    </div>
  );
}
