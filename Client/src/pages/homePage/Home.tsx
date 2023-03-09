import { useEffect, useRef, RefObject, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./home.css";

let clickNumP = 0;
let clickNumR = 0;

interface slideProp {
  _id: string;
  name: string;
  image: string[];
}

const Home = (): JSX.Element => {
  const [recent, setRecent] = useState<slideProp[]>();
  const [popular, setPopular] = useState<slideProp[]>();

  const navigate = useNavigate();

  const sliderRecent = useRef() as RefObject<HTMLDivElement>;
  const sliderPopular = useRef() as RefObject<HTMLDivElement>;

  useEffect((): void => {
    axios
      .get("/product/mostrecent")
      .then(({ data }) => setRecent(data.concat(data.concat(data))))
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
      const numOfSlide = popular.length;
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
      const numOfSlide = popular.length;
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

  const handleAutoScroll = (index: number): void => {
    if (index === 1) setInterval((): void => handleSlideRight(), 7000);
    else return;
  };

  return (
    <>
      <div className="home-content">
        <div className="carousel-container">
          <span
            className="arrow left-arrow"
            onClick={() => handleSlideLeft()}
            style={{
              left: "0.2rem",
              backgroundColor: "rgba(190, 190, 190, 0.2)",
            }}
          >
            &#8249;
          </span>
          <span
            className="arrow right-arrow"
            onClick={() => handleSlideRight()}
            style={{
              right: "0.2rem",
              backgroundColor: "rgba(190, 190, 190, 0.2)",
            }}
          >
            &#8250;
          </span>
          <div className="main-flex-container" ref={sliderPopular}>
            {popular &&
              popular.map((item, index: number) => (
                <div
                  className="flex-col"
                  key={item.name + index}
                  onClick={() => navigate(`/product?pid=${item._id}`)}
                  onLoad={(): void =>
                    handleAutoScroll(index === popular.length - 1 ? 1 : 0)
                  }
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
        <h3 className="sub-title" style={{ marginTop: "3rem" }}>
          New to the shop:
        </h3>
        <div className="carousel-container" style={{ marginBottom: "4rem" }}>
          {recent && recent.length > 4 && (
            <div className="arrow-container">
              <span
                className="arrow left-arrow"
                onClick={() => handleSlideLeft("recent")}
              >
                &#8249;
              </span>
              <span
                className="arrow right-arrow"
                onClick={() => handleSlideRight("recent")}
              >
                &#8250;
              </span>
            </div>
          )}
          <div className="grid-container" ref={sliderRecent}>
            {recent &&
              recent.map((item, index: number) => (
                <div
                  className="grid-col"
                  style={{ "--i": index + 1 } as React.CSSProperties}
                  key={item.name + index}
                  onClick={() => navigate(`/product?pid=${item._id}`)}
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
      </div>
    </>
  );
};

export default Home;
