import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
{/*import Logo from "./components/logo";*/}
import { BrowserRouter as Router } from 'react-router-dom';
import Logo from "./pages/logo";
 




function App() {
  return (
    <>
    <Router>
     <div className=" pollo bg-black vh-100 w-100 w-75   ">
        <Logo />
  </div>
 
 
      

      

      </Router>
    </>
  );
}

export default App;
