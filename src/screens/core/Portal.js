import React from "react";
import JobiboxForm from "../../components/forms/JobiboxForm";
import GoBack from "../../components/core/GoBack";
import LogoutBtn from "../../components/core/LogoutBtn";

export default function Portal() {

  return (
  <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
    <GoBack itemToRemove={"businessId"} />
    <LogoutBtn />
    {/*Container*/}
    <div className="flex w-full mx-auto h-full">
      {/*Form */}
      <JobiboxForm />
    </div>
  </div>
  );
}
