import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addCandidacy } from "../../store/slices/userSlice";
import defaultOfferLogo from "../../../assets/images/jobissim.png";

const richTextClass =
  "offer-rich-text text-[15px] text-neutral-700 leading-relaxed max-w-none [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_ul]:pl-5 [&_ol]:pl-5 [&_ul]:list-disc [&_ol]:list-decimal [&_strong]:font-semibold [&_b]:font-semibold [&_em]:italic [&_br]:block [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1 [&_a]:pointer-events-none [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2";

const lightbulbIcon = (
  <svg
    className="w-7 h-7 text-amber-600"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.75}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

function offerPostingLabelFr(postingDate) {
  if (!postingDate) return "";
  const d = new Date(postingDate);
  if (Number.isNaN(d.getTime())) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const post = new Date(d);
  post.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - post) / 86400000);
  if (diffDays < 0) return "Publié récemment";
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  return `Il y a ${diffDays} jours`;
}

function looksLikeHtml(s) {
  if (!s || typeof s !== "string") return false;
  return /<[a-z][\s\S]*>/i.test(s.trim());
}

function sanitizeOfferHtml(raw) {
  if (raw == null || raw === "") return "";
  const str = String(raw);
  if (!looksLikeHtml(str)) return str;
  try {
    const doc = new DOMParser().parseFromString(str, "text/html");
    doc.querySelectorAll("script,iframe,object,embed,form").forEach((el) => {
      el.remove();
    });
    doc.querySelectorAll("a").forEach((a) => {
      a.removeAttribute("href");
      a.removeAttribute("target");
    });
    return doc.body.innerHTML;
  } catch {
    return str;
  }
}

