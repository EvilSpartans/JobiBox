import React from "react";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";
import Offers from "../../components/offer/Offers";
import offres from "../../../assets/images/offres.png";

export default function OfferScreen() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack itemsToRemove={["textStyle"]} />
      <Logout />
      <div className="flex w-full mx-auto h-full">
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-4xl font-bold">Offres d'emploi</h2>

              <img
                src={offres}
                alt="CVVideo"
                className="mx-auto mt-10"
                style={{ maxHeight: "350px", width: "auto", height: "auto" }}
              />

              <p className="mt-6 text-xl">
                {" "}
                Découvre les offres disponibles et <span className="text-blue-400">postule</span> en un clic !
              </p>
            </div>
            <Offers />
          </div>
        </div>
      </div>
    </div>
  );
}
