import { CiWavePulse1 } from "react-icons/ci";
import { GoDash } from "react-icons/go";
import { useState } from "react";
// import sound from "/space-sound.mp3";

interface SoundProps {
  className: string;
}

function Sound({ className }: SoundProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const handleIconClick = () => {
    setIsPlaying(!isPlaying);
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
        {/* {isPlaying ? <audio src={sound} autoPlay loop /> : null} */}
      </div>
    </>
  );
}

export default Sound;
