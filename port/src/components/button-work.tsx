import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Button() {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate(); 

  return (
    <button
     onClick={() => navigate("/about")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-3 px-4 py-1.5 mx-3 mt-2 text-sm font-medium text-white transition duration-300 border rounded-full border-white/50 bg-black/35 backdrop-blur-md hover:bg-white hover:text-black"
    >
      <span className="relative flex w-2.5 h-2.5">
        <span className="absolute inline-flex w-full h-full bg-green-500 rounded-full opacity-75 animate-ping" />
        <span className="relative inline-flex w-2.5 h-2.5 bg-green-500 rounded-full" />
      </span>

      {hover ? (
        <p className="fade">Contact me</p>
      ) : (
        <p className="fade">open for work</p>
      )}
    </button>
  );
}

export default Button;
