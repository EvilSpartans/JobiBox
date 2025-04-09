import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/fields/Input";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookForm/resolvers/yup";
import { signInSchema } from "../utils/Validation";
import PulseLoader from "react-spinners/PulseLoader";
import { changeStatus } from "../store/slices/userSlice";
import { sendWelcomeNotification } from "../components/core/Notification";
import { loginUser } from "../services/auth.service";
import { AppDispatch } from "../store/Store";
import { User } from "../models/User";

export default function LoginForm(): React.JSX.Element {
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: any) => state.user);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const onSubmit = async (data: Partial<User>) => {
    dispatch(changeStatus("loading"));
    let res = await dispatch(loginUser({ ...data }));
    // console.log(res);
    if (res.payload && 'token' in res.payload) {
      navigate("/");
      sendWelcomeNotification();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
      <Input
        name="email"
        type="text"
        placeholder="Adresse e-mail"
        register={register}
        error={errors?.email?.message} 
        selected={undefined} 
        onChange={undefined} 
        style={undefined} 
        toggleVisibility={undefined} 
        isPasswordVisible={undefined} 
        className={undefined}      
      />
      <Input
        name="password"
        type="password"
        placeholder="Mot de passe"
        register={register}
        error={errors?.password?.message}
        toggleVisibility={togglePasswordVisibility}
        isPasswordVisible={passwordVisible} 
        selected={undefined} 
        onChange={undefined} 
        style={undefined} 
        className={undefined}      
      />
      {/*if we have an error*/}
      {error ? (
        <div>
          <p className="text-red-400">{error}</p>
        </div>
      ) : null}
      {/*Submit button*/}
      <button
        className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
      font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300
      "
        type="submit"
      >
        {status === "loading" ? (
          <PulseLoader color="#fff" size={16} />
        ) : (
          "Valider"
        )}
      </button>
      {/* Sign in link */}
      <p className="text-lg flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
        <span>Pas encore membre ?</span>
        <Link
          to="/register"
          className=" underline cursor-pointer transition ease-in duration-300 text-blue-500 text-xl"
        >
          Inscription
        </Link>
      </p>
    </form>
  );
}
