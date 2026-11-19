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
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedJobibox, setSelectedJobibox] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchJobibox = async () => {
      try {
        const response = await dispatch(
          getJobibox({ page, limit: 10, search: debouncedSearch })
        );
        const payload = response.payload;
        if (payload?.items) {
          setJobiboxData(payload.items);
          setCountPage(Math.max(1, payload.countPage ?? 1));
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des jobiboxs :", err);
      }
    };
    fetchJobibox();
  }, [dispatch, page, debouncedSearch]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(businessSchema),
  });

  const selectJobibox = (jobibox) => {
    setSelectedId(jobibox.id);
    setSelectedJobibox(jobibox);
    setValue("business", String(jobibox.id), { shouldValidate: true });
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

  const goToPreviousPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const goToNextPage = () => {
    if (page < countPage) setPage((p) => p + 1);
  };

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
          <div className="dark:text-dark_text_1 space-y-1">
            <label
              htmlFor="organisme-search"
              className="text-base font-bold tracking-wide"
            >
              Rechercher un organisme
            </label>
            <input
              ref={searchInputRef}
              id="organisme-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                searchInputRef.current?.scrollIntoView({
                  block: "start",
                  behavior: "smooth",
                });
              }}
              className="w-full dark:bg-dark_bg_3 text-xl py-2 px-4 rounded-lg outline-none"
              autoComplete="off"
            />
          </div>

          <input type="hidden" {...register("business")} />

          <div className="dark:text-dark_text_1 space-y-2">
            <p className="text-base font-bold tracking-wide">Organisme</p>
            <ul className="max-h-64 tall:max-h-96 overflow-y-auto space-y-2 rounded-lg">
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
            {errors?.business?.message && (
              <p className="text-red-400">{errors.business.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={page <= 1 || status === "loading"}
              className="flex-1 text-xl py-4 px-6 rounded-lg font-semibold dark:bg-dark_bg_3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <span className="text-xl font-bold dark:text-dark_text_1 whitespace-nowrap">
              {page} / {countPage}
            </span>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={page >= countPage || status === "loading"}
              className="flex-1 text-xl py-4 px-6 rounded-lg font-semibold dark:bg-dark_bg_3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
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