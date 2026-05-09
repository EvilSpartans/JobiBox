import React from "react";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";
import { AuthPageShell } from "../../components/core/AuthLayout";
import Offers from "../../components/offer/Offers";
import offres from "../../../assets/images/offres.png";

export default function OfferScreen() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack itemsToRemove={["textStyle"]} />
      <Logout />
      <div className="flex w-full mx-auto h-full min-h-0">
        <AuthPageShell outerClassName="p-2 sm:p-3">
          <div className="flex min-h-0 flex-1 flex-col px-4 sm:px-6 py-10 tall:py-14">
            <header className="text-center dark:text-dark_text_1 shrink-0 flex flex-col items-center gap-8 sm:gap-10">
              <h2 className="text-4xl font-bold tracking-tight">
                Offres d&apos;emploi
              </h2>

              <img
                src={offres}
                alt=""
                className="mx-auto"
                style={{ maxHeight: "140px", width: "auto", height: "auto" }}
              />

              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-neutral-600 dark:text-dark_text_2 leading-relaxed">
                Parcours les offres disponibles, postule en un clic ou
                ajoute-les à tes favoris pour les retrouver sur ton espace
                Jobissim.
              </p>
            </header>
            <div className="mt-10 sm:mt-12 min-h-0 flex-1 flex flex-col">
              <Offers />
            </div>
          </div>
        </AuthPageShell>
      </div>
    </div>
  );
}
