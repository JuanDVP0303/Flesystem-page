import { GoDotFill } from "react-icons/go";
import { carousselDataImg } from "../data";
import { useState } from "react";
import { useEffect } from "react";
export function Slider() {
    const [CurrentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const figureScroll = document.querySelector(".figure-scroll");
      const scrollOptions = {
        left: figureScroll.clientWidth * CurrentIndex,
        behavior: "smooth",
      };
  
      figureScroll.scrollTo(scrollOptions);
  
      const interval = setInterval(() => {
        CurrentIndex == carousselDataImg.length - 1 && setCurrentIndex(-1);
        figureScroll.scrollTo(scrollOptions);
        setCurrentIndex((curr) => curr + 1);
      }, 3000);
  
      return () => {
        clearInterval(interval);
      };
    }, [CurrentIndex]);
  
    const goToImage = (indexToGo) => {
      setCurrentIndex(indexToGo);
    };
  
    return (
      <>
        <div className="figure-scroll flex overflow-hidden w-[90%] lg:w-[60%] pt-32 m-m-0-auto ">
          {carousselDataImg.map(({ url, id }) => (
            <img className="w-full object-cover" src={url} key={id} />
          ))}
        </div>


        <div className="flex flex-row justify-center gap-1">
          {carousselDataImg.map((image) => {
            const scale =
              image.id == CurrentIndex
                ? "shadow-customShadow rounded-full "
                : null;
            return (
              <GoDotFill
                className={`${scale} mt-4 hover:cursor`}
                key={image.id}
                onClick={() => {
                  goToImage(image.id);
                }}
              ></GoDotFill>
            );
          })}
        </div>
      </>
    );
  }