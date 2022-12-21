import { useEffect, useRef, RefObject } from "react";
import "./home.css";

let clickNum = 0;
let numOfSlide: number;

const Home = (): JSX.Element => {
  const sliderContainer = useRef() as RefObject<HTMLDivElement>;

  useEffect((): void => {
    if (sliderContainer.current) {
      const sliderCount = sliderContainer.current.children.length;
      numOfSlide = Math.floor(sliderCount / 3);
    }
  }, []);

  const handleSlideLeft = (): void => {
    const slider = sliderContainer.current as HTMLDivElement;
    if (clickNum === 0) {
      const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--transform-i")
      );
      slider.style.setProperty("--transform-i", `${sliderIndex + 2}`);
      clickNum = 2;
    } else {
      const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--transform-i")
      );
      slider.style.setProperty("--transform-i", `${sliderIndex - 1}`);
      clickNum--;
    }
  };

  const handleSlideRight = (): void => {
    const slider = sliderContainer.current as HTMLDivElement;
    if (clickNum === numOfSlide - 1) {
      const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--transform-i")
      );
      slider.style.setProperty("--transform-i", `${sliderIndex - 2}`);
      clickNum = 0;
    } else {
      const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--transform-i")
      );
      slider.style.setProperty("--transform-i", `${sliderIndex + 1}`);
      clickNum++;
    }
  };

  return (
    <>
      <h1 className="title">Puzzle Store</h1>
      <h2 className="sub-title">Our Puzzles</h2>
      <div className="carousel-container">
        <span className="left" onClick={handleSlideLeft}>
          &#8249;
        </span>
        <span className="right" onClick={handleSlideRight}>
          &#8250;
        </span>
        <div className="grid-container" ref={sliderContainer}>
          <div className="grid-col" style={{ "--i": 1 } as React.CSSProperties}>
            <img src={require("./img/E2xK73tVgAktY1q.jpg")} alt="img" />
          </div>
          <div className="grid-col" style={{ "--i": 2 } as React.CSSProperties}>
            <img src={require("./img/E2xK73tVgAktY1q.jpg")} alt="img" />
          </div>
          <div className="grid-col" style={{ "--i": 3 } as React.CSSProperties}>
            <img src={require("./img/incognito-browser-mode.jpg")} alt="img" />
          </div>
          <div className="grid-col" style={{ "--i": 4 } as React.CSSProperties}>
            <img src={require("./img/E2xK73tVgAktY1q.jpg")} alt="img" />
          </div>
          <div className="grid-col" style={{ "--i": 5 } as React.CSSProperties}>
            <img src={require("./img/download.jpg")} alt="img" />
          </div>
          <div className="grid-col" style={{ "--i": 6 } as React.CSSProperties}>
            <img src={require("./img/E2xK73tVgAktY1q.jpg")} alt="img" />
          </div>
          <div className="grid-col" style={{ "--i": 7 } as React.CSSProperties}>
            <img src={require("./img/incognito-browser-mode.jpg")} alt="img" />
          </div>
          <div className="grid-col" style={{ "--i": 8 } as React.CSSProperties}>
            <img src={require("./img/E2xK73tVgAktY1q.jpg")} alt="img" />
          </div>
          <div className="grid-col" style={{ "--i": 9 } as React.CSSProperties}>
            <img src={require("./img/incognito-browser-mode.jpg")} alt="img" />
          </div>
          <div
            className="grid-col"
            style={{ "--i": 10 } as React.CSSProperties}
          >
            <img src={require("./img/E2xK73tVgAktY1q.jpg")} alt="img" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
