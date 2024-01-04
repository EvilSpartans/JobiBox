import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../fields/Input";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookForm/resolvers/yup";
import { portalSchema } from "../../utils/Validation";
import PulseLoader from "react-spinners/PulseLoader";
import {
  changeStatus,
  accessPortal,
  getPortals,
} from "../../store/features/portalSlice";
import Select from "../fields/Select";

export default function PortalForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.portal);
  const [portalOptions, setPortalOptions] = useState([]);

  useEffect(() => {
    fetchPortals();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(portalSchema),
  });

  // Fetch portals
  const fetchPortals = async () => {
    try {
      const response = await dispatch(getPortals());
      const portalsData = response.payload;
      const updatedPortalOptions = portalsData.map((portal) => ({
        value: portal.id,
        label: portal.title,
      }));
      setPortalOptions(updatedPortalOptions);
    } catch (error) {
      console.error("Erreur lors de la récupération des portails :", error);
    }
  };

  // Submit Form
  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));

    const postData = {
      password: data.password,
      id: data.business,
    };

    try {
      const response = await dispatch(accessPortal(postData));
      const res = response.payload;
        if (res?.message == "Authorized") {
          localStorage.setItem("businessId", data.business);
          navigate('/login');
        }
    } catch (error) {
      console.error("Erreur lors de l'accès au portail' :", error);
    } finally {
      dispatch(changeStatus(""));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Configuration</h2>
          <p className="mt-2 text-sm">Connexion au portail</p>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <Select
            name="business"
            placeholder="Portail"
            register={register}
            error={errors?.business?.message}
            options={portalOptions}
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
        </form>
      </div>
    </div>
  );
}
