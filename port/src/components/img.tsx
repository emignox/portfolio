import emaImg from "../img/ema6.jpeg";

function Ema() {
  return (
    <div className="relative w-40 flex items-center justify-center fade-in-from-left lg:w-3/4 lg:mt-0">
      <img className="rounded-2xl" src={emaImg} alt="emapic" />
      <div className="absolute inset-0 bg-[#f8e6d6] opacity-30 rounded-2xl"></div>
    </div>
  );
}

export default Ema;
