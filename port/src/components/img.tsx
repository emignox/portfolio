import emaImg from "../img/ema6.jpeg";

function Ema() {
  return (
    <div className=" w-40 flex items-center justify-center fade-in-from-left   lg:w-3/4 lg:mt-0 ">
      <img className="  rounded-2xl" src={emaImg} alt="emapic" />
    </div>
  );
}

export default Ema;
