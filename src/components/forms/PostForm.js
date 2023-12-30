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
import FileInput from "../fields/FileInput";

import { PostSchema } from "../../utils/validation";
import GoBack from "../GoBack";

export default function PostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.post);
  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const [contracts, setContracts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const BASE_URL = "https://test.jobissim.com";

  const handleSelectContracts = (selectedValues) => {
    setContracts(selectedValues);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
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
  const [thumbnail, setThumbnail] = useState(null);
  const handleMetadata = (e) => {
    e.preventDefault();
    e.target.currentTime = 0;
  };

  const fetchVideoAndCreateFile = async (url, fileName) => {
    const response = await fetch(url);
    const videoBuffer = await response.arrayBuffer();
    const videoBlob = new Blob([videoBuffer], { type: "video/mp4" });
    return new File([videoBlob], fileName, { type: "video/mp4" });
  };

  const [selectedVideo, setSelectedVideo] = useState(
    videoPath
      ? fetchVideoAndCreateFile(
          `https://test.jobissim.com/${videoPath}`,
          "video.mp4"
        )
      : null
  );

  const fetchVideoAndSetSelected = async () => {
    const newSelectedVideo = videoPath
      ? await fetchVideoAndCreateFile(
          `https://test.jobissim.com/${videoPath}`,
          "video.mp4"
        )
      : null;
    setSelectedVideo(newSelectedVideo);
  };

  useEffect(() => {
    fetchVideoAndSetSelected();
  }, [videoPath]);

  // Submit Form
  const onSubmit = async (data) => {
    dispatch(changeStatus("loading"));
    const selectedContracts = contracts.map((contract) => contract.value);

    let formattedDate = "";
    if (startDate) {
      formattedDate = format(startDate, "yyyy-MM-dd HH:mm:ss");
    }

    const postData = {
      token: token,
      title: data.title,
      description: data.description,
      category: data.category,
      subCategory: data.subCategory,
      city: data.city,
      salary: data.salary,
      hmy: data.hmy,
      activateComments: data.activateComments,
      remote: data.remote,
      date: formattedDate,
      contracts: selectedContracts,
      video: selectedVideo,
      image: selectedImage,
    };

    try {
      const res = await dispatch(createPost(postData));
      console.log(res);

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
      localStorage.removeItem("questionTuto");
      localStorage.removeItem("themeTuto");
      localStorage.removeItem("musicTuto");
      localStorage.removeItem("filmTuto");
      localStorage.removeItem("clipTuto");
      localStorage.removeItem("textStyleTuto");
      localStorage.removeItem("textStyle");
      localStorage.removeItem("transcriptionTuto");
      localStorage.removeItem("loginTuto");
      localStorage.removeItem("registerTuto");
      dispatch(changeStatus(""));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <GoBack />
      {/* Container */}
      <div className="flex flex-col justify-center h-fit w-full max-w-[70%] space-y-8 tall:space-y-16 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/*Heading*/}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Publication</h2>
          <p className="mt-2 text-sm">Compléter les champs suivants</p>
        </div>

        {/* Video */}
        {videoPath && (
          <video
            controls
            disablePictureInPicture
            controlsList="nodownload"
            width="100%"
            className="mb-4 h-48 md:h-64 lg:h-96 xl:h-120"
            poster={thumbnail}
            onLoadedMetadata={handleMetadata}
          >
            <source src={`${BASE_URL}/${videoPath}`} type="video/mp4" />
            Votre navigateur ne prend pas en charge la balise vidéo.
          </video>
        )}

        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FileInput
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
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
            error={errors?.subCategory?.message}
            options={subCategoryOptions}
          />
          <Select
            name="category"
            placeholder="Catégorie"
            register={register}
            error={errors?.category?.message}
            options={categoryOptions}
          />
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
            className="w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
          font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300
          "
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
