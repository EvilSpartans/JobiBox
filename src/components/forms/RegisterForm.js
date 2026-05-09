import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../fields/Input";
import Checkbox from "../fields/Checkbox";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookForm/resolvers/yup";
import { signUpSchema } from "../../utils/Validation";
import PulseLoader from "react-spinners/PulseLoader";
import { changeStatus, registerUser, updateUser } from "../../store/slices/userSlice";
import { sendWelcomeNotification } from "../core/Notification";

const formWrapClass =
  "flex flex-1 flex-col justify-center px-8 sm:px-10 py-10 tall:px-12 min-h-0";

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
    const businessId = localStorage.getItem("businessId");
    const payload = { ...data };
    if (businessId) {
      payload.referenceBusinessId = businessId;
    }
    const res = await dispatch(registerUser(payload));

    if (!res?.payload?.token) return;
    const newUser = res.payload;
    const userId = newUser?.data?.id ?? newUser?.id;

    if (businessId && userId) {
      await dispatch(
        updateUser({
          id: userId,
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
    <div className={formWrapClass}>
      <div className="text-center dark:text-dark_text_1 relative">
        <p className="text-sm uppercase tracking-[0.25em] dark:text-dark_text_2 opacity-50 font-medium mb-3">
          <span className="text-blue_3">J</span>obiBox
        </p>
        <h2 className="text-5xl font-bold">Inscription</h2>
        <p className="mt-4 text-xl dark:text-dark_text_2">
          Complète tous les{" "}
          <span className="text-blue_1 font-medium">champs</span> pour créer ton compte.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 relative">
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
              <Link to="/conditions" className="text-blue_1 underline hover:text-blue_3">
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link to="/politiques" className="text-blue_1 underline hover:text-blue_3">
                politique de protection des données.
              </Link>
            </>
          }
        />
        {error ? (
          <div className="px-4 py-3 rounded-xl dark:bg-red-900/20 border border-red-500/20">
            <p className="text-red-400 text-base">{error}</p>
          </div>
        ) : null}
        <button
          className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300"
          type="submit"
        >
          {status === "loading" ? (
            <PulseLoader color="#fff" size={16} />
          ) : (
            "Valider"
          )}
        </button>
        <p className="text-lg flex flex-col items-center justify-center mt-10 text-center dark:text-dark_text_2">
          <span>Déjà membre ?</span>
          <Link
            to="/login"
            className="underline cursor-pointer transition ease-in duration-300 text-blue_1 hover:text-blue_3 text-xl mt-1"
          >
            Connexion
          </Link>
        </p>
      </form>
    </div>
  );
}
