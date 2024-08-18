import { MdArrowOutward } from "react-icons/md";

interface ButtonProps {
  text: string;
  onClick?: () => void;
}
function Button({ text }: ButtonProps) {
  const handleClick = () => {
    const link = document.createElement("a");
    link.href = "./EPresumé.pdf"; // Inserisci qui il percorso al tuo CV
    link.download = "cvPolizzottoEmanuele.pdf"; // Il nome del file che verrà scaricato
    link.dispatchEvent(new MouseEvent("click"));
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`button flex items-center justify-center group  `}
      >
        {text}{" "}
        <MdArrowOutward className="mx-3 transition-transform duration-200 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </button>
    </div>
  );
}

export default Button;
