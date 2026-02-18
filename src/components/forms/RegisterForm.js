import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../fields/Input";
import Checkbox from "../fields/Checkbox";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookForm/resolvers/yup";
import { signUpSchema } from "../../utils/Validation";
import PulseLoader from "react-spinners/PulseLoader";
import { changeStatus, registerUser } from "../../store/slices/userSlice";
import { sendWelcomeNotification } from "../core/Notification";

export default function RegisterForm() {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const { status, error } = useSelector((state) => state.user);
 const [passwordVisible, setPasswordVisible] = useState(false);

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

  if (!res?.payload.token) return;
  const businessId = localStorage.getItem("businessId");
  const newUser = res.payload;

  if (businessId && newUser?.id) {
   await dispatch(
    updateUser({
     id: newUser.id,
     referenceBusinessId: businessId,
     token: newUser.token,
    }),
   );
  }

  navigate("/");
  sendWelcomeNotification();
 };

 const togglePasswordVisibility = () => {
  setPasswordVisible((prevState) => !prevState);
 };

 return (
  <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
   {/* Container */}
   <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
    {/*Heading*/}
    <div className="text-center dark:text-dark_text_1">
     <h2 className="mt-6 text-4xl font-bold">Inscription</h2>
     <p className="mt-6 text-xl">
      Complète tous les <span className="text-blue-400">champs</span> pour créer
      ton compte.
     </p>
    </div>
    {/*Form*/}
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
     <Input
      name="lastname"
      type="text"
      label="Nom"
      placeholder="John"
      register={register}
      error={errors?.lastname?.message}
     />
     <Input
      name="firstname"
      type="text"
      label="Prénom"
      placeholder="Doe"
      register={register}
      error={errors?.firstname?.message}
     />
     <Input
      name="email"
      type="text"
      label="Adresse e-mail"
      placeholder="Ex : john@gmail.com.."
      register={register}
      error={errors?.email?.message}
     />
     <Input
      name="password"
      type="password"
      label="Mot de passe"
      placeholder="*****"
      register={register}
      error={errors?.password?.message}
      toggleVisibility={togglePasswordVisibility}
      isPasswordVisible={passwordVisible}
     />
     <Input
      name="confirmPassword"
      type="password"
      label="Confirmer mot de passe"
      placeholder="*****"
      register={register}
      error={errors?.confirmPassword?.message}
      toggleVisibility={togglePasswordVisibility}
      isPasswordVisible={passwordVisible}
     />
     <Checkbox
      name="terms"
      register={register}
      error={errors?.terms?.message}
      label={
       <>
        J'accepte les{" "}
        <Link to="/conditions" className="text-blue-500 underline">
         conditions d'utilisation
        </Link>{" "}
        et la{" "}
        <Link to="/politiques" className="text-blue-500 underline">
         politique de protection des données.
        </Link>
       </>
      }
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
      <span>Déjà membre ?</span>
      <Link
       to="/login"
       className="underline cursor-pointer transition ease-in duration-300 text-blue-500 text-xl"
      >
       Connexion
      </Link>
     </p>
    </form>
   </div>
  </div>
 );
}
