import { CiWavePulse1 } from "react-icons/ci";
import { GoDash } from "react-icons/go";
import { useState, useEffect } from "react";
import soundFile from "/space-sound.m4a";
import { useLocation } from "react-router-dom";

interface SoundProps {
  className: string;
}

// Creazione di un elemento audio globale
const audio = new Audio(soundFile);
audio.loop = true;

// Ripristina il punto di riproduzione salvato, una sola volta per caricamento pagina
let restored = false;
const restoreTime = () => {
  if (restored) return;
  restored = true;
  const savedTime = Number(localStorage.getItem("audio-time"));
  if (savedTime > 0) audio.currentTime = savedTime;
};
const saveTime = () => {
  localStorage.setItem("audio-time", audio.currentTime.toString());
};

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
    restoreTime();
    if (isPlaying) {
      // Il browser puo' bloccare l'autoplay (es. dopo un reload): in quel caso
      // lo stato torna su "spento" invece di mostrare un'icona che non suona.
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener("beforeunload", saveTime);
    return () => {
      window.removeEventListener("beforeunload", saveTime);
    };
  }, []);

  const handleIconClick = () => {
    setIsPlaying(!isPlaying);
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  return (
    <div className="fixed w-10 h-10 m-2 bottom-10 right-3">
      <button
        type="button"
        onClick={handleIconClick}
        aria-label={isPlaying ? "Mute background sound" : "Play background sound"}
        aria-pressed={isPlaying}
        className={`flex items-center justify-center w-12 h-12 text-white border-2 rounded-full ${className}`}
      >
        {isPlaying ? (
          <CiWavePulse1 className="text-3xl" />
        ) : (
          <GoDash className="text-3xl" />
        )}
      </button>
    </div>
  );
}

export default Sound;
