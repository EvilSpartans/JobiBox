import React, { useEffect } from "react";
import RegisterForm from "../../components/forms/RegisterForm";
import { useNavigate } from "react-router-dom";
import GoBack from "../../components/core/GoBack";
import { AuthPageShell } from "../../components/core/AuthLayout";

export default function Register() {

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
      <div className="flex w-full mx-auto h-full min-h-0">
        <AuthPageShell>
          <RegisterForm />
        </AuthPageShell>
      </div>
    </div>
  );
}
