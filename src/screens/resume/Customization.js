import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";
import PulseLoader from "react-spinners/PulseLoader";

import template1 from "../../../assets/images/resume/template1.png";
import template2 from "../../../assets/images/resume/template2.png";
import template3 from "../../../assets/images/resume/template3.png";
import template4 from "../../../assets/images/resume/template4.png";
import template5 from "../../../assets/images/resume/template5.png";
import template6 from "../../../assets/images/resume/template6.png";
import template7 from "../../../assets/images/resume/template7.png";
import { useDispatch, useSelector } from "react-redux";
import {
  createResume,
  getResume,
  updateResume,
} from "../../store/slices/resumeSlice";

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

  const designs = [
    { key: "template1", image: template1 },
    { key: "template2", image: template2 },
    { key: "template3", image: template3 },
    { key: "template4", image: template4 },
    { key: "template5", image: template5 },
    { key: "template6", image: template6 },
    { key: "template7", image: template7 },
  ];

  const colors = [
    { name: "Émeraude", value: "#10b981" },
    { name: "Bleu", value: "#1e3a8a" },
    { name: "Violet", value: "#6d28d9" },
    { name: "Rouge", value: "#dc2626" },
    { name: "Orange", value: "#ea580c" },
    { name: "Jaune", value: "#facc15" },
    { name: "Noir", value: "#111827" },
  ];

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
  trainings: resume?.trainings || [],
  experiences: resume?.experiences || [],
  presentation: resume?.presentation || "",
  alternanceDuration: resume?.alternanceDuration || "",
  alternanceStartDate: resume?.alternanceStartDate || "",

  // ✏️ on écrase CE QUI CHANGE ICI
  title,
  template: selectedDesign,
  mainColor: selectedColor,
}
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
      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 rounded-full blur-3xl pointer-events-none" />

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
          {/* Header */}
          <div className="text-center space-y-5">
            <span
              className="inline-block px-4 py-1 rounded-full text-sm font-semibold 
                           bg-emerald-900/40 text-emerald-300"
            >
              Étape 1 · Personnalisation
            </span>

            <h2 className="text-4xl font-extrabold text-white">
              Personnalise ton CV
            </h2>

            <p className="text-gray-300 max-w-2xl mx-auto">
              Donne un titre à ton CV puis choisis un design.
            </p>
          </div>

          {/* Titre du CV */}
          <div className="mt-8 max-w-xl mx-auto w-full">
            <label className="block text-sm text-gray-300 mb-3">
              Titre du CV
            </label>
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

          {/* Séparateur stylé */}
          <div className="relative flex items-center justify-center my-10">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="relative z-10 w-4 h-4 rounded-full bg-emerald-500/30 ring-1 ring-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.35)]" />
          </div>

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
            <button
              onClick={handleNext}
              disabled={!title || !selectedDesign || loading}
              className={`px-10 py-4 rounded-full text-lg font-semibold transition flex items-center justify-center
    ${
      title && selectedDesign && !loading
        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl hover:from-emerald-700 hover:to-emerald-800"
        : "bg-white/10 text-gray-500 cursor-not-allowed"
    }`}
            >
              {loading ? <PulseLoader color="#fff" size={12} /> : "Suivant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
