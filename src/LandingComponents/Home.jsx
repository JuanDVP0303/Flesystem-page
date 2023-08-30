import { GoDotFill } from "react-icons/go";
import { carousselDataImg } from "../data";
import { useState } from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import About from "./About";
import Contact from "./Contact";
// import Paragraph from "../Layouts/Footer"

function Slider() {
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
      <div className="figure-scroll flex overflow-hidden justify-center w-[90%] lg:w-[60%] pt-32 m-m-0-auto ">
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

export default function Home() {
  return (
    <main className="">
      {/* Parte superior, hero */}
      <div className="bg-gradient-to-r from-[#1e3c72] to-[#2974f5]  h-[120vh]  w-full absolute -z-1 "></div>
      <figure className="h-[100%] w-full flex justify-center items-center gap-10 flex-col relative pt-32 ">
        <img
          src="https://i.postimg.cc/SNH2BvYS/656.jpg"
          className="empresa md:w-[40%]"
          alt=""
        />
        <img
          src="https://i.postimg.cc/6qyqSr94/510.png"
          className="w-[90%] md:w-[40%]  object-contain relativ"
          alt=""
        />
        <p className="text-white max-w-sm text-sm text-center font-bold">
          La elección más inteligente en flejes plásticos en Venezuela
        </p>
        <NavLink
          className={({ isActive }) => {
            const isActive2 = isActive ? "active" : "text-white";
            return `${isActive2} p-2 mb-5 bg-green-700 rounded-md active:scale-105 transition-all hover:bg-green-900 hover:scale-110`;
          }}
          to={"/products"}
        >
          Productos
        </NavLink>
      </figure>

      {/* Slider y parte de nosotros */}
      <Slider />
      <About />
      <hr className="w-[80%] m-m-0-auto bg-green-700 h-1 mt-20 mb-20" />
      <Contact />
    </main>
  );
}
