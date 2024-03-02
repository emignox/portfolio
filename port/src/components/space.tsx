import React, { useEffect, useRef, FC } from "react";

const Star: FC = () => {
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const star = starRef.current;
    if (star) {
      const x = `${Math.random() * 200}vmax`;
      const y = `${Math.random() * 100}vh`;
      const z = `${Math.random() * 200 - 100}vmin`;
      const rx = `${Math.random() * 360}deg`;
      star.style.setProperty("--x", x);
      star.style.setProperty("--y", y);
      star.style.setProperty("--z", z);
      star.style.setProperty("--rx", rx);
    }
  }, []);

  return <div ref={starRef}></div>;
};

const MainComponent: FC = () => {
  const stars = Array.from({ length: 200 }, (_, i) => <Star key={i} />);
  const hyperRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hyper = hyperRef.current;
    if (hyper) {
      hyper.addEventListener("click", (e) => {
        if (document.documentElement.classList.contains("hyper")) {
          stars.forEach((star, i) => {
            star.style.animationName = null;
          });
          hyper.textContent = "Go Hyper";
        } else {
          stars.forEach((star, i) => {
            let delay = `${Math.random() * 900}ms`;
            star.style.animationDelay = delay;
            star.style.animationName = "hyper";
          });
          hyper.textContent = "Stop Hyper";
        }
        document.documentElement.classList.toggle("hyper");
      });
    }
  }, [stars]);

  return (
    <main className="scene left">
      {stars}
      <form>
        <button id="hyper" type="button" ref={hyperRef}>
          Go Hyper
        </button>
        <div className="range">
          <label htmlFor="range">Go Hyper</label>
          <input
            id="hyper-range"
            type="range"
            min="0"
            max="2"
            step=".2"
            value="0"
          />
        </div>
      </form>
    </main>
  );
};

export default MainComponent;
