import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Input from "../../components/resume/Input";
import ResumeHeader from "../../components/resume/ResumeHeader";
import Footer from "../../components/resume/Footer";
import CVStepper from "../../components/resume/Stepper";
import AddItemInput from "../../components/resume/AddItemInput";
import RemovableTag from "../../components/resume/RemovableTag";
import GlowBackground from "../../components/resume/GlowBackground";
import FormSeparator from "../../components/resume/FormSeparator";
import { CV_STEPS_STEPPER } from "../../utils/IAResume";
import { getResume, updateResume } from "../../store/slices/resumeSlice";

export default function InterestsAndMore() {
 const { t } = useTranslation();
 const user = useSelector((state) => state.user.user);
 const { resume, status } = useSelector((state) => state.resume);
 const loading = status === "loading";
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const currentStep = 3;
 const completedSteps = [1, 2];

 const [interests, setInterests] = useState([]);
 const [interestInput, setInterestInput] = useState("");
 const [socialNetworks, setSocialNetworks] = useState([]);
 const [platformInput, setPlatformInput] = useState("");
 const [urlInput, setUrlInput] = useState("");
 const [other, setOther] = useState("");
 const [saving, setSaving] = useState(false);

 useEffect(() => {
  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId || !user?.token) return;

  dispatch(getResume({ token: user.token, id: resumeId }));
 }, [dispatch, user]);

 useEffect(() => {
  if (!resume) return;

  if (Array.isArray(resume.interests)) {
   setInterests(resume.interests);
  }
  if (Array.isArray(resume.socialNetworks)) {
   setSocialNetworks(
    resume.socialNetworks.filter((sn) => sn?.platform || sn?.url),
   );
  }
  setOther(resume.other || "");
 }, [resume]);

 const addInterest = (value) => {
  if (interests.includes(value)) return;
  setInterests((prev) => [...prev, value]);
  setInterestInput("");
 };

 const removeInterest = (value) => {
  setInterests((prev) => prev.filter((i) => i !== value));
 };

 const addSocialNetwork = () => {
  const platform = platformInput.trim();
  const url = urlInput.trim();
  if (!platform || !url) return;
  if (socialNetworks.length >= 5) return;
  setSocialNetworks((prev) => [...prev, { platform, url }]);
  setPlatformInput("");
  setUrlInput("");
 };

 const removeSocialNetwork = (index) => {
  setSocialNetworks((prev) => prev.filter((_, i) => i !== index));
 };

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
  if (loading || saving) return;
  if (!resume) return;

  const resumeId = localStorage.getItem("resumeId");
  if (!resumeId) return;

  setSaving(true);
  const payload = {
   title: resume?.title,
   template: resume?.template,
   mainColor: resume?.mainColor,
   personalInfo: resume?.personalInfo,
   contractType: resume?.contractType || [],
   alternanceDuration: resume?.alternanceDuration || "",
   alternanceStartDate: resume?.alternanceStartDate || "",
   languages: resume?.languages || [],
   skills: resume?.skills || [],
   softSkills: resume?.softSkills || [],
   trainings: resume?.trainings || [],
   experiences: resume?.experiences || [],
   presentation: resume?.presentation || "",
   interests,
   socialNetworks: socialNetworks.filter((sn) => sn?.platform || sn?.url),
   drivingLicenses: resume?.drivingLicenses || [],
   other: other.trim() || undefined,
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
  } finally {
   setSaving(false);
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
      loading={loading}
      onNavigate={handleNavigate}
     />

     {/* Centre d'intérêts */}
     <section className="mt-10">
      <h3 className="text-lg font-semibold text-emerald-300 mb-2">
       {t("resume.interests.title")}
      </h3>
      <div className="flex flex-wrap items-center gap-2 mb-4">
       <p className="text-sm text-gray-400">{t("resume.interests.hint")}</p>
       {interests.length >= 5 && (
        <span className="text-sm text-amber-400">{t("resume.interests.maxReached", { max: 5 })}</span>
       )}
      </div>
      <AddItemInput
       value={interestInput}
       onChange={setInterestInput}
       onAdd={addInterest}
       placeholder={t("resume.interests.placeholder")}
       maxItems={5}
       currentCount={interests.length}
       showMaxReachedMessage={false}
      />
      <div className="mt-4 min-h-[72px] rounded-xl bg-white/5 border border-white/10 flex items-center px-4 py-3">
       {interests.length === 0 ? (
        <span className="text-gray-500 text-sm">{t("resume.interests.noInterests")}</span>
       ) : (
        <div className="flex flex-wrap gap-2">
         {interests.map((item) => (
          <RemovableTag
           key={item}
           label={item}
           onRemove={() => removeInterest(item)}
          />
         ))}
        </div>
       )}
      </div>
     </section>

     <FormSeparator compact />

     {/* Réseaux sociaux */}
     <section className="mt-10">
      <h3 className="text-lg font-semibold text-emerald-300 mb-2">
       {t("resume.interests.socialMedia")}
      </h3>
      <div className="flex flex-wrap items-center gap-2 mb-4">
       <p className="text-sm text-gray-400">{t("resume.interests.socialMediaHint")}</p>
       {socialNetworks.length >= 5 && (
        <span className="text-sm text-amber-400">{t("resume.interests.maxReached", { max: 5 })}</span>
       )}
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
       <input
        value={platformInput}
        onChange={(e) => setPlatformInput(e.target.value)}
        placeholder={t("resume.interests.platform")}
        className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        onKeyDown={(e) => e.key === "Enter" && addSocialNetwork()}
       />
       <input
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        placeholder={t("resume.interests.url")}
        type="url"
        className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        onKeyDown={(e) => e.key === "Enter" && addSocialNetwork()}
       />
       <button
        type="button"
        onClick={addSocialNetwork}
        disabled={socialNetworks.length >= 5 || !platformInput.trim() || !urlInput.trim()}
        className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
       >
        {t("resume.interests.validate")}
       </button>
      </div>
      <div className="mt-4 min-h-[72px] rounded-xl bg-white/5 border border-white/10 flex items-center px-4 py-3">
       {socialNetworks.length === 0 ? (
        <span className="text-gray-500 text-sm">{t("resume.interests.noNetworks")}</span>
       ) : (
        <div className="flex flex-wrap gap-2">
         {socialNetworks.map((sn, index) => (
          <RemovableTag
           key={`${sn.platform}-${sn.url}-${index}`}
           label={sn.url ? `${sn.platform || ""} - ${sn.url}`.trim() : sn.platform || ""}
           onRemove={() => removeSocialNetwork(index)}
          />
         ))}
        </div>
       )}
      </div>
     </section>

     <FormSeparator compact />

     {/* Autre */}
     <section className="mt-10">
      <h3 className="text-lg font-semibold text-emerald-300 mb-2">
       {t("resume.interests.other")}
      </h3>
      <Input
       label=""
       name="other"
       value={other}
       onChange={(e) => setOther(e.target.value)}
       placeholder={t("resume.interests.otherPlaceholder")}
       full
      />
     </section>

     <div className="pt-10 flex justify-end">
      <Footer
       onClick={handleNext}
       disabled={loading || saving || !resume}
       loading={loading || saving}
      />
     </div>
    </div>
   </div>
  </div>
 );
}
