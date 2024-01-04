import React from "react";
import PortalForm from "../components/forms/PortalForm";
import GoBack from "../components/GoBack";

export default function Portal() {

  return (
  <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
    <GoBack itemToRemove={"businessId"} />
    {/*Container*/}
    <div className="flex w-full mx-auto h-full">
      {/*Form */}
      <PortalForm />
    </div>
  </div>
  );
}
