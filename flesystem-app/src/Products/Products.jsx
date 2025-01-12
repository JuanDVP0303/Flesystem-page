import { productDataUrl } from "../data";
import { useEffect } from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import propTypes from "prop-types";

export default function Products() {
  const [showToHeader, setShowToHeader] = useState(
    "opacity-0 pointer-events-none"
  );
  useEffect(() => {
    const handleScroll = () => {
      setShowToHeader(
        window.scrollY >= 300
          ? "opacity-1 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      );
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="pb-24 pt-24">
      <section className="flex justify-center ">
        <a
          href="#header"
          className={`
        w-12 h-12 fixed rounded-full bg-[#1e3c72] right-1 ${showToHeader} transition ease-in-out duration-300 md:right-[80px] md:w-16 md:h-16 active:scale-125`}
        ></a>
        <ul className="flex flex-wrap flex-row md:w-[50%] lg:w-[70%] items-center justify-center  lg:gap-20 lg:grid lg:grid-cols-3 lg:justify-center">
          {productDataUrl.map(({ url, productName, id }) => {
            return (
              <li
                key={id}
                className="w-full m-10 flex border transition-all hover:translate-y-[-20px] border-green-300 rounded-lg p-5 shadow-md justify-center flex-col"
              >
                <Link to={`/products/${id}`}>
                  <h2 className="text-center">{productName}</h2>
                  <img src={url} alt="" className="rounded-lg" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export const ProductDetail = () => {
  //esperando el parametro que este en la url que sera un numero
  const { productId } = useParams();
  //Accediendo a la data del product dependiendo de la url
  const productData = productDataUrl[productId];
  const { productName, url, descripcion, caracteristicas, usos, colores } =
    productData;

  const Titles = ({ children }) => {
    return (
      <h2 className="font-bold text-xl text-center text-green-700">
        {children}
      </h2>
    );
  };
  Titles.propTypes = {
    children: propTypes.string,
  };

  return (
    <article className="w-full h-full flex flex-col items-center bg-gray-300/20 rounded-lg py-20">
      <Link
        className="border-2 p-2 border-green-500 rounded-lg bg-green-100 mb-20"
        to={"/products"}
      >
        {" "}
        Volver a los productos
      </Link>
      <h2 className="font-bold text-3xl mb-5  text-green-700">{productName}</h2>
      <img
        src={`${url}`}
        alt={`${productName}`}
        className="rounded-xl border-2 border-green-700  w-[40vmax]  object-cover  mb-10"
      />
      <div className="flex flex-col gap-5 px-5 lg:w-[40vmax] text-center">
        <p className="">{}</p>
        <Titles>Descripción</Titles>
        <p>{descripcion}</p>

        <Titles>Caracteristicas</Titles>
        <ListRendering propiedad={caracteristicas} />
        <Titles>Usos</Titles>
        <ListRendering propiedad={usos} />
        <Titles>Colores</Titles>
        <ListRendering propiedad={colores} />
      </div>
    </article>
  );
};

const ListRendering = ({ propiedad }) => {
  return (
    // <h1></h1>
    <ul className="list-disc text-start ">
      {propiedad ? propiedad.map((prop, i) => {
        return (
          <li key={i} className="mb-5">
            {prop}
          </li>
        );
      } ) : null}
    </ul>
  );
};

ListRendering.propTypes = {
  propiedad: propTypes.array.isRequired,
};
