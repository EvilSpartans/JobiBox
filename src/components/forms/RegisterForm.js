import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../fields/Input";
import Checkbox from "../fields/Checkbox";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookForm/resolvers/yup";
import { signUpSchema } from "../../utils/Validation";
import PulseLoader from "react-spinners/PulseLoader";
import { changeStatus, registerUser } from "../../store/features/userSlice";
import { sendWelcomeNotification } from "../Notification";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    let res = await dispatch(registerUser({ ...data }));
    // console.log(res);
    if (res?.payload?.token) {
      navigate("/");
      sendWelcomeNotification();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Bienvenue</h2>
          <p className="mt-2 text-sm">Inscription</p>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <Input
            name="lastname"
            type="text"
            placeholder="Nom"
            register={register}
            error={errors?.lastname?.message}
          />
          <Input
            name="firstname"
            type="text"
            placeholder="Prénom"
            register={register}
            error={errors?.firstname?.message}
          />
          <Input
            name="email"
            type="text"
            placeholder="Adresse e-mail"
            register={register}
            error={errors?.email?.message}
          />
          <Input
            name="password"
            type="password"
            placeholder="Mot de passe"
            register={register}
            error={errors?.password?.message}
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmer mot de passe"
            register={register}
            error={errors?.confirmPassword?.message}
          />
          <Checkbox 
            name="terms"
            label="J'accepte les conditions d'utilisation"
            register={register}
            error={errors?.terms?.message}
          />
          <Link
            to="https://jobissim.com/conditions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline cursor-pointer transition ease-in duration-300 text-blue_3"
          >
            Prendre connaissance
          </Link>
          {/*if we have an error*/}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}
          {/*Submit button*/}
          <button
            className="w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
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
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>Déjà membre ?</span>
            <Link
              to="/login"
              className=" hover:underline cursor-pointer transition ease-in duration-300"
            >
              Connexion
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
