import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Thanks() {

    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    return (
        <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
            {/*Container*/}
            <div className="flex w-[1600px] mx-auto h-full">
                {/*Login Form */}
                <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
                    {/* Container */}
                    <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
                        {/*Heading*/}
                        <div className="text-center dark:text-dark_text_1">
                            <h2 className="mt-6 text-3xl font-bold">Remerciements</h2>
                            <p className="mt-2 text-sm">Nous te remercions d’avoir utilisé la Jobibox. L’équipe de JOBISSIM espère que cette expérience t’a plu et te souhaite bonne chance dans tes recherches.</p>
                        </div>
                        {/*Buttons*/}
                        <button
                            className="w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
          font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300
          "
                            onClick={() => navigate("/")}
                        >Retour à l'accueil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}