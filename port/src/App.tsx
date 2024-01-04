import Nav from "./components/nav";
import Logo from "./components/logo";
import Text from "./components/bigText";

function App() {
  return (
    <>
      <div
        className="flex justify-between mb-8 "
        style={{ backgroundColor: "black" }}
      >
        <div className=" py-2  p-0 m-0 ">
          {" "}
          <Nav />
        </div>
        <Logo />
      </div>
      <div className="">
        {" "}
        <Text />
      </div>
    </>
  );
}

export default App;
