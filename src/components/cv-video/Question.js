import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuestions } from "../../store/slices/questionSlice";
import { getGroupQuestions } from "../../store/slices/groupQuestionSlice";
import PulseLoader from "react-spinners/PulseLoader";
import ModalQuestion from "../modals/ModalQuestion";
import { useNavigate } from "react-router-dom";
import Select from "../fields/Select";

export default function Question() {
 const user = useSelector((state) => state.user.user);
 const { token } = user;
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const [questions, setQuestions] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [questionOrder, setQuestionOrder] = useState([]);

 const [groups, setGroups] = useState([]);
 const [selectedGroupId, setSelectedGroupId] = useState(null);
 const [selectedQuestionsByGroup, setSelectedQuestionsByGroup] = useState({});

 useEffect(() => {
  const fetchGroups = async () => {
   const res = await dispatch(getGroupQuestions({ token }));
   const items = res.payload.items || [];
   setGroups(items);
   if (items.length > 0) {
    setSelectedGroupId(items[0].id);
   }
  };
  fetchGroups();
 }, [dispatch, token]);

 useEffect(() => {
  if (!selectedGroupId) return;

  // Reset when change group
  setQuestionOrder([]);
  setSelectedQuestionsByGroup((prev) => ({
   ...prev,
   [selectedGroupId]: [],
  }));

  fetchQuestions(selectedGroupId);
 }, [selectedGroupId]);

 const fetchQuestions = async (groupId) => {
  try {
   setLoading(true);
   const response = await dispatch(
    getQuestions({ token, groupQuestionId: groupId })
   );
   if (groupId !== selectedGroupId) return;
   const payload = response.payload.items || [];
   setQuestions(payload);
  } catch (error) {
   console.error("Erreur lors de la récupération des questions :", error);
  } finally {
   setLoading(false);
  }
 };

 const openModal = () => {
  setIsModalOpen(true);
 };

 const closeModal = () => {
  setIsModalOpen(false);
 };

 //Handle question selection
 const handleQuestionSelection = (question) => {
  setSelectedQuestionsByGroup((prev) => {
   const currentSelected = prev[selectedGroupId] || [];
   let newSelected;
   let newOrder = [...questionOrder];

   if (currentSelected.includes(question)) {
    newSelected = currentSelected.filter((q) => q !== question);
    newOrder = newOrder.filter((q) => q !== question);
   } else {
    newSelected = [...currentSelected, question];
    newOrder = [...newOrder, question];
   }

   setQuestionOrder(newOrder);

   return {
    ...prev,
    [selectedGroupId]: newSelected,
   };
  });
 };

 // Determine the selected questions based on the current tab
 const selectedQuestions = selectedQuestionsByGroup[selectedGroupId] || [];

 // Save to localStorage
 const handleContinueClick = () => {
  const allSelectedQuestions = Object.values(selectedQuestionsByGroup).flat();
  const existingSelectedQuestions = localStorage.getItem("selectedQuestions");
  if (existingSelectedQuestions) {
   localStorage.removeItem("selectedQuestions");
   localStorage.removeItem("questionOrder");
  }
  localStorage.setItem(
   "selectedQuestions",
   JSON.stringify(allSelectedQuestions)
  );
  localStorage.setItem("questionOrder", JSON.stringify(questionOrder));
  navigate("/themes");
 };

 return (
  <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
   {/* Heading */}
   <div className="text-center dark:text-dark_text_1">
    <h2 className="text-4xl font-bold">Liste des questions</h2>
    <p className="mt-6 text-xl">
     Tu vas pouvoir <span className="text-blue-400">sélectionner</span> les
     questions auxquelles tu vas répondre (entre 2 et 4 maximum) dans un format
     de type question / réponse en vidéo. Si tu le souhaites, tu pourras
     également <span className="text-blue-400">créer</span> des questions afin
     de personnaliser ton CV vidéo du mieux possible.
    </p>
   </div>
   <div className="dark:text-dark_text_1">
    <div className="flex justify-center text-xl">
     <Select
      name="groupSelect"
      // placeholder="Sélectionner un groupe"
      register={() => ({
       onChange: (e) => setSelectedGroupId(Number(e.target.value)),
      })}
      options={groups.map((group) => ({
       value: group.id,
       label: group.title,
      }))}
      value={selectedGroupId || ""}
      className="mb-4"
      error={null}
     />
    </div>

    <div className="mb-2">
     {loading ? null : (
      <div className="mb-4">
       <button
        onClick={openModal}
        className="text-lg addButton bg-gray-200 hover-bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
       >
        + Ajouter une question
       </button>
      </div>
     )}
    </div>

    {loading ? (
     <div className="text-center">
      <PulseLoader color="#fff" size={16} />
     </div>
    ) : (
     <>
      {questions && questions.length > 0 ? (
       <div className="max-h-56 tall:max-h-96 overflow-y-auto">
        {questions.map((question, index) => (
         <div key={question.id} className="mb-5 flex items-center">
          <label className="inline-flex items-center">
           <input
            type="checkbox"
            className="form-checkbox text-primary border-primary"
            onChange={() => handleQuestionSelection(question)}
            checked={selectedQuestions.includes(question)}
           />
           <span className="ml-2 text-xl">&nbsp;{question.title}</span>
          </label>
          {questionOrder.includes(question) && (
           <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
            {questionOrder.indexOf(question) + 1}
           </span>
          )}
         </div>
        ))}
       </div>
      ) : (
       <p className="text-center text-xl mt-4">
        Aucune question pour le moment
       </p>
      )}
     </>
    )}

    <ModalQuestion
     isOpen={isModalOpen}
     onClose={closeModal}
     fetchQuestions={fetchQuestions}
     selectedGroupId={selectedGroupId}
     setSelectedQuestionsByGroup={setSelectedQuestionsByGroup}
    />
   </div>
   <button
    className={`text-xl w-full flex justify-center bg-blue_3 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none hover-bg-blue_4 shadow-lg cursor-pointer transition ease-in duration-300 ${
     selectedQuestions.length === 0 ? "opacity-50 pointer-events-none" : ""
    }`}
    onClick={handleContinueClick}
    disabled={selectedQuestions.length === 0}
   >
    Continuer
   </button>
  </div>
 );
}
