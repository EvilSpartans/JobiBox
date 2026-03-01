import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Input from "../../components/resume/Input";
import ResumeHeader from "../../components/resume/ResumeHeader";
import Footer from "../../components/resume/Footer";
import CVStepper from "../../components/resume/Stepper";
import FormSeparator from "../../components/resume/FormSeparator";
import { CONTRACTS, CV_STEPS_STEPPER, DRIVING_LICENSES } from "../../utils/IAResume";
import GlowBackground from "../../components/resume/GlowBackground";
import { getResume, updateResume } from "../../store/slices/resumeSlice";

export default function PersonalInfo() {
 const { t } = useTranslation();
 const user = useSelector((state) => state.user.user);
 const { status } = useSelector((state) => state.resume);
 const loading = status === "loading";
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const { resume } = useSelector((state) => state.resume);
 const contracts = CONTRACTS;
 const currentStep = 2;
 const completedSteps = [1]; 

 const [form, setForm] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  age: "",
  contractType: [],
  drivingLicenses: [],
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

  dispatch(
   getResume({
    token: user.token,
    id: resumeId,
   }),
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
   age: resume.age ?? prev.age,
   contractType: resume.contractType || prev.contractType,
   drivingLicenses: resume.drivingLicenses || prev.drivingLicenses,
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

 const toggleLicense = (license) => {
  setForm((prev) => ({
   ...prev,
   drivingLicenses: prev.drivingLicenses.includes(license)
    ? prev.drivingLicenses.filter((l) => l !== license)
    : [...prev.drivingLicenses, license],
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

 const handleNavigate = async (step, direction) => {
  if (direction === "backward") {
   navigate(step.path);
   return;
  }

  await saveAndNavigate(step.path);
 };

 const handleNext = async () => {
  const nextStep = CV_STEPS_STEPPER.find((s) => s.id === currentStep + 1);
  if (nextStep) {
   await saveAndNavigate(nextStep.path);
  }
 };

 const saveAndNavigate = async (path) => {
  if (!isFormValid || loading) return;

  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId) {
   console.error("resumeId introuvable");
   return;
  }

  const payload = {
   title: resume?.title,
   template: resume?.template,
   mainColor: resume?.mainColor,
   interests: resume?.interests || [],
   socialNetworks: resume?.socialNetworks || [],
   drivingLicenses: resume?.drivingLicenses || [],
   languages: resume?.languages || [],
   skills: resume?.skills || [],
   softSkills: resume?.softSkills || [],
   trainings: resume?.trainings || [],
   experiences: resume?.experiences || [],
   presentation: resume?.presentation || "",
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
   age: form.age ? parseInt(form.age, 10) : undefined,
   contractType: form.contractType,
   drivingLicenses: form.drivingLicenses,
  };

  try {
   await dispatch(
    updateResume({
     token: user.token,
     id: resumeId,
     payload,
    }),
   ).unwrap();

   navigate(path);
  } catch (error) {
   console.error("Erreur update resume :", error);
  }
 };

 return (
  <div className="relative h-screen dark:bg-dark_bg_1 overflow-hidden">
   <ResumeHeader />

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
      disabled={!isFormValid}
      loading={loading}
      onNavigate={handleNavigate}
     />

     <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
       label={t("resume.personalInfo.lastName")}
       name="lastName"
       value={form.lastName}
       onChange={handleChange}
       placeholder="Ex : Dupont"
       required
      />

      <Input
       label={t("resume.personalInfo.firstName")}
       name="firstName"
       value={form.firstName}
       onChange={handleChange}
       placeholder="Ex : Alex"
       required
      />

      <Input
       label={t("resume.personalInfo.email")}
       name="email"
       type="email"
       value={form.email}
       onChange={handleChange}
       placeholder="Ex. : prenom.nom@email.com"
       required
      />

      <Input
       label={t("resume.personalInfo.phone")}
       name="phone"
       value={form.phone}
       onChange={handleChange}
       placeholder="Ex. : 06 XX XX XX XX"
      />

      <Input
       label={t("resume.personalInfo.address")}
       name="address"
       value={form.address}
       onChange={handleChange}
       placeholder="Ville, code postal"
       full
      />

      <Input
       label={t("resume.personalInfo.website")}
       name="website"
       value={form.website}
       onChange={handleChange}
       placeholder="https://linkedin.com/in/..."
      />

      <Input
       label={t("resume.personalInfo.age")}
       name="age"
       type="number"
       value={form.age}
       onChange={handleChange}
       placeholder="Ex : 25"
      />
     </div>

     <div className="mt-12">
      <h3 className="text-lg font-semibold text-emerald-300 mb-4">
       {t("resume.personalInfo.licenses")}
      </h3>
      <div className="flex flex-wrap gap-3">
       {DRIVING_LICENSES.map((license) => (
        <button
         key={license}
         type="button"
         onClick={() => toggleLicense(license)}
         className={`px-4 py-2 rounded-full border text-sm transition
                    ${
                     form.drivingLicenses.includes(license)
                      ? "bg-emerald-600/20 border-emerald-500 text-white"
                      : "border-white/10 text-gray-300 hover:border-emerald-400"
                    }`}
        >
         {license}
        </button>
       ))}
      </div>
     </div>

     <FormSeparator compact />

     <div className="mt-8">
      <h3 className="text-lg font-semibold text-emerald-300 mb-4">
       {t("resume.personalInfo.contractType")}
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

     {isAlternance && (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
       <Input
        label={t("resume.personalInfo.alternanceDuration")}
        name="alternanceDuration"
        value={form.alternanceDuration}
        onChange={handleChange}
        placeholder="Ex : 1 an"
       />

       <Input
        label={t("resume.personalInfo.alternanceStartDate")}
        name="alternanceStartDate"
        type="date"
        value={form.alternanceStartDate}
        onChange={handleChange}
       />
      </div>
     )}

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