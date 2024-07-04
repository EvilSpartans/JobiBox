import React from "react";
import GoBack from "../../components/core/GoBack";
import LogoutBtn from "../../components/core/LogoutBtn";

export default function Exam() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack itemToRemove={"textStyle"} />
      <LogoutBtn />
      <div className="flex w-full mx-auto h-full">
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-3xl font-bold">Entrainement</h2>
              <p className="mt-6 text-base">
                Tu vas pouvoir{" "}
                <span className="text-blue-400">sélectionner</span> les
                questions auxquelles tu vas répondre (entre 2 et 4 maximum) dans
                un format de type question / réponse en vidéo. L'objectif sera
                de <span className="text-blue-400">préparer</span> ton examen à
                l'oral.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
