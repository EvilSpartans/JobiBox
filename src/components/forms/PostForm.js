import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookForm/resolvers/yup";
import PulseLoader from "react-spinners/PulseLoader";
import { format } from "date-fns";

import { createPost, changeStatus } from "../../store/slices/postSlice";
import { getCategories } from "../../store/slices/categorySlice";
import { getJobiboxPortals } from "../../store/slices/jobiboxSlice";
import { sendConfirmNotification } from "../core/Notification";

import Input from "../fields/Input";
import Textarea from "../fields/Textarea";
import Checkbox from "../fields/Checkbox";
import Select from "../fields/Select";
import SelectMultiple from "../fields/SelectMultiple";

import { PostSchema } from "../../utils/Validation";
import Photo from "../core/Photo";
import { getEducationLevelsByCountry } from "../../utils/EducationLevel";
import { getContractTypesByCountry } from "../../utils/ContractTypes";

export default function PostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.post);
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const [contracts, setContracts] = useState([]);
  const [hidePortal, setHidePortal] = useState([]);
  const [portals, setPortals] = useState([]);
  const [portalsOptions, setPortalsOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [studiesOptions, setStudiesOptions] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const BASE_URL = process.env.REACT_APP_WEB_BASE_URL;
  const businessId = localStorage.getItem("businessId") || null;
  const isTrainExam = localStorage.getItem("isTrainExam") || null;
  const showPortalCheckbox = businessId !== null && businessId !== 0;
  const [formError, setFormError] = useState("");

  const simulationInProgress =
    localStorage.getItem("beginnerInProgress") ||
    localStorage.getItem("intermediateInProgress");

  const expertInProgress = localStorage.getItem("expertInProgress");

  // Form's options
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PostSchema),
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await dispatch(getCategories(token));
      const categoriesData = response.payload.items;
      const updatedCategoryOptions = categoriesData.map((category) => ({
        value: category.name,
        label: category.name,
      }));
      setCategoryOptions(updatedCategoryOptions);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const fetchPortals = async () => {
    try {
      const jobiboxId = localStorage.getItem("jobiboxId");

      if (jobiboxId === null) {
        setStudiesOptions(getEducationLevelsByCountry("France"));
        setContractOptions(getContractTypesByCountry("France"));
      }

      const response = await dispatch(getJobiboxPortals({ id: jobiboxId }));
      const portalsData = response.payload;

      // Filtrer les portails pour exclure ceux contenant "simulation" dans le titre
      const filteredPortals = portalsData.portals.filter(
        (portal) => !portal.title.toLowerCase().includes("simulation")
      );

      const portalsOptions = filteredPortals.map((portal) => ({
        value: portal.id,
        label: portal.title,
      }));

      if (filteredPortals.length === 1) {
        setPortals([filteredPortals[0]]);
        setHidePortal(true);
      } else {
        setHidePortal(false);
      }

      setPortalsOptions(portalsOptions);

      const educationLevelsForCountry = getEducationLevelsByCountry(
        portalsData.country
      );
      setStudiesOptions(educationLevelsForCountry);

      const contractTypesForCountry = getContractTypesByCountry(
        portalsData.country
      );
      setContractOptions(contractTypesForCountry);
    } catch (error) {
      console.error("Erreur lors de la récupération des portails :", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPortals();
  }, []);

  const subCategoryOptions = [
    { value: "Emploi", label: "Recruteur" },
    { value: "CV", label: "En recherche d'emploi" },
  ];

  const commentOptions = [
    { value: "Oui", label: "Oui" },
    { value: "Non", label: "Non" },
  ];

  const kmOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
    { value: "40", label: "40" },
    { value: "50", label: "50" },
    { value: "70", label: "70" },
    { value: "100", label: "100" },
    { value: "130", label: "130" },
    { value: "160", label: "160" },
    { value: "200", label: "200" },
  ];

  // Video properties
  const videoPath = localStorage.getItem("videoPath");
  const handleMetadata = (e) => {
    e.preventDefault();
    e.target.currentTime = 0;
  };

  const generateImageFromVideo = async () => {
    const videoElement = document.createElement("video");
    videoElement.src = `${BASE_URL}/${videoPath}`;
    videoElement.currentTime = 4;

    return new Promise((resolve) => {
      videoElement.addEventListener("loadeddata", () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(blob);

          URL.revokeObjectURL(videoElement.src);
          videoElement.remove();
          canvas.remove();
        }, "image/jpeg");
      });
      videoElement.load();
    });
  };

  // Submit Form
  const onSubmit = async (data) => {
    if (businessId && portalsOptions.length > 1 && portals.length === 0) {
      setFormError("Tu dois sélectionner au moins un portail.");
      return;
    }

    dispatch(changeStatus("loading"));
    const selectedContracts = contracts.map((contract) => contract.value);

    let formattedDate = "";
    if (startDate) {
      formattedDate = format(startDate, "yyyy-MM-dd HH:mm:ss");
    }

    const imageBlob = photoFile || (await generateImageFromVideo());
    const imageFile = new File([imageBlob], "thumbnail.jpg", {
      type: "image/jpeg",
    });

    const postData = {
      token: token,
      title: data.title,
      description: data.description,
      category: data.category,
      subCategory: data.subCategory || "Portail",
      place: data.city,
      activateComments: true,
      formation: data.formation === "Oui",
      remote: data.remote,
      date: formattedDate,
      diploma: data.diploma,
      km: data.km,
      createdFrom: "jobibox",
      contracts: selectedContracts,
      video: videoPath,
      image: imageFile,
      businessId,
      portal:
        hidePortal && portals.length === 1
          ? [portals[0].id] // auto sélection si un seul portail
          : portals.map((portal) => portal.value || portal.id),
    };

    try {
      const res = await dispatch(createPost(postData));
      console.log(res);
      if (res?.payload?.title) {
        localStorage.setItem("urlQrcode", res.payload.video);
        if (simulationInProgress || expertInProgress) {
          navigate("/evaluation");
        } else {
          navigate("/thanks");
        }
        sendConfirmNotification();
      }
    } catch (error) {
      console.error("Erreur lors de la création de la publication :", error);
    } finally {
      localStorage.removeItem("selectedQuestions");
      localStorage.removeItem("selectedTheme");
      localStorage.removeItem("selectedMusic");
      localStorage.removeItem("videoPath");
      localStorage.removeItem("videoId");
      localStorage.removeItem("textStyle");
      localStorage.removeItem("examenInProgress");
      localStorage.removeItem("isTrainExam");
      localStorage.removeItem("selectedGreenFilter");
      localStorage.removeItem("selectedAnimation");
      dispatch(changeStatus(""));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-2 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-4xl font-bold">Publication</h2>
          <p className="mt-6 text-xl">
            <span className="text-blue-400">Complète les champs</span> suivants
            pour mettre en ligne ta vidéo.
          </p>
        </div>

        {/* Video */}
        {videoPath && (
          <video
            key={videoPath}
            controls
            disablePictureInPicture
            controlsList="nodownload"
            width="100%"
            className="h-48 md:h-64 lg:h-96 xl:h-120"
            preload={"auto"}
            onLoadedMetadata={handleMetadata}
          >
            <source src={`${BASE_URL}/${videoPath}`} type="video/mp4" />
            Votre navigateur ne prend pas en charge la balise vidéo.
          </video>
        )}

        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Photo onPhotoTaken={setPhotoFile} />

          <hr />

          <Input
            name="title"
            type="text"
            label="Nom du poste recherché"
            placeholder="Ex : Conseiller en vente, Assistant RH.."
            register={register}
            error={errors?.title?.message}
            className="required-field"
          />
          <Select
            name="subCategory"
            placeholder="Es-tu recruteur ou en recherche d'emploi ?"
            register={register}
            error={errors?.subCategory?.message}
            options={subCategoryOptions}
            className="required-field"
          />
          <Select
            name="category"
            placeholder="Domaine d'activité"
            register={register}
            error={errors?.category?.message}
            options={categoryOptions}
            className="required-field"
          />
          {showPortalCheckbox && portalsOptions.length > 1 && (
            <SelectMultiple
              name="portal"
              placeholder="Référencement"
              register={register}
              error={errors?.portal?.message}
              options={portalsOptions}
              value={portals}
              onChange={setPortals}
              style={{ display: !hidePortal ? "block" : "none" }}
              className="required-field"
            />
          )}

          <hr />

          {/* Only for CV video */}
          {isTrainExam !== "true" && (
            <>
              <div className="flex justify-between space-x-2 !mt-0">
                <Input
                  name="city"
                  type="text"
                  label="Ville"
                  placeholder="Ex : Paris, Lille.."
                  register={register}
                  error={errors?.city?.message}
                  style={{ minWidth: "380px" }}
                />
                <Select
                  name="km"
                  placeholder="Rayon de Km"
                  register={register}
                  error={errors?.km?.message}
                  options={kmOptions}
                />
              </div>
              <Select
                name="diploma"
                placeholder="Niveau d'études"
                register={register}
                error={errors?.diploma?.message}
                options={studiesOptions}
              />
              <div className="flex justify-between space-x-2 !mt-0">
                <SelectMultiple
                  name="contracts"
                  label="Contrats"
                  placeholder="Sélectionner un ou plusieurs contrats"
                  register={register}
                  error={errors?.contracts?.message}
                  options={contractOptions}
                  value={contracts}
                  onChange={setContracts}
                  style={{ minWidth: "430px" }}
                />
                <Checkbox
                  name="remote"
                  label="Télétravail"
                  register={register}
                  error={errors?.remote?.message}
                  style={{ marginTop: "3.5rem" }}
                />
              </div>
              <Select
                name="formation"
                placeholder="Es-tu à la recherche d'une formation ?"
                register={register}
                error={errors?.formation?.message}
                options={commentOptions}
              />
              <Input
                name="date"
                type="text"
                label="Date de début"
                placeholder="jj/mm/aaaa"
                register={register}
                error={errors?.date?.message}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <Textarea
                name="description"
                type="text"
                label="Résumé du cv"
                placeholder="Ex : Plombier expérimenté, 06 12 34 56 78, jean@mail.com.."
                register={register}
                error={errors?.description?.message}
              />
            </>
          )}

          {/*if we have an error*/}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}
          {formError && <p className="text-red-400">{formError}</p>}
          {/*Submit button*/}
          <button
            className={`text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
            font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300 ${
              status ? "opacity-50 pointer-events-none" : ""
            }`}
            type="submit"
            disabled={status}
          >
            {status ? <PulseLoader color="#fff" size={16} /> : "Publier"}
          </button>
        </form>
      </div>
    </div>
  );
}
