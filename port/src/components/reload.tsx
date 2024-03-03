import React, { useState, useEffect } from "react";

const ReloadPrompt: React.FC = () => {
  const [isReloadClicked, setIsReloadClicked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("reloaded")) {
      setIsReloadClicked(true);
      localStorage.removeItem("reloaded");
    }
  }, []);

  const handleReloadClick = () => {
    localStorage.setItem("reloaded", "true");
    window.location.reload();
  };

  if (isReloadClicked) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
      style={{
        backdropFilter: "blur(20px)",
        background: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className=" text-white opacity-60 font-black text-4xl ">
        <p className="my-32 ">
          Please reload the page to display the content correctly.
        </p>
        <button
          className="  border font-semibold w-1/6 text-black bg-white text-2xl rounded-full p-5"
          onClick={handleReloadClick}
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default ReloadPrompt;
