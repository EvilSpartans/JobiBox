import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookForm/resolvers/yup";
import { businessSchema } from "../../utils/Validation";
import PulseLoader from "react-spinners/PulseLoader";
import { getJobibox } from "../../store/slices/jobiboxSlice";

export default function JobiboxForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.jobibox);
  const [jobiboxData, setJobiboxData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedJobibox, setSelectedJobibox] = useState(null);
  const searchInputRef = useRef(null);
  const blurTimerRef = useRef(null);
  const fetchGenerationRef = useRef(0);

  const loadSuggestions = async (search) => {
    const generation = ++fetchGenerationRef.current;
    const response = await dispatch(
      getJobibox({ page: 1, limit: 10, search })
    );
    if (generation !== fetchGenerationRef.current) return;
    if (response.meta?.requestStatus !== "fulfilled") return;
    const payload = response.payload;
    if (payload?.items) {
      setJobiboxData(payload.items);
    }
  };

  useEffect(() => {
    if (!isEditing) return;
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, isEditing]);

  useEffect(() => {
    if (!isEditing) return;
    loadSuggestions(debouncedSearch);
  }, [debouncedSearch, isEditing]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(businessSchema),
  });

  const openEditor = () => {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
    setIsEditing(true);
    setSearchInput("");
    setDebouncedSearch("");
    setJobiboxData([]);
    loadSuggestions("");
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    });
  };

  const closeEditor = () => {
    fetchGenerationRef.current += 1;
    setIsEditing(false);
    setSearchInput("");
    setDebouncedSearch("");
    setJobiboxData([]);
  };

  const handleInputBlur = () => {
    blurTimerRef.current = setTimeout(() => {
      closeEditor();
    }, 200);
  };

  const selectJobibox = (jobibox) => {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
    setSelectedId(jobibox.id);
    setSelectedJobibox(jobibox);
    setValue("business", String(jobibox.id), { shouldValidate: true });
    fetchGenerationRef.current += 1;
    setIsEditing(false);
    setSearchInput("");
    setDebouncedSearch("");
    setJobiboxData([]);
  };

  const onSubmit = async (data) => {
    if (
      !selectedJobibox ||
      selectedJobibox.id !== parseInt(data.business, 10)
    ) {
      console.error("Erreur : Impossible de trouver la jobibox sélectionnée.");
      return;
    }
    localStorage.setItem("businessId", selectedJobibox.business.id);
    localStorage.setItem("jobiboxId", selectedJobibox.id);
    localStorage.setItem("trainingActivated", selectedJobibox.training);
    navigate("/welcome");
  };

  const displayLabel =
    selectedJobibox?.business?.title ?? "Choisir un organisme";

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-y-auto">
      <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-4xl font-bold">Configuration</h2>
          <p className="mt-6 text-xl">
            Connexion à la page <span className="text-blue-400">entreprise.</span>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <input type="hidden" {...register("business")} />

          <div className="dark:text-dark_text_1 space-y-2 relative">
            <p className="text-base font-bold tracking-wide">Organisme</p>
            {!isEditing ? (
              <button
                type="button"
                onClick={openEditor}
                className={`w-full text-left text-xl py-4 px-4 rounded-lg dark:bg-dark_bg_3 outline-none ${
                  selectedJobibox
                    ? "dark:text-dark_text_1"
                    : "dark:text-dark_text_2"
                }`}
              >
                {displayLabel}
              </button>
            ) : (
              <>
                <input
                  ref={searchInputRef}
                  id="organisme-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onBlur={handleInputBlur}
                  onFocus={() => {
                    searchInputRef.current?.scrollIntoView({
                      block: "start",
                      behavior: "smooth",
                    });
                  }}
                  placeholder="Rechercher un organisme"
                  className="w-full dark:bg-dark_bg_3 text-xl py-4 px-4 rounded-lg outline-none"
                  autoComplete="off"
                />
                <ul className="absolute z-10 left-0 right-0 mt-1 max-h-64 tall:max-h-96 overflow-y-auto space-y-2 rounded-lg dark:bg-dark_bg_2 shadow-lg">
                  {status === "loading" && jobiboxData.length === 0 ? (
                    <li className="flex justify-center py-6">
                      <PulseLoader color="#60a5fa" size={12} />
                    </li>
                  ) : jobiboxData.length === 0 ? (
                    <li className="text-center text-lg py-4 dark:text-dark_text_2">
                      Aucun organisme trouvé
                    </li>
                  ) : (
                    jobiboxData.map((jobibox) => (
                      <li key={jobibox.id}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectJobibox(jobibox)}
                          className={`w-full text-left text-xl py-4 px-4 rounded-lg transition ease-in duration-200 ${
                            selectedId === jobibox.id
                              ? "bg-blue_3 text-gray-100"
                              : "dark:bg-dark_bg_3 hover:bg-dark_bg_3/80"
                          }`}
                        >
                          {jobibox.business.title}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </>
            )}
            {errors?.business?.message && (
              <p className="text-red-400">{errors.business.message}</p>
            )}
          </div>

          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}
          <button
            className="text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide
          font-semibold focus:outline-none hover:bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300
          "
            type="submit"
          >
            {status === "loading" ? (
              <PulseLoader color="#fff" size={16} />
            ) : (
              "Valider"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}