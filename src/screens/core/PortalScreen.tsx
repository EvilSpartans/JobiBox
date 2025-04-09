import React from "react";
import JobiboxForm from "../../forms/JobiboxForm";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";

export default function PortalScreen(): React.JSX.Element {

  return (
  <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
    <GoBack itemsToRemove={["businessId"]} />
    <Logout />
    {/*Container*/}
    <div className="flex w-full mx-auto h-full">
      {/*Form */}
      <JobiboxForm />
    </div>
  </div>
  );
}
