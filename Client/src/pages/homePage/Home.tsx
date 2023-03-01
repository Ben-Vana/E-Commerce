import { useEffect, useRef, RefObject, useState } from "react";
import axios from "axios";
import "./home.css";

let clickNumP = 0;
let clickNumR = 0;

interface slideProp {
  id: string;
  name: string;
  image: string[];
}

const Home = (): JSX.Element => {
  const [recent, setRecent] = useState<slideProp[]>();
  const [popular, setPopular] = useState<slideProp[]>();

  const sliderRecent = useRef() as RefObject<HTMLDivElement>;
  const sliderPopular = useRef() as RefObject<HTMLDivElement>;

  useEffect((): void => {
    axios
      .get("/product/mostrecent")
      .then(({ data }) => setRecent(data.concat(data)))
      .catch((err) => console.log(err));
    axios
      .get("/product/mostview")
      .then(({ data }) => setPopular(data))
      .catch((err) => console.log(err));
  }, []);

  const handleSlideLeft = (name?: string): void => {
    const slider = name
      ? (sliderRecent.current as HTMLDivElement)
      : (sliderPopular.current as HTMLDivElement);

    if (name && recent) {
      if (recent.length < 6) return;
      const numOfSlide = Math.ceil(recent.length / 5);
      if (clickNumR === 0) {
        slider.style.setProperty("--transform-i", `${numOfSlide - 1}`);
        clickNumR = numOfSlide - 1;
      } else {
        const sliderIndex = parseInt(
          getComputedStyle(slider).getPropertyValue("--transform-i")
        );
        slider.style.setProperty("--transform-i", `${sliderIndex - 1}`);
        clickNumR--;
      }
    } else if (popular) {
      if (popular.length < 6) return;
      const numOfSlide = Math.ceil(popular.length / 5);
      if (clickNumP === 0) {
        slider.style.setProperty("--transform-i", `${numOfSlide - 1}`);
        clickNumP = numOfSlide - 1;
      } else {
        const sliderIndex = parseInt(
          getComputedStyle(slider).getPropertyValue("--transform-i")
        );
        slider.style.setProperty("--transform-i", `${sliderIndex - 1}`);
        clickNumP--;
      }
    }
  };

  const handleSlideRight = (name?: string): void => {
    const slider = name
      ? (sliderRecent.current as HTMLDivElement)
      : (sliderPopular.current as HTMLDivElement);

    if (name && recent) {
      if (recent.length < 6) return;
      const numOfSlide = Math.ceil(recent.length / 5);
      if (clickNumR === numOfSlide - 1) {
        slider.style.setProperty("--transform-i", "0");
        clickNumR = 0;
      } else {
        const sliderIndex = parseInt(
          getComputedStyle(slider).getPropertyValue("--transform-i")
        );
        slider.style.setProperty("--transform-i", `${sliderIndex + 1}`);
        clickNumR++;
      }
    } else if (popular) {
      if (popular.length < 6) return;
      const numOfSlide = Math.ceil(popular.length / 5);
      if (clickNumP === numOfSlide - 1) {
        slider.style.setProperty("--transform-i", "0");
        clickNumP = 0;
      } else {
        const sliderIndex = parseInt(
          getComputedStyle(slider).getPropertyValue("--transform-i")
        );
        slider.style.setProperty("--transform-i", `${sliderIndex + 1}`);
        clickNumP++;
      }
    }
  };

  return (
    <>
      <h1 className="title">Puzzle Store</h1>
      <h2 className="sub-title">Popular products:</h2>
      <div className="carousel-container">
        <span className="arrow left" onClick={() => handleSlideLeft()}>
          &#8249;
        </span>
        <span className="arrow right" onClick={() => handleSlideRight()}>
          &#8250;
        </span>
        <div className="grid-container" ref={sliderPopular}>
          {popular &&
            popular.map((item, index: number) => (
              <div
                className="grid-col"
                style={{ "--i": index + 1 } as React.CSSProperties}
                key={item.name + index}
              >
                <img
                  src={`http://localhost:8181/public/images/${item.image[0]}`}
                  alt={item.name}
                  crossOrigin="anonymous"
                />
              </div>
            ))}
        </div>
      </div>
      <h2 className="sub-title">New to the shop:</h2>
      <div className="carousel-container">
        <span className="arrow left" onClick={() => handleSlideLeft("recent")}>
          &#8249;
        </span>
        <span
          className="arrow right"
          onClick={() => handleSlideRight("recent")}
        >
          &#8250;
        </span>
        <div className="grid-container" ref={sliderRecent}>
          {recent &&
            recent.map((item, index: number) => (
              <div
                className="grid-col"
                style={{ "--i": index + 1 } as React.CSSProperties}
                key={item.name + index}
              >
                <img
                  src={`http://localhost:8181/public/images/${item.image[0]}`}
                  alt={item.name}
                  crossOrigin="anonymous"
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Home;
