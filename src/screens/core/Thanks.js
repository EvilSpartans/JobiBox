import React from "react";
import { useSelector } from "react-redux";
import Logout from "../../components/core/Logout";

export default function Thanks() {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-3xl font-bold">Remerciements</h2>
              <p className="mt-12 text-lg">
                Nous te remercions d’avoir utilisé la Jobibox. <span className="text-blue-400">L’équipe de
                JOBISSIM</span> espère que cette expérience t’a plu et te souhaite
                bonne chance dans tes recherches.
                <br /> <br />
                PS : Ton CV vidéo vient d'atterrir sur ta <span className="text-blue-400">boite mail</span>, télécharge le et diffuse le au maximum !
              </p>
            </div>
            {/*Buttons*/}
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
}