function HeaderChip({ label, value, tint }) {
  if (value == null || String(value).trim() === "") return null;
  return (
    <div
      className={`flex flex-col gap-0.5 min-w-0 py-2.5 px-3 rounded-lg border bg-white shadow-sm ${tint}`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <span className="text-sm font-semibold text-neutral-900 leading-snug line-clamp-4">
        {value}
      </span>
    </div>
  );
}

/** Bloc texte riche toujours visible (pas d’accordéon). */
function StaticRichSection({ title, content, barClass, headerBgClass }) {
  const html = useMemo(
    () => (content != null ? sanitizeOfferHtml(String(content)) : ""),
    [content],
  );
  if (!html || html.trim() === "") return null;
  const isHtml = looksLikeHtml(String(content));

  return (
    <section className="rounded-xl border-2 border-neutral-200/90 bg-white shadow-md overflow-hidden">
      <div
        className={`flex items-stretch min-h-[3rem] border-b border-neutral-200/80 ${headerBgClass}`}
      >
        <div className={`w-1.5 shrink-0 ${barClass}`} aria-hidden />
        <h3 className="text-base sm:text-lg font-bold text-neutral-900 py-3 px-4 sm:px-5 tracking-tight flex items-center">
          {title}
        </h3>
      </div>
      <div className="px-5 py-5 sm:px-6 sm:py-6 bg-white">
        {isHtml ? (
          <div
            className={richTextClass}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-[15px] text-neutral-700 whitespace-pre-wrap leading-relaxed">
            {html}
          </p>
        )}
      </div>
    </section>
  );
}

export default function ModalOffer({ offer, onClose, videos, user }) {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [favoriteId, setFavoriteId] = useState(null);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const dispatch = useDispatch();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const hasExternalUrl =
    offer?.url != null && String(offer.url).trim() !== "";
  const hasRecruiterEmail =
    offer?.email != null && String(offer.email).trim() !== "";
  const canPostulateOnJobibox = hasRecruiterEmail && !hasExternalUrl;

  useEffect(() => {
    setShowSelect(false);
    setSelectedVideo("");
    setFavoriteId(null);
  }, [offer?.id]);

  useEffect(() => {
    if (!offer?.id || !user?.token || !user?.id) {
      setFavoriteId(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/favorites`, {
          params: { offerId: offer.id, userId: user.id },
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const items = Array.isArray(data?.items) ? data.items : [];
        if (!cancelled) {
          setFavoriteId(items.length > 0 ? items[0].id : null);
        }
      } catch {
        if (!cancelled) setFavoriteId(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [offer?.id, user?.id, user?.token, BASE_URL]);

  const handleApply = async () => {
    setShowSelect(true);
  };

  const handleCancel = () => {
    setShowSelect(false);
    setSelectedVideo("");
  };

  const handleValidate = () => {
    createCandidacy();
  };

  const createCandidacy = async () => {
    if (!canPostulateOnJobibox) return;
    try {
      const formData = new FormData();
      formData.append("type", "offer");
      formData.append("offerId", offer.id);
      formData.append("cv", selectedVideo);

      await axios.post(`${BASE_URL}/candidacy/create`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(addCandidacy(offer.id));
      setShowSelect(false);
      setSelectedVideo("");
      onClose();
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la candidature :", error);
    }
  };

  const addFavorite = async () => {
    if (!user?.token || favoriteBusy) return;
    setFavoriteBusy(true);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/favorite/create`,
        { offerId: offer.id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (data?.id != null) setFavoriteId(data.id);
    } catch (error) {
      console.error("Erreur ajout favori :", error);
    } finally {
      setFavoriteBusy(false);
    }
  };

  const removeFavorite = async () => {
    if (favoriteId == null || !user?.token || favoriteBusy) return;
    setFavoriteBusy(true);
    try {
      await axios.delete(`${BASE_URL}/favorite/${favoriteId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFavoriteId(null);
    } catch (error) {
      console.error("Erreur retrait favori :", error);
    } finally {
      setFavoriteBusy(false);
    }
  };

  if (!offer) return null;

  const hasApplied = user?.offerCandidacyIds?.includes(offer.id);
  const postingLabel = offerPostingLabelFr(offer.postingDate);
  const logoSrc =
    offer.logo && String(offer.logo).trim() !== ""
      ? offer.logo
      : defaultOfferLogo;
  const locationLine = [offer.company, offer.location?.name]
    .filter(Boolean)
    .join(" • ");
  const locationFull = [locationLine, offer.locationCountry]
    .filter(Boolean)
    .join(", ");

  const deadlineStr = offer.expirationDate
    ? new Date(offer.expirationDate).toLocaleDateString("fr-FR")
    : null;

  const renderPostulateSection = () => {
    if (!canPostulateOnJobibox) return null;

    if (showSelect) {
      if (videos.length === 0) {
        return (
          <div className="text-center text-sm text-amber-900 px-4 py-5 rounded-xl bg-amber-50 border-2 border-amber-200 font-medium">
            Créez d&apos;abord un CV vidéo pour postuler à cette offre.
          </div>
        );
      }
      return (
        <div className="space-y-5 w-full max-w-lg mx-auto p-4 rounded-xl bg-sky-50/80 border-2 border-sky-200/80">
          <div>
            <label
              htmlFor="videoSelect"
              className="block mb-2 text-xs font-bold uppercase tracking-wider text-sky-800"
            >
              CV vidéo
            </label>
            <select
              id="videoSelect"
              value={selectedVideo}
              onChange={(e) => setSelectedVideo(e.target.value)}
              className="w-full border-2 border-sky-200 rounded-xl px-3 py-3 text-sm bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue_3/50 focus:border-blue_3"
            >
              <option value="">Sélectionner une vidéo</option>
              {videos.map((video) => (
                <option key={video.id} value={video.video}>
                  {video.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-center gap-3">
            <button
              type="button"
              className="flex-1 border-2 border-neutral-300 text-neutral-800 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors"
              onClick={handleCancel}
            >
              Annuler
            </button>
            <button
              type="button"
              className="flex-1 bg-blue_3 text-white px-4 py-3 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition-all shadow-lg shadow-blue_3/30"
              onClick={handleValidate}
              disabled={!selectedVideo}
            >
              Envoyer la candidature
            </button>
          </div>
        </div>
      );
    }

    if (hasApplied) {
      return (
        <p className="text-center text-sm font-semibold text-emerald-800 py-4 px-4 rounded-xl bg-emerald-50 border-2 border-emerald-200">
          Candidature déjà envoyée pour cette offre.
        </p>
      );
    }

    return (
      <button
        type="button"
        className="w-full max-w-lg mx-auto bg-blue_3 text-white px-6 py-4 rounded-xl text-sm font-bold tracking-tight hover:brightness-105 active:scale-[0.998] transition-all shadow-lg shadow-blue_3/35"
        onClick={handleApply}
      >
        Postuler avec mon CV vidéo
      </button>
    );
  };

  const renderFavoriteSection = () => {
    if (canPostulateOnJobibox) return null;

    return (
      <div className="w-full max-w-3xl mx-auto rounded-2xl border-2 border-amber-200 bg-amber-50/60 shadow-sm overflow-hidden">
        <div className="flex gap-4 p-5 sm:p-6">
          <div
            className="shrink-0 w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center"
            aria-hidden
          >
            {lightbulbIcon}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-base font-extrabold text-amber-950 tracking-tight">
              Bon à savoir
            </p>
            <p className="text-sm sm:text-[15px] text-neutral-800 leading-relaxed">
              La candidature immédiate sur la borne n&apos;est possible que lorsque
              l&apos;offre prévoit un contact direct par e-mail, sans passage par un
              site partenaire.{" "}
              <span className="font-semibold text-neutral-900">
                Pour celle-ci, enregistrez-la en favoris
              </span>{" "}
              : vous la retrouverez sur votre tableau de bord Jobissim pour
              postuler ou la suivre après votre session sur la borne.
            </p>
          </div>
        </div>
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 border-t border-amber-200/70 bg-white/50 flex justify-center">
          {favoriteId != null ? (
            <button
              type="button"
              className="w-full max-w-2xl border-2 border-neutral-400 text-neutral-800 px-6 py-3.5 rounded-xl text-sm font-bold bg-white hover:bg-neutral-50 transition-colors disabled:opacity-50 shadow-sm"
              onClick={removeFavorite}
              disabled={favoriteBusy}
            >
              Retirer des favoris
            </button>
          ) : (
            <button
              type="button"
              className="w-full max-w-2xl bg-blue_3 text-white px-6 py-3.5 rounded-xl text-sm font-bold hover:brightness-105 transition-all shadow-lg shadow-blue_3/30 disabled:opacity-40 disabled:cursor-not-allowed active:brightness-95"
              onClick={addFavorite}
              disabled={favoriteBusy || !user?.token}
            >
              Enregistrer dans mes favoris
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4">
      <div
        className="modal absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-detail-title"
        className="relative z-10 flex flex-col w-full max-w-4xl max-h-[94vh] bg-white rounded-2xl shadow-2xl overflow-hidden text-left border-2 border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1.5 w-full bg-gradient-to-r from-blue_3 via-fuchsia-400 to-sky-400 shrink-0"
          aria-hidden
        />

        <div className="shrink-0 relative bg-gradient-to-b from-sky-50/90 to-white border-b-2 border-sky-100 px-5 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-7">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border-2 border-blue_3 bg-blue_3 text-white text-2xl font-light leading-none shadow-md active:brightness-95 transition-transform"
            aria-label="Fermer"
          >
            ×
          </button>

          <div className="relative flex flex-col lg:flex-row lg:items-start gap-6 pr-8 sm:pr-12">
            <div className="shrink-0 mx-auto lg:mx-0">
              <div className="rounded-2xl bg-white p-4 border-4 border-blue_3/35 shadow-lg ring-2 ring-sky-100">
                <img
                  src={logoSrc}
                  alt=""
                  className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 text-center lg:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="inline-flex items-center rounded-full bg-blue_3 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Offre d&apos;emploi
                </span>
                {postingLabel ? (
                  <span className="inline-flex items-center rounded-full bg-neutral-200 px-3 py-1 text-[11px] font-bold text-neutral-800">
                    {postingLabel}
                  </span>
                ) : null}
                {canPostulateOnJobibox ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                    Candidature borne
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
                    Favoris Jobissim
                  </span>
                )}
              </div>

              <h2
                id="offer-detail-title"
                className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight tracking-tight"
              >
                {offer.title}
              </h2>
              {offer.company ? (
                <p className="text-lg font-bold text-blue_3">
                  {offer.company}
                </p>
              ) : null}
              {locationFull ? (
                <p className="text-sm font-semibold text-neutral-600 flex items-center justify-center lg:justify-start gap-1.5">
                  <span className="text-sky-500" aria-hidden>
                    ●
                  </span>
                  {locationFull}
                </p>
              ) : null}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2">
                <HeaderChip
                  label="Contrat"
                  value={offer.contract}
                  tint="border-l-4 border-l-blue_3 border-neutral-200"
                />
                <HeaderChip
                  label="Salaire"
                  value={offer.salary}
                  tint="border-l-4 border-l-emerald-500 border-neutral-200"
                />
                <HeaderChip
                  label="Domaine"
                  value={offer.jobFunction}
                  tint="border-l-4 border-l-violet-500 border-neutral-200"
                />
                <HeaderChip
                  label="Expérience"
                  value={offer.applicantExperience}
                  tint="border-l-4 border-l-orange-500 border-neutral-200"
                />
                <HeaderChip
                  label="Date limite"
                  value={deadlineStr}
                  tint="border-l-4 border-l-rose-500 border-neutral-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7 space-y-6 bg-neutral-100/90">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue_3/50 to-transparent" />
            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-blue_3 whitespace-nowrap">
              Contenu de l&apos;annonce
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue_3/50 to-transparent" />
          </div>

          <StaticRichSection
            title="Description du poste"
            content={offer.description}
            barClass="bg-blue_3"
            headerBgClass="bg-sky-50"
          />
          <StaticRichSection
            title="Profil recherché"
            content={offer.applicantProfile}
            barClass="bg-emerald-500"
            headerBgClass="bg-emerald-50"
          />
          <StaticRichSection
            title={"L'entreprise"}
            content={offer.companyDescription}
            barClass="bg-violet-500"
            headerBgClass="bg-violet-50"
          />
        </div>

        <div className="shrink-0 border-t-2 border-sky-200 bg-gradient-to-r from-white via-sky-50/50 to-white px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col items-stretch gap-5">
            {renderPostulateSection()}
            {renderFavoriteSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
