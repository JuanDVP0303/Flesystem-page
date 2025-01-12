import { CardGenerator } from "./CardGenerator";
export const MisionVision = () => {
    return (
      <article className="mt-8  flex  flex-col md:flex-row items-center gap-5 ">
        <CardGenerator bg={"bg-green-400"} content={"Nuestra empresa esta orientada a satisfacer las crecientes necesidades, en materia de empaque, de la industria nacional, mediante la fabricación y comercialización de productos de la más alta calidad contribuyendo así al crecimiento del país"} title={"Misión"} />
        
        <CardGenerator bg={"bg-blue-400"} content={"Nos visualizamos en ser reconocidos por la calidad de nuestros productos y la excelencia de nuestra gente.Para asi lograr ser una empresa lider en la industria de fleje y maquinaria de embalaje industrial en el territorio Venezolano."}  title={"Visión"} />
      </article>
    );
  };