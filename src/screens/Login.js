import React from "react";
import LoginForm from "../components/forms/LoginForm";
import Tuto from "../components/Tuto";

export default function Login() {

    return (
        <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
            {/*Container*/}
            <div className="flex w-[1600px] mx-auto h-full">
                {/*Login Form */}
                <LoginForm />
            </div>
            <Tuto
                steps={[
                    {
                        intro: 'Bonjour à toi et bienvenue dans la Jobibox.'
                    },
                    {
                        intro: 'Nous allons créer ensemble ton CV vidéo afin que tu te démarques dans ta recherche de stage, d’alternance ou d’emploi.'
                    },
                    {
                        intro: "Ton CV vidéo sera ensuite référencé sur la plateforme d’emploi Jobissim afin que de nombreux recruteurs le voient et te contactent."
                    },
                    {
                        intro: "Il te sera également envoyé par mail pour que tu le diffuses où tu le souhaites. Information : La vidéo t’appartient, tu es libre de la diffuser ou tu le souhaites."
                    }
                ]}
                tutorialKey="loginTuto"
            />
        </div>
    );
}