import React from "react";
import Logout from "../../components/core/Logout";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";

export default function Thanks() {

  const navigate = useNavigate();
  const videoPath = localStorage.getItem("urlQrcode");
  const BASE_URL = process.env.REACT_APP_AWS_BASE_URL;

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
              <h2 className="text-4xl font-bold">Remerciements</h2>
              <p className="mt-12 text-xl">
                Nous te remercions d’avoir utilisé la Jobibox.{" "}
                <span className="text-blue-400">L’équipe de JOBISSIM</span>{" "}
                espère que cette expérience t’a plu et te souhaite bonne chance
                dans tes recherches.
                <br /> <br />
                PS : Ton CV vidéo vient d'atterrir sur ta{" "}
                <span className="text-blue-400">boite mail</span>, télécharge le
                et diffuse le au maximum ! Tu peux aussi scanner le QR code
                ci-dessous :
              </p>

              <div className="flex justify-center items-center mt-10 mb-5">
                <QRCodeSVG value={`${BASE_URL}/${videoPath}`} />
              </div>
            </div>
            {/*Buttons*/}
            <Logout position="static" />
            <button
              className="text-xl w-full flex justify-center bg-blue_4 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover:bg-blue-500 shadow-lg cursor-pointer transition ease-in duration-300"
              onClick={() => navigate("/")}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
