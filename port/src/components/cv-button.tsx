import { MdArrowOutward } from "react-icons/md";

interface ButtonProps {
  text: string;
  onClick?: () => void;
}
function Button({ text }: ButtonProps) {
  const handleClick = () => {
    const link = document.createElement("a");
    link.href = "./ema.pdf"; // Inserisci qui il percorso al tuo CV
    link.download = "cvema.pdf"; // Il nome del file che verrà scaricato
    link.dispatchEvent(new MouseEvent("click"));
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="button flex items-center justify-center "
      >
        <MdArrowOutward className=" mx-1 " /> {text}
      </button>
    </div>
  );
}

export default Button;
