import { CiWavePulse1 } from "react-icons/ci";
import { GoDash } from "react-icons/go";
import { useState, useEffect } from "react";
import soundFile from "/space-sound.mp3";
import { useLocation } from "react-router-dom";

interface SoundProps {
  className: string;
}

// Creazione di un elemento audio globale
const audio = new Audio(soundFile);

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

  useEffect(() => {
    const savedTime = localStorage.getItem("audio-time");
    if (savedTime) {
      audio.currentTime = Number(savedTime);
    }
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("audio-time", audio.currentTime.toString());
    });
    return () => {
      window.removeEventListener("beforeunload", () => {
        localStorage.setItem("audio-time", audio.currentTime.toString());
      });
    };
  }, [isPlaying]);

  const handleIconClick = () => {
    setIsPlaying(!isPlaying);
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  return (
    <div className="fixed w-10 h-10 m-2 bottom-10 right-3">
      <div
        className={`flex items-center justify-center w-12 h-12 text-white border-2 rounded-full ${className}`}
      >
        {isPlaying ? (
          <CiWavePulse1 className="text-3xl" onClick={handleIconClick} />
        ) : (
          <GoDash className="text-3xl" onClick={handleIconClick} />
        )}
      </div>
    </div>
  );
}

export default Sound;
