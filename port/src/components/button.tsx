import { ButtonProps } from "../interfaces/inter";
import "./button.css";

function Button({ text, className }: ButtonProps) {
  const handleClick = () => {
    const link = document.createElement("a");
    link.href = "/path/to/your/cv.pdf"; // Inserisci qui il percorso al tuo CV
    link.download = "CV.pdf"; // Il nome del file che verrà scaricato
    link.dispatchEvent(new MouseEvent("click"));
  };

  return (
    <div>
      <button className={className} onClick={handleClick}>
        {text}
      </button>
    </div>
  );
}

export default Button;
