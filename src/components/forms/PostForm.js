import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookForm/resolvers/yup";
import PulseLoader from "react-spinners/PulseLoader";
import { format } from "date-fns";

import { createPost, changeStatus } from "../../store/features/postSlice";
import { getCategories } from "../../store/features/categorySlice";
import { getSubCategories } from "../../store/features/subCategorySlice";
import { sendConfirmNotification } from "../Notification";

import Input from "../fields/Input";
import Textarea from "../fields/Textarea";
import Checkbox from "../fields/Checkbox";
import Select from "../fields/Select";
import SelectMultiple from "../fields/SelectMultiple";

import { PostSchema } from "../../utils/Validation";

export default function PostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.post);
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const [contracts, setContracts] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const BASE_URL = "https://jobibox.jobissim.com";
  const businessId = localStorage.getItem('businessId') | null;
  const showPortalCheckbox = businessId !== null && businessId !== 0;
  
  const handleSelectContracts = (selectedValues) => {
    setContracts(selectedValues);
  };

  // Form's options
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(PostSchema),
  });

  // Fetch categories & subCategories
  const fetchCategories = async () => {
    try {
      const response = await dispatch(getCategories(token));
      const categoriesData = response.payload;
      const updatedCategoryOptions = categoriesData.map((category) => ({
        value: category.name,
        label: category.name,
      }));
      setCategoryOptions(updatedCategoryOptions);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await dispatch(getSubCategories(token));
      const subCategoriesData = response.payload;
      const updatedSubCategoryOptions = subCategoriesData.map(
        (subCategory) => ({
          value: subCategory.name,
          label: subCategory.name,
        })
      );

      const filteredSubCategoryOptions = updatedSubCategoryOptions.filter(
        (subCategory) =>
          subCategory.value !== "Actualité" && subCategory.value !== "Portail"
      );

      setSubCategoryOptions(filteredSubCategoryOptions);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des sous-catégories :",
        error
      );
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const commentOptions = [
    { value: "Oui", label: "Oui" },
    { value: "Non", label: "Non" },
  ];

  const hmyOptions = [
    { value: "Heure", label: "Heure" },
    { value: "Mois", label: "Mois" },
    { value: "Année", label: "Année" },
  ];

  const contractOptions = [
    { value: "CDI", label: "CDI" },
    { value: "CDD", label: "CDD" },
    { value: "Alternance", label: "Alternance" },
    { value: "Stage", label: "Stage" },
    { value: "Freelance", label: "Freelance" },
    { value: "CDD", label: "CDD" },
    { value: "Intérim", label: "Intérim" },
    { value: "Vie", label: "Vie" },
    { value: "Statutaire", label: "Statutaire" },
    { value: "Franchise", label: "Franchise" },
    { value: "Saisonnier", label: "Saisonnier" },
    { value: "Volontaire", label: "Volontaire" },
    { value: "Formation", label: "Formation" },
  ];

  // Video properties
  const videoPath = localStorage.getItem("videoPath");
  const handleMetadata = (e) => {
    e.preventDefault();
    e.target.currentTime = 0;
  };

  const generateImageFromVideo = async () => {
    const videoElement = document.createElement('video');
    videoElement.src = `${BASE_URL}/${videoPath}`;
    videoElement.currentTime = 4;

    return new Promise((resolve) => {
      videoElement.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          resolve(blob);

          URL.revokeObjectURL(videoElement.src); 
          videoElement.remove(); 
          canvas.remove();
        }, 'image/jpeg');
      });
      videoElement.load();
    });
  };

  // Submit Form
  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    const selectedContracts = contracts.map((contract) => contract.value);

    let formattedDate = "";
    if (startDate) {
      formattedDate = format(startDate, "yyyy-MM-dd HH:mm:ss");
    }

    const imageBlob = await generateImageFromVideo();
    const imageFile = new File([imageBlob], 'thumbnail.jpg', { type: 'image/jpeg' });

    const postData = {
      token: token,
      title: data.title,
      description: data.description,
      category: data.category,
      subCategory: data.subCategory || "Portail",
      city: data.city,
      salary: data.salary,
      hmy: data.hmy,
      activateComments: data.activateComments,
      formation: data.formation === "Oui",
      remote: data.remote,
      date: formattedDate,
      contracts: selectedContracts,
      video: videoPath,
      image: imageFile,
      businessId,
      portal: data.portal ? 1 : 0
    };

    try {
      const res = await dispatch(createPost(postData));
      // console.log(res);
      if (res?.payload?.title) {
        navigate("/thanks");
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
      dispatch(changeStatus(""));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-2 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Publication</h2>
          <p className="mt-6 text-base"><span className="text-blue-400">Complète les champs</span> suivants pour mettre en ligne ta vidéo.</p>
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
            preload={'auto'}
            onLoadedMetadata={handleMetadata}
          >
            <source src={`${BASE_URL}/${videoPath}`} type="video/mp4" />
            Votre navigateur ne prend pas en charge la balise vidéo.
          </video>
        )}

        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            name="title"
            type="text"
            placeholder="Titre"
            register={register}
            error={errors?.title?.message}
          />
          <Select
            name="subCategory"
            placeholder="Classification"
            register={register}
            error={showPortalCheckbox ? errors?.portal ? errors?.subCategory?.message : null : errors?.subCategory?.message}
            options={subCategoryOptions}
          />
          <Select
            name="category"
            placeholder="Catégorie"
            register={register}
            error={errors?.category?.message}
            options={categoryOptions}
          />
          {showPortalCheckbox && (
          <Checkbox
            name="portal"
            label="Portail"
            register={register}
            error={errors?.subCategory ? errors?.portal?.message : null}
          />
          )}
          <Input
            name="city"
            type="text"
            placeholder="Ville"
            register={register}
            error={errors?.city?.message}
          />
          <Textarea
            name="description"
            type="text"
            placeholder="Description"
            register={register}
            error={errors?.description?.message}
          />
          <SelectMultiple
            name="contracts"
            placeholder="Contrats"
            register={register}
            error={errors?.contracts?.message}
            options={contractOptions}
            value={contracts}
            onChange={handleSelectContracts}
          />
          <Select
            name="activateComments"
            placeholder="Autoriser les commentaires"
            register={register}
            error={errors?.activateComments?.message}
            options={commentOptions}
          />
          <Select
            name="formation"
            placeholder="Es-tu en formation ?"
            register={register}
            error={errors?.formation?.message}
            options={commentOptions}
          />
          <div className="flex space-x-2 !mt-0">
            <Input
              name="salary"
              type="text"
              placeholder="Salaire"
              register={register}
              error={errors?.salary?.message}
            />
            <Select
              name="hmy"
              placeholder="Période"
              register={register}
              error={errors?.hmy?.message}
              options={hmyOptions}
            />
          </div>
          <Input
            name="date"
            type="text"
            placeholder="Date de début"
            register={register}
            error={errors?.date?.message}
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <Checkbox
            name="remote"
            label="Télétravail"
            register={register}
            error={errors?.remote?.message}
          />
          {/*if we have an error*/}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}
          {/*Submit button*/}
          <button 
            className={`w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
            font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300 ${ status ? "opacity-50 pointer-events-none" : "" }`}
            type="submit"
            disabled={status}
          >
            {status ? <PulseLoader color="#fff" size={16} /> : "Valider"}
          </button>
        </form>
      </div>
    </div>
  );
}
