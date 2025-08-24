import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import ModalOffer from "../modals/ModalOffer";
import { useSelector } from "react-redux";
import ModalFilter from "../modals/ModalFilter";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const user = useSelector((state) => state.user.user);
  const { token } = user;
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollContainerRef = useRef(null);

  const [filters, setFilters] = useState({
    title: "",
    company: "",
    contract: "",
    location: "",
    radiusKm: 0,
  });

  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        hasMore &&
        !loadingMore
      ) {
        fetchOffers(page);
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loadingMore]);

  useEffect(() => {
    setOffers([]);
    setPage(1);
    setHasMore(true);
    fetchOffers(1);

    if (user?.id) {
      fetchVideos();
    }
  }, [user?.id]);

  const fetchOffers = async (currentPage = 1, customFilters = filters) => {
    try {
      setLoadingMore(true);

      const { radiusKm, ...rest } = customFilters || {};
      const params = { page: currentPage, ...rest };
      if (customFilters?.location) params.radiusKm = Number(radiusKm) || 0;

      const response = await axios.get(`${BASE_URL}/offers`, { params });

      const newOffers = Array.isArray(response.data.items)
        ? response.data.items
        : [];
      const countPage = response.data?.countPage ?? 1;

      setOffers((prev) => [...prev, ...newOffers]);
      setHasMore(currentPage < countPage);
      setPage(currentPage + 1);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres :", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchVideos = async () => {
    if (!user?.id) return;
    try {
      const { data } = await axios.get(`${BASE_URL}/posts`, {
        params: {
          userId: user.id,
          page: 1,
          limit: 50,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //  console.log("📹 Vidéos récupérées pour l'utilisateur :", data);
      setVideos(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      console.error("Erreur récupération vidéos");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 bg-black bg-opacity-75">
        <div className="text-center">
          <PulseLoader color="#808080" size={16} />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Bouton Filtrer désactivé */}
      <button
        onClick={() => setShowFilterModal(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-gray-700 border border-gray-300 px-5 h-14 rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
        title="Filtrer"
      >
        <span className="text-2xl">🔍</span>
        <span className="text-sm font-medium">Filtrer les offres</span>
      </button>

      {/* Liste des offres */}
      <div
        ref={scrollContainerRef}
        className="flex flex-wrap mt-4 max-h-[350px] tall:max-h-[34rem] gap-4 overflow-y-auto pr-2"
      >
        {offers.length === 0 ? (
          <div className="w-full text-base py-10 text-center text-gray-500 dark:text-neutral-300">
            Aucune offre ne correspond à votre recherche.
          </div>
        ) : (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="w-full sm:w-[48%] md:w-[30%] lg:w-[23%] bg-white dark:bg-dark_bg_1 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md flex flex-col text-sm"
            >
              <div className="relative">
                {offer.logo && (
                  <img
                    src={offer.logo}
                    alt={offer.company}
                    className="w-full h-24 object-contain bg-white p-2 border-b"
                  />
                )}
                <span className="absolute top-2 right-2 text-xs font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm shadow">
                  {offer.contract}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between p-3">
                <div className="text-center space-y-1">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {offer.title}
                  </h2>
                  <p className="text-xs text-gray-600 dark:text-neutral-300">
                    {offer.company} • {offer.location.name},{" "}
                    {offer.locationCountry}
                  </p>
                </div>

                <button
                  className="mt-2 bg-blue_3 hover:bg-pink-500 transition-colors text-white font-medium py-1.5 rounded-lg text-sm"
                  onClick={() => setSelectedOffer(offer)}
                >
                  Voir l'offre
                </button>
              </div>
            </div>
          ))
        )}

        <ModalOffer
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
          videos={videos}
          user={user}
        />

        {showFilterModal && (
          <ModalFilter
            onClose={() => setShowFilterModal(false)}
            onApply={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
              setOffers([]);
              setHasMore(true);
              fetchOffers(1, newFilters);
            }}
            currentFilters={filters}
            baseUrl={BASE_URL}
          />
        )}
      </div>
    </>
  );
}
