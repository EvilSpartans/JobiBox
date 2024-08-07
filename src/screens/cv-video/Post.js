import React from "react";
import PostForm from "../../components/forms/PostForm";
import Logout from "../../components/core/Logout";
import GoBack from "../../components/core/GoBack";

export default function Post() {
  return (
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[39px] tall:p-0 overflow-hidden">
      {/*Container*/}
      <GoBack />
      <Logout />
      <div className="flex w-full mx-auto h-full">
        {/*Form */}
        <PostForm />
      </div>
    </div>
  );
}
