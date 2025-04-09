import React from "react";
import TextStyles from "../../components/cv-video/TextStyles";
import GoBack from "../../components/core/GoBack";
import Logout from "../../components/core/Logout";

export default function TextStyleScreen(): React.JSX.Element {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <Logout />
      <GoBack itemsToRemove={['selectedTheme', 'selectedAnimation']} />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/* */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <TextStyles />
        </div>
      </div>
    </div>
  );
}
