import { useState } from "react";
import { FaSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Button() {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate(); 

  return (
    <button
     onClick={() => navigate("/about")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="border border-white rounded-full w-44 text-white h-8 flex justify-start  items-center transition  duration-300 mx-3   hover:bg-white hover:text-black"
    >
      <FaSquare className="  text-green-600 text-xs rotate-45 mx-3 " />

      {hover ? (
        <p className=" fade">Contact me</p>
      ) : (
        <p className="fade">open for work</p>
      )}
    </button>
  );
}

export default Button;
