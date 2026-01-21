import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
 createResume,
 getResume,
 updateResume,
} from "../../store/slices/resumeSlice";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";
import Footer from "../../components/resume/Footer";
import { COLORS, TEMPLATES } from "../../utils/IAResume";
import FormSeparator from "../../components/resume/FormSeparator";
import Header from "../../components/resume/Header";
import GlowBackground from "../../components/resume/GlowBackground";

export default function Customization() {
 const user = useSelector((state) => state.user.user);
 const { token } = user;
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const { status, resume } = useSelector((state) => state.resume);
 const loading = status === "loading";

 const [title, setTitle] = useState("");
 const [selectedDesign, setSelectedDesign] = useState(null);
 const [selectedColor, setSelectedColor] = useState("#10b981");

 const designs = TEMPLATES;
 const colors = COLORS;

 useEffect(() => {
  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId || !user?.token) return;

  dispatch(getResume({ token: user.token, id: resumeId }));
 }, [dispatch, user]);

 useEffect(() => {
  if (!resume) return;

  if (resume.title) setTitle(resume.title);
  if (resume.template) setSelectedDesign(resume.template);
  if (resume.mainColor) setSelectedColor(resume.mainColor);
 }, [resume]);

 const handleNext = async () => {
  if (!title || !selectedDesign || loading) return;

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
       mainColor: selectedColor,
      },
     })
    ).unwrap();

    navigate("/personalInfo");
    return;
   }

   // 👉 CAS 2 : premier passage → CREATE
   const action = await dispatch(
    createResume({
     token,
     title,
     template: selectedDesign,
     mainColor: selectedColor,
    })
   );

   if (createResume.fulfilled.match(action)) {
    const resume = action.payload;
    localStorage.setItem("resumeId", resume.id);
    navigate("/personalInfo");
   } else {
    console.error("Création du CV échouée :", action);
   }
  } catch (error) {
   console.error("Erreur handleNext :", error);
  }
 };

 return (
  <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
   {/* Actions fixes */}
   <Logout />
   <GoBack itemsToRemove={["resumeId"]} />

   <GlowBackground />

   <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
    {/* Carte */}
    <div
     className="flex flex-col w-full max-w-6xl
                   min-h-[85vh] max-h-[90vh]
                   overflow-y-auto scrollbar-none
                   p-6 sm:p-8 md:p-10
                   rounded-3xl
                   bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80
                   backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
    >
     <Header
      step="Étape 1 · Personnalisation"
      title="Personnalise ton CV"
      description="Donne un titre à ton CV puis choisis un design."
     />

     {/* Titre du CV */}
     <div className="mt-8 max-w-xl mx-auto w-full">
      <label className="block text-sm text-gray-300 mb-3">Titre du CV</label>
      <input
       type="text"
       value={title}
       onChange={(e) => setTitle(e.target.value)}
       placeholder="Ex : Développeur Full Stack"
       className="w-full rounded-xl bg-white/5 border border-white/10
                       text-white px-4 py-3 focus:border-emerald-500 outline-none"
      />
     </div>

     {/* Sélection du design */}
     <div className="mt-10">
      <h3 className="text-lg font-semibold text-emerald-300 text-center mb-6">
       Choisis un design
      </h3>

      {/* Zone scrollable */}
      <div className="max-h-[30vh] overflow-y-auto scrollbar-none px-2">
       <div className="grid grid-cols-4 gap-6">
        {designs.map((design) => (
         <button
          key={design.id}
          onClick={() => setSelectedDesign(design.key)}
          className={`relative rounded-xl overflow-hidden transition-all duration-200
    ${
     selectedDesign === design.key
      ? "ring-2 ring-inset ring-emerald-500 bg-emerald-500/10"
      : "border border-white/10 hover:border-emerald-400"
    }`}
         >
          <div className="h-[140px] bg-black/20 flex items-center justify-center">
           <img
            src={design.image}
            alt=""
            className="max-w-full max-h-full object-contain"
           />
          </div>

          {selectedDesign === design.key && (
           <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
            <span className="bg-black/50 px-3 py-1 rounded-full text-sm font-semibold text-white">
             Sélectionné
            </span>
           </div>
          )}
         </button>
        ))}
       </div>
      </div>
     </div>

     <FormSeparator />

     {/* Sélection de la couleur */}
     <div className="mt-6">
      <h3 className="text-lg font-semibold text-emerald-300 text-center mb-4">
       Couleur principale du CV
      </h3>

      <div className="flex justify-center gap-4 flex-wrap">
       {colors.map((color) => (
        <button
         key={color.value}
         type="button"
         onClick={() => setSelectedColor(color.value)}
         className={`w-10 h-10 rounded-full transition ring-offset-2 ring-offset-dark_bg_2
          ${
           selectedColor === color.value
            ? "ring-4 ring-white scale-110"
            : "ring-2 ring-white/20 hover:scale-105"
          }`}
         style={{ backgroundColor: color.value }}
         title={color.name}
        />
       ))}
      </div>
     </div>

     {/* Footer */}
     <div className="pt-8 flex justify-end">
      <Footer
       onClick={handleNext}
       disabled={!title || !selectedDesign || loading}
       loading={loading}
      />
     </div>
    </div>
   </div>
  </div>
 );
}
