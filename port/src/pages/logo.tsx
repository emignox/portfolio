import { Link } from "react-router-dom";
import "./logo.css";
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function logo() {
    const handleDownload = () => {
        saveAs("", "resume.pdf");
      };
  return (
    <>
      <div className="d-flex flex-column flex-md-row">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="180"
          height="80"
          viewBox="0 0 101 68"
          className=" mx-5 m-4 p-1 "
          fill="none"
        >
          <path
            d="M46.7 50.8H49.5V68H0V65.2L5.5 64.5C6.56667 64.3667 7.2 64.1 7.4 63.7C7.6 63.2333 7.7 61.8667 7.7 59.6V8.4C7.7 6.13333 7.6 4.8 7.4 4.4C7.2 3.93333 6.56667 3.63333 5.5 3.5L0 2.8V0H49L48.5 17.2H45.7L42.5 6.1C42.3 5.3 42.0667 4.73333 41.8 4.4C41.6 4 41.1667 3.76667 40.5 3.7C39.8333 3.56667 38.7 3.5 37.1 3.5H19.7V31.9H31.1C32.7 31.9 33.8333 31.8667 34.5 31.8C35.1667 31.6667 35.6 31.4333 35.8 31.1C36.0667 30.7 36.3 30.1 36.5 29.3L38.7 21.2H41.5V46.1H38.7L36.5 38C36.3 37.2 36.0667 36.6333 35.8 36.3C35.6 35.9 35.1667 35.6667 34.5 35.6C33.8333 35.4667 32.7 35.4 31.1 35.4H19.7V64.5H38.1C39.7 64.5 40.8333 64.4667 41.5 64.4C42.1667 64.2667 42.6 64.0333 42.8 63.7C43.0667 63.3 43.3 62.7 43.5 61.9L46.7 50.8Z"
            fill="#710000"
          />
          <path
            d="M49 2.8V0H64H79.1C86.4333 0 91.9 1.7 95.5 5.1C99.1667 8.43333 101 12.9 101 18.5V20.8C101 26.4 99.1667 30.9 95.5 34.3C91.9 37.7 86.4333 39.4 79.1 39.4H68.7V59.6C68.7 61.8667 68.8 63.2333 69 63.7C69.2 64.1 69.8333 64.3667 70.9 64.5L78.4 65.2V68H49V65.2L54.5 64.5C55.5667 64.3667 56.2 64.1 56.4 63.7C56.6 63.2333 56.7 61.8667 56.7 59.6V8.4C56.7 6.13333 56.6 4.8 56.4 4.4C56.2 3.93333 55.5667 3.63333 54.5 3.5L49 2.8ZM79.1 3.5H68.7V35.9H79.1C82.0333 35.9 84.2667 34.7333 85.8 32.4C87.4 30.0667 88.2 26.8667 88.2 22.8V16.5C88.2 12.4333 87.4 9.26667 85.8 7C84.2667 4.66667 82.0333 3.5 79.1 3.5Z"
            fill="white"
          />
        </svg>
        <ul className=" list-unstyled  d-flex  text-center w-100 justify-content-center flex-md-row m-5   ">
          <li>
            <Link
              to="/"
              className="  colors text-decoration-none fs-3 mx-5 ml-5 "
            >
              About Me
            </Link>
          </li>
          <li>
            <Link to="/" className="text-decoration-none fs-3 mx-5 colori">
              Portfolio
            </Link>
          </li>
          <li>
            <Link to="/" className="text-decoration-none fs-3 mx-5  colori">
              Contacts
            </Link>
          </li>
        </ul>{" "}
        <h1
          className="text-white mx-5 bd  "
          style={{
            color: "#d2d2d2",
            position: "absolute",
            top: "20%",
            fontSize: "8rem",
            fontWeight: "bold",
            paddingLeft: "1rem",
          }}
        >
          Front-End <br /> Developer
        </h1>
        <p
          className="text-white mx-5  "
          style={{
            color: "#d2d2d2",
            padding: "1rem",
            width: "28%",
            position: "absolute",
            top: "55%",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          🚀Expert in React, JavaScript, CSS, Tailwind, and Bootstrap. I turn
          ideas into extraordinary interfaces. Creativity, precision, and
          innovation drive my approach. Ready to make your project a unique web
          experience!
        </p>
          <button
            onClick={handleDownload}
            className="btn btn-primary mx-5 but my-5"
            style={{
              borderRadius: "1rem",
              border: "none",
              backgroundColor: "#710000",
              color: "#d2d2d2",
              padding: "1rem",
              width: "20%",
              position: "absolute",
              top: "70%",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            Read my Resume
          </button>
          <div className="d-flex justify-content-end position-relative">
  <img src="./foto2.jpeg" className="vh-100 float-end" alt="my foto" />
  <div
    className="position-absolute"
    style={{
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: 'linear-gradient(180deg, transparent, black)',
      zIndex: 1,
    }}
  ></div>
  <div
    className="position-absolute text-center"
    style={{
      top: '70%',
      zIndex: 2,
    }}
  >
    <h1
      className="fw-bold"
      style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        color: '#FFF',
      }}
    >
      Polizzotto  Emanuele
    </h1>
    <h1  className=""
      style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#710000',
      }}>Developer Front
      </h1>
      <div>
  <a   className="fs-4 text-white p-3" href="https://github.com/yourusername"  target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faGithub} size="2x" />
  </a>
  <a  className="fs-4 text-white p-3" href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faLinkedin} size="2x" />
  </a>
</div>


  </div>

  <div className="">

  </div>
</div>
      </div>  
    </>
  );
}
export default logo;
