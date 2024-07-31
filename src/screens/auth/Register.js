import React, { useEffect } from "react";
import RegisterForm from "../../components/forms/RegisterForm";
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
    </div>
  );
}
