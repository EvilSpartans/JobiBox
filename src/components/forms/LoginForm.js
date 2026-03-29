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

const authCardClass =
  "flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl";

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
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {!showForgotPassword ? (
        <div className={authCardClass}>
          <div className="text-center dark:text-dark_text_1">
            <h2 className="mt-6 text-4xl font-bold">Connexion</h2>
            <p className="mt-6 text-xl">
              Tu peux te connecter avec tes{" "}
              <span className="text-blue-400">identifiants</span> Jobissim.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
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
                className="text-lg text-blue-500 hover:text-blue-400 underline cursor-pointer transition ease-in duration-300"
              >
                Mot de passe oublié ?
              </button>
            </div>
            {error ? (
              <div>
                <p className="text-red-400">{error}</p>
              </div>
            ) : null}
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
        </div>
      ) : resetPasswordStatus === "succeeded" ? (
        <div className={authCardClass}>
          <div className="text-center dark:text-dark_text_1 space-y-6">
            <h2 className="mt-6 text-4xl font-bold">E-mail envoyé</h2>
            <p className="mt-6 text-xl text-left">
              Un e-mail t’a été envoyé avec un lien pour réinitialiser ton mot
              de passe. Ouvre ce lien sur le site Jobissim pour choisir un
              nouveau mot de passe.
            </p>
            <button
              type="button"
              onClick={goBackToLogin}
              className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300 mt-6"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      ) : (
        <div className={authCardClass}>
          <div className="text-center dark:text-dark_text_1">
            <h2 className="mt-6 text-4xl font-bold">Mot de passe oublié</h2>
            <p className="mt-6 text-xl">
              Saisis ton adresse e-mail : nous t’enverrons un lien pour
              réinitialiser ton mot de passe sur le site{" "}
              <span className="text-blue-400">Jobissim</span>.
            </p>
          </div>
          <form
            onSubmit={handleSubmitForgot(onSubmitForgot)}
            className="mt-6 space-y-6"
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
              <p className="text-red-400">{resetPasswordError}</p>
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
            <p className="text-lg text-center dark:text-dark_text_1">
              <button
                type="button"
                onClick={goBackToLogin}
                className="text-blue-500 hover:text-blue-400 underline cursor-pointer transition ease-in duration-300"
              >
                Retour à la connexion
              </button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
