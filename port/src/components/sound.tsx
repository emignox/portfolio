import { CiWavePulse1 } from "react-icons/ci";
import { GoDash } from "react-icons/go";
import { useState, useEffect } from "react";
import sound from "/space-sound.mp3";
import { useLocation } from "react-router-dom";

interface SoundProps {
  className: string;
}

function Sound({ className }: SoundProps) {
  const [isPlaying, setIsPlaying] = useState(
    localStorage.getItem("isPlaying") === "true"
  );
  const [hasStarted, setHasStarted] = useState(
    localStorage.getItem("hasStarted") === "true"
  );
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("isPlaying", String(isPlaying));
    localStorage.setItem("hasStarted", String(hasStarted));
  }, [isPlaying, hasStarted]);

  useEffect(() => {
    setIsPlaying(localStorage.getItem("isPlaying") === "true");
  }, [location]);

  const handleIconClick = () => {
    setIsPlaying(!isPlaying);
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  return (
    <>
      {className}
      <div className="border-2 rounded-full text-white h-12 w-12 flex justify-center  items-center">
        {isPlaying ? (
          <CiWavePulse1 className="text-3xl" onClick={handleIconClick} />
        ) : (
          <GoDash className="text-3xl" onClick={handleIconClick} />
        )}
        {isPlaying && hasStarted ? <audio src={sound} autoPlay loop /> : null}
      </div>
    </>
  );
}

export default Sound;
