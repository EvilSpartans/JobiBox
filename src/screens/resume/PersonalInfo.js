import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CONTRACTS } from "../../utils/IAResume";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";
import Input from "../../components/resume/Input";
import Footer from "../../components/resume/Footer";
import Header from "../../components/resume/Header";
import { getResume, updateResume } from "../../store/slices/resumeSlice";

export default function PersonalInfo() {
 const user = useSelector((state) => state.user.user);
 const { status } = useSelector((state) => state.resume);
 const loading = status === "loading";
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const { resume } = useSelector((state) => state.resume);
 const contracts = CONTRACTS;

 const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  contractType: [],
  alternanceDuration: "",
  alternanceStartDate: "",
 });

 useEffect(() => {
  if (!user) return;

  setForm((prev) => ({
   ...prev,
   firstName: user.firstname || "",
   lastName: user.lastname || "",
   email: user.email || "",
   phone: user.phone || "",
   address: user.address || "",
   website: user.website || "",
  }));
 }, [user]);

 useEffect(() => {
  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId || !user?.token) return;

  console.log("📡 Fetch resume avec id :", resumeId);

  dispatch(
   getResume({
    token: user.token,
    id: resumeId,
   })
  );
 }, [dispatch, user]);

 useEffect(() => {
  if (!resume) return;

  setForm((prev) => ({
   ...prev,
   firstName: resume.personalInfo?.firstName || prev.firstName,
   lastName: resume.personalInfo?.lastName || prev.lastName,
   email: resume.personalInfo?.email || prev.email,
   phone: resume.personalInfo?.phone || prev.phone,
   address: resume.personalInfo?.address || prev.address,
   website: resume.personalInfo?.website || prev.website,
   contractType: resume.contractType || prev.contractType,
   alternanceDuration: resume.alternanceDuration || prev.alternanceDuration,
   alternanceStartDate: resume.alternanceStartDate || prev.alternanceStartDate,
  }));
 }, [resume]);

 const toggleContract = (type) => {
  setForm((prev) => ({
   ...prev,
   contractType: prev.contractType.includes(type)
    ? prev.contractType.filter((c) => c !== type)
    : [...prev.contractType, type],
  }));
 };

 const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
 };

 const isAlternance = form.contractType.includes("Alternance");

 const isFormValid =
  form.firstName.trim() !== "" &&
  form.lastName.trim() !== "" &&
  form.email.trim() !== "" &&
  form.contractType.length > 0;

 const handleNext = async () => {
  if (!isFormValid || loading) return;

  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId) {
   console.error("resumeId introuvable");
   return;
  }

  const payload = {
   // 🔒 on garde TOUT ce qui existe déjà
   title: resume?.title,
   template: resume?.template,
   mainColor: resume?.mainColor,
   languages: resume?.languages || [],
   skills: resume?.skills || [],
   softSkills: resume?.softSkills || [],
   trainings: resume?.trainings || [],
   experiences: resume?.experiences || [],
   presentation: resume?.presentation || "",

   // ✅ on met à jour UNIQUEMENT cette étape
   alternanceDuration: isAlternance ? form.alternanceDuration : "",
   alternanceStartDate: isAlternance ? form.alternanceStartDate : "",
   personalInfo: {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone,
    address: form.address,
    website: form.website,
   },
   contractType: form.contractType,
  };

  try {
   await dispatch(
    updateResume({
     token: user.token,
     id: resumeId,
     payload,
    })
   ).unwrap();

   navigate("/skillsAndLanguages");
  } catch (error) {
   console.error("Erreur update resume :", error);
  }
 };

 return (
  <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
   <Logout />
   <GoBack />

   {/* Glow */}
   <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 blur-3xl pointer-events-none" />
   <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-800/20 blur-3xl pointer-events-none" />

   <div className="relative z-10 h-full flex items-center justify-center px-4">
    <div
     className="flex flex-col w-full max-w-5xl
                     min-h-[85vh] max-h-[90vh]
                     overflow-y-auto scrollbar-none
                     p-6 sm:p-8 md:p-10
                     rounded-3xl
                     bg-gradient-to-br from-dark_bg_2/80 to-dark_bg_1/80
                     backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
    >
     <Header
      step=" Étape 2 · Informations personnelles"
      title="Parle-nous de toi"
      description="Ces informations apparaîtront sur ton CV papier."
     />

     {/* FORM */}
     <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
       label="Nom *"
       name="lastName"
       value={form.lastName}
       onChange={handleChange}
       placeholder="Ex : Dupont"
       required
      />

      <Input
       label="Prénom *"
       name="firstName"
       value={form.firstName}
       onChange={handleChange}
       placeholder="Ex : Alex"
       required
      />

      <Input
       label="Email *"
       name="email"
       type="email"
       value={form.email}
       onChange={handleChange}
       placeholder="Ex. : prenom.nom@email.com"
       required
      />

      <Input
       label="Téléphone"
       name="phone"
       value={form.phone}
       onChange={handleChange}
       placeholder="Ex. : 06 XX XX XX XX"
      />

      <Input
       label="Adresse"
       name="address"
       value={form.address}
       onChange={handleChange}
       placeholder="Ville, code postal"
       full
      />

      <Input
       label="Site web (facultatif)"
       name="website"
       value={form.website}
       onChange={handleChange}
       placeholder="https://linkedin.com/in/..."
       full
      />
     </div>

     {/* Contrats */}
     <div className="mt-12">
      <h3 className="text-lg font-semibold text-emerald-300 mb-4">
       Type de contrat recherché *
      </h3>

      <div className="flex flex-wrap gap-3">
       {contracts.map((c) => (
        <button
         key={c}
         type="button"
         onClick={() => toggleContract(c)}
         className={`px-4 py-2 rounded-full border text-sm transition
                    ${
                     form.contractType.includes(c)
                      ? "bg-emerald-600/20 border-emerald-500 text-white"
                      : "border-white/10 text-gray-300 hover:border-emerald-400"
                    }`}
        >
         {c}
        </button>
       ))}
      </div>
     </div>

     {/* Alternance */}
     {isAlternance && (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
       <Input
        label="Durée de l’alternance"
        name="alternanceDuration"
        value={form.alternanceDuration}
        onChange={handleChange}
        placeholder="Ex : 1 an"
       />

       <Input
        label="Date de début"
        name="alternanceStartDate"
        type="date"
        value={form.alternanceStartDate}
        onChange={handleChange}
       />
      </div>
     )}

     {/* Footer */}
     <div className="pt-10 flex justify-end">
      <Footer
       onClick={handleNext}
       disabled={!isFormValid || loading}
       loading={loading}
      />
     </div>
    </div>
   </div>
  </div>
 );
}
