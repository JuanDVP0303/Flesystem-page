import { Slider } from "./Slider";
import { NavLink } from "react-router-dom";
import About from "./About/About";
import Contact from "../Contact/Contact";



export default function Home() {
  return (
    <main className="">
      {/* Parte superior, hero */}
      <div className="bg-gradient-to-r from-[#1e3c72] to-[#2974f5]  lg:h-[130vh] h-[100vh]  w-full absolute -z-1 "></div>

      <figure className="h-[100%] w-full flex justify-center items-center gap-10 flex-col relative pt-20 ">
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
