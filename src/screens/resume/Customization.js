import React, { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
 createResume,
 getResume,
 updateResume,
} from "../../store/slices/resumeSlice";
import ResumeHeader from "../../components/resume/ResumeHeader";
import Footer from "../../components/resume/Footer";
import CVStepper from "../../components/resume/Stepper";
import FormSeparator from "../../components/resume/FormSeparator";
import { CV_STEPS_STEPPER, TEMPLATES, COLORS } from "../../utils/IAResume";
import Wheel from "@uiw/react-color-wheel";
import GlowBackground from "../../components/resume/GlowBackground";

export default function Customization() {
 const { t } = useTranslation();
 const user = useSelector((state) => state.user.user);
 const token = user?.token;
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const { status, resume } = useSelector((state) => state.resume);
 const loading = status === "loading";

 const [title, setTitle] = useState("");
 const [selectedDesign, setSelectedDesign] = useState(TEMPLATES[0]?.key ?? null);
 const [selectedColor, setSelectedColor] = useState("#10b981");
 const [showColorPicker, setShowColorPicker] = useState(false);

 const designs = TEMPLATES;
 const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
 const sliderRef = useRef(null);

 const sliderSettings = {
  infinite: designs.length > 3,
  speed: 500,
  slidesToShow: Math.min(3, designs.length),
  slidesToScroll: 1,
  centerMode: false,
  arrows: true,
  initialSlide: Math.max(0, resume?.template ? designs.findIndex((d) => d.key === resume.template) : 0),
  afterChange: (index) => {
   setSelectedTemplateIndex(index);
   setSelectedDesign(designs[index]?.key ?? null);
  },
 };

 const currentStep = 1;
 const completedSteps = [];

 useEffect(() => {
  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId || !user?.token) return;

  dispatch(getResume({ token: user.token, id: resumeId }));
 }, [dispatch, user]);

 useEffect(() => {
  if (!resume) return;

  if (resume.title) setTitle(resume.title);
  if (resume.template) {
   const idx = designs.findIndex((d) => d.key === resume.template);
   if (idx >= 0) {
    setSelectedDesign(resume.template);
    setSelectedTemplateIndex(idx);
   }
  }
  if (resume.mainColor) setSelectedColor(resume.mainColor);
 }, [resume]);


 const handleNavigate = async (step, direction) => {
  if (direction === "backward") {
   navigate(step.path);
   return;
  }

  if (!title?.trim() || !selectedDesign || loading) return;

  try {
   const resumeId = localStorage.getItem("resumeId");

   // 👉 CAS 1 : le CV existe déjà → UPDATE (pas de recréation)
   if (resumeId) {
    await dispatch(
     updateResume({
      token,
      id: resumeId,
      payload: {
       // 🔒 on garde tout
       title: resume?.title,
       template: resume?.template,
       mainColor: resume?.mainColor,
       personalInfo: resume?.personalInfo,
       contractType: resume?.contractType || [],
       languages: resume?.languages || [],
       skills: resume?.skills || [],
       softSkills: resume?.softSkills || [],
       trainings: resume?.trainings || [],
       experiences: resume?.experiences || [],
       presentation: resume?.presentation || "",
       alternanceDuration: resume?.alternanceDuration || "",
       alternanceStartDate: resume?.alternanceStartDate || "",

       // ✏️ on écrase CE QUI CHANGE ICI
       title,
       template: selectedDesign,
       mainColor: colorToSave,
      },
     }),
    ).unwrap();

    navigate(step.path);
    return;
   }

   // 👉 CAS 2 : premier passage → CREATE
   const action = await dispatch(
    createResume({
     token,
     title,
     template: selectedDesign,
     mainColor: colorToSave,
    }),
   );

   if (createResume.fulfilled.match(action)) {
    const resume = action.payload;
    localStorage.setItem("resumeId", resume.id);
    navigate(step.path);
   } else {
    console.error("Création du CV échouée :", action);
   }
  } catch (error) {
   console.error("Erreur handleNavigate :", error);
  }
 };

 const isValidHex = (hex) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
 const colorToSave = isValidHex(selectedColor) ? selectedColor : (resume?.mainColor || "#10b981");

 const handleNext = () => {
  const nextStep = CV_STEPS_STEPPER.find((s) => s.id === currentStep + 1);
  if (nextStep) handleNavigate(nextStep, "forward");
 };

 return (
  <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
   {/* Actions fixes */}
   <ResumeHeader goBackProps={{ itemsToRemove: ["resumeId"] }} />

   <GlowBackground />

   <div className="relative z-10 h-full flex items-center justify-center px-4">
    <div
     className="flex flex-col w-full max-w-5xl
                   h-[88vh]
                   overflow-y-auto scrollbar-none
                   p-6 sm:p-8 md:p-10
                   rounded-3xl
                   bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80
                   backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
    >
     <CVStepper
      currentStep={currentStep}
      completedSteps={completedSteps}
      disabled={!title?.trim() || !selectedDesign}
      loading={loading}
      onNavigate={handleNavigate}
     />

     {/* Titre du CV */}
     <div className="mt-10 max-w-xl mx-auto w-full">
      <label className="block text-sm text-gray-300 mb-3">{t("resume.customization.titleLabel")}</label>
      <input
       type="text"
       value={title}
       onChange={(e) => setTitle(e.target.value)}
       placeholder={t("resume.customization.titlePlaceholder")}
       className="w-full rounded-xl bg-white/5 border border-white/10
                       text-white px-4 py-3 focus:border-emerald-500 outline-none"
      />
     </div>

     {/* Sélection du design — slider avec aperçu grand */}
     <div className="mt-10 flex flex-col">
      <h3 className="text-lg font-semibold text-emerald-300 text-center mb-4">
       {t("resume.customization.chooseDesign")}
      </h3>

      <div className="template-slider-wrap flex-shrink-0 px-10 sm:px-12 py-2">
       <Slider ref={sliderRef} key={resume?.id ?? "new"} {...sliderSettings}>
        {designs.map((design, index) => (
         <div
          key={design.key}
          className="flex justify-center cursor-pointer"
          onClick={() => {
           setSelectedTemplateIndex(index);
           setSelectedDesign(design.key);
           sliderRef.current?.slickGoTo(index);
          }}
         >
          <div
           className={`rounded-xl overflow-hidden shadow-xl bg-white/5 flex items-center justify-center transition-all relative ${
            selectedTemplateIndex === index
             ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-dark_bg_2"
             : "ring-1 ring-white/10"
           }`}
           style={{
            width: "min(190px, 55vw)",
            aspectRatio: "210/297",
            minHeight: 160,
           }}
          >
           <img
            src={design.image}
            alt={design.label}
            className="max-w-full max-h-full object-contain"
           />
           {selectedTemplateIndex === index && (
            <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
           )}
          </div>
         </div>
        ))}
       </Slider>
      </div>
     </div>

     <FormSeparator compact />

     {/* Sélection de la couleur */}
     <div className="mt-8">
      <h3 className="text-lg font-semibold text-emerald-300 text-center mb-2">
       {t("resume.customization.mainColor")}
      </h3>

      <div className="flex justify-center">
       <button
        type="button"
        onClick={() => setShowColorPicker(true)}
        className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
       >
        <div
         className="w-12 h-12 rounded-xl ring-2 ring-white/20"
         style={{ backgroundColor: isValidHex(selectedColor) ? selectedColor : (resume?.mainColor || "#10b981") }}
        />
        <span className="text-white font-medium">
         {t("resume.customization.chooseColor")}
        </span>
       </button>
      </div>

      {/* Modale palette de couleurs */}
      {showColorPicker && (
       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70" onClick={() => setShowColorPicker(false)} />
        <div
         className="relative bg-dark_bg_2 rounded-2xl p-6 max-w-md w-full shadow-2xl ring-1 ring-white/10"
         onClick={(e) => e.stopPropagation()}
        >
         <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-emerald-300">
           {t("resume.customization.chooseColor")}
          </h4>
          <button
           onClick={() => setShowColorPicker(false)}
           className="text-gray-400 hover:text-white text-2xl leading-none"
          >
           ×
          </button>
         </div>

         {/* Roue chromatique */}
         <div className="flex justify-center mb-6">
          <Wheel
           color={/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(selectedColor) ? selectedColor : "#10b981"}
           onChange={(color) => setSelectedColor(color.hex)}
           width={220}
           height={220}
          />
         </div>

         {/* Code couleur personnalisé */}
         <p className="text-sm text-gray-400 mb-2">{t("resume.customization.customCode")}</p>
         <div className="flex items-center gap-3 mb-4">
          <input
           type="text"
           value={selectedColor}
           onChange={(e) => {
            const val = e.target.value;
            if (val.startsWith("#") && val.length <= 7) {
             setSelectedColor(val);
            } else if (!val.startsWith("#") && val.length <= 6) {
             setSelectedColor(val ? `#${val}` : "#");
            }
           }}
           onBlur={(e) => {
            const val = e.target.value.trim();
            const hex = val.startsWith("#") ? val : `#${val}`;
            if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
             const hex6 = hex.length === 4
              ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
              : hex;
             setSelectedColor(hex6);
            }
           }}
           placeholder="#ffffff"
           className="flex-1 px-3 py-2 rounded-lg bg-dark_bg_3 border border-white/10 text-white font-mono text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <div
           className="w-10 h-10 rounded-lg ring-2 ring-white/20 flex-shrink-0"
           style={{ backgroundColor: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(selectedColor) ? selectedColor : "#333" }}
          />
         </div>

         {/* Palette de couleurs prédéfinies */}
         <p className="text-sm text-gray-400 mb-3">{t("resume.customization.presetColors")}</p>
         <div className="grid grid-cols-10 gap-2">
          {COLORS.map((color) => (
           <button
            key={color.value}
            type="button"
            onClick={() => setSelectedColor(color.value)}
            className={`w-8 h-8 rounded-lg transition ring-offset-2 ring-offset-dark_bg_2
             ${selectedColor === color.value ? "ring-2 ring-white scale-110" : "ring-1 ring-white/10 hover:scale-105"}`}
            style={{ backgroundColor: color.value }}
            title={color.name}
           />
          ))}
         </div>

         {/* Aperçu */}
         <div className="mt-4 flex items-center gap-3">
          <div
           className="w-10 h-10 rounded-lg ring-2 ring-white/20"
           style={{ backgroundColor: selectedColor }}
          />
          <span className="text-sm text-gray-400 font-mono">{selectedColor}</span>
         </div>

         <button
          onClick={() => setShowColorPicker(false)}
          className="mt-4 w-full py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
         >
          {t("resume.customization.confirmColor")}
         </button>
        </div>
       </div>
      )}
     </div>

     {/* Footer */}
     <div className="pt-10 flex justify-end">
      <Footer
       onClick={handleNext}
       disabled={!title?.trim() || !selectedDesign || loading}
       loading={loading}
      />
    </div>
   </div>
  </div>
  </div>
 );
}
