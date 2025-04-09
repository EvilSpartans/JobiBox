import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookForm/resolvers/yup";
import { businessSchema } from "../utils/Validation";
import PulseLoader from "react-spinners/PulseLoader";
import { getJobibox } from "../services/jobibox.service";
import Select from "../components/fields/Select";
import { AppDispatch } from "../store/Store";
import { JobiBox } from "../models/JobiBox";

export default function JobiboxForm(): React.JSX.Element {
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: any) => state.jobibox);
  const [jobiboxData, setJobiboxData] = useState<JobiBox[]>([]);
  const [jobiboxOptions, setJobiboxOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchJobibox();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(businessSchema),
  });

  // Fetch portals
  const fetchJobibox = async () => {
    try {
      const response = await dispatch(getJobibox({}));
      const data = response.payload;
      if (Array.isArray(data)) {
        setJobiboxData(data);
  
        const updatedJobiboxOptions = data.map((jobibox) => ({
          value: jobibox.id,
          label: jobibox.business.title,
        }));
  
        setJobiboxOptions(updatedJobiboxOptions);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des portails :", error);
    }
  };

  // Submit Form
  const onSubmit = async (data: any) => {
    const selectedJobibox = jobiboxData.find((jobibox) => jobibox.id === parseInt(data.business));
    if (!selectedJobibox) {
      console.error("Erreur : Impossible de trouver la jobibox sélectionnée.");
      return;
    }
    localStorage.setItem("businessId", selectedJobibox.business.id);
    localStorage.setItem("jobiboxId", selectedJobibox.id);
    localStorage.setItem("trainingActivated", selectedJobibox.training);
    localStorage.setItem("examActivated", selectedJobibox.exam);
    navigate('/welcome');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-4xl font-bold">Configuration</h2>
          <p className="mt-6 text-xl">Connexion à la page <span className="text-blue-400">entreprise.</span></p>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <Select
            name="business"
            placeholder="Entreprise"
            register={register}
            error={errors?.business?.message}
            options={jobiboxOptions} 
            className={undefined}          />
          {/*if we have an error*/}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}
          {/*Submit button*/}
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
        </form>
      </div>
    </div>
  );
}
