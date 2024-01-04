import Foto from "../img/logo1.png";

function Logo() {
  return (
    <>
      <div>
        <img
          className=" w-14  lg:py-3  pt-2 lg:block lg:mx-8 lg:w-28 lg:-my-9 "
          src={Foto}
          alt=""
        />
      </div>
    </>
  );
}

export default Logo;
