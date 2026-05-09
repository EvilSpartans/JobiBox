import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../fields/Input";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookForm/resolvers/yup";
import { signInSchema, forgotPasswordSchema } from "../../utils/Validation";
import PulseLoader from "react-spinners/PulseLoader";
import {
  changeStatus,
  loginUser,
  requestPasswordReset,
  clearResetPasswordState,
} from "../../store/slices/userSlice";
import { sendWelcomeNotification } from "../core/Notification";

const formWrapClass =
  "flex flex-1 flex-col justify-center px-8 sm:px-10 py-10 tall:px-12 min-h-0";

const AuthHeader = ({ title, subtitle }) => (
  <div className="text-center dark:text-dark_text_1 relative">
    <p className="text-sm uppercase tracking-[0.25em] dark:text-dark_text_2 opacity-50 font-medium mb-3">
      <span className="text-blue_3">J</span>obiBox
    </p>
    <h2 className="text-5xl font-bold">{title}</h2>
    {subtitle && (
      <p className="mt-4 text-xl dark:text-dark_text_2">{subtitle}</p>
    )}
  </div>
);

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, resetPasswordStatus, resetPasswordError } =
    useSelector((state) => state.user);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
    reset: resetForgot,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const goBackToLogin = () => {
    dispatch(clearResetPasswordState());
    resetForgot();
    setShowForgotPassword(false);
  };

  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    let res = await dispatch(loginUser({ ...data }));
    if (res?.payload?.token) {
      navigate("/");
      sendWelcomeNotification();
    }
  };

  const onSubmitForgot = async (data) => {
    await dispatch(requestPasswordReset({ email: data.email }));
  };

  return (
    <>
      {!showForgotPassword ? (
        <div className={formWrapClass}>
          <AuthHeader
            title="Connexion"
            subtitle={
              <>
                Connecte-toi avec tes{" "}
                <span className="text-blue_1 font-medium">identifiants</span> Jobissim.
              </>
            }
          />
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6 relative">
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
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-lg text-blue_1 hover:text-blue_3 underline cursor-pointer transition ease-in duration-300"
              >
                Mot de passe oublié ?
              </button>
            </div>
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
              <span>Pas encore membre ?</span>
              <Link
                to="/register"
                className="underline cursor-pointer transition ease-in duration-300 text-blue_1 hover:text-blue_3 text-xl mt-1"
              >
                Inscription
              </Link>
            </p>
          </form>
        </div>
      ) : resetPasswordStatus === "succeeded" ? (
        <div className={formWrapClass}>
          <div className="text-center dark:text-dark_text_1 space-y-6 relative">
            <p className="text-sm uppercase tracking-[0.25em] dark:text-dark_text_2 opacity-50 font-medium">
              <span className="text-blue_3">J</span>obiBox
            </p>
            <h2 className="text-5xl font-bold">E-mail envoyé</h2>
            <p className="text-xl dark:text-dark_text_2 text-left">
              Un e-mail t'a été envoyé avec un lien pour réinitialiser ton mot
              de passe. Ouvre ce lien sur le site Jobissim pour choisir un
              nouveau mot de passe.
            </p>
            <button
              type="button"
              onClick={goBackToLogin}
              className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      ) : (
        <div className={formWrapClass}>
          <AuthHeader
            title="Mot de passe oublié"
            subtitle={
              <>
                Saisis ton adresse e-mail : nous t'enverrons un lien pour
                réinitialiser ton mot de passe sur{" "}
                <span className="text-blue_1 font-medium">Jobissim</span>.
              </>
            }
          />
          <form
            onSubmit={handleSubmitForgot(onSubmitForgot)}
            className="mt-6 space-y-6 relative"
          >
            <Input
              name="email"
              type="text"
              label="Adresse e-mail"
              placeholder="Ex : john@gmail.com.."
              register={registerForgot}
              error={errorsForgot?.email?.message}
            />
            {resetPasswordError ? (
              <div className="px-4 py-3 rounded-xl dark:bg-red-900/20 border border-red-500/20">
                <p className="text-red-400 text-base">{resetPasswordError}</p>
              </div>
            ) : null}
            <button
              type="submit"
              disabled={resetPasswordStatus === "loading"}
              className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300 disabled:opacity-70"
            >
              {resetPasswordStatus === "loading" ? (
                <PulseLoader color="#fff" size={16} />
              ) : (
                "Envoyer le lien"
              )}
            </button>
            <p className="text-lg text-center dark:text-dark_text_2">
              <button
                type="button"
                onClick={goBackToLogin}
                className="text-blue_1 hover:text-blue_3 underline cursor-pointer transition ease-in duration-300"
              >
                Retour à la connexion
              </button>
            </p>
          </form>
        </div>
      )}
    </>
  );
}
