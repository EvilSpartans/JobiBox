import React from "react";
import { useSelector } from "react-redux";
import LogoutBtn from "../components/LogoutBtn";
import Logout from "../components/Logout";

export default function Thanks() {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      {/*Container*/}
      <LogoutBtn />
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/*Heading*/}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="mt-6 text-3xl font-bold">Remerciements</h2>
              <p className="mt-2 text-sm">
                Nous te remercions d’avoir utilisé la Jobibox. L’équipe de
                JOBISSIM espère que cette expérience t’a plu et te souhaite
                bonne chance dans tes recherches.
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
