import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../fields/Input";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookForm/resolvers/yup";
import { signInSchema } from "../../utils/validation";
import PulseLoader from "react-spinners/PulseLoader";
import { changeStatus, loginUser } from "../../store/features/userSlice";
import { sendWelcomeNotification } from "../Notification";

export default function LoginForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signInSchema),
    });

    const onSubmit = async (data) => {
        dispatch(changeStatus("loading"));
        let res = await dispatch(loginUser({ ...data }));
        // console.log(res);
        if (res?.payload?.token) {
            navigate("/");
            sendWelcomeNotification();
        } 
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Container */}
            <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
                {/*Heading*/}
                <div className="text-center dark:text-dark_text_1">
                    <h2 className="mt-6 text-3xl font-bold">Bienvenue</h2>
                    <p className="mt-2 text-sm">Connexion</p>
                </div>
                {/*Form*/}
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
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
                        <span>Pas encore membre ?</span>
                        <Link
                            to="/register"
                            className=" hover:underline cursor-pointer transition ease-in duration-300"
                        >
                            Inscription
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
