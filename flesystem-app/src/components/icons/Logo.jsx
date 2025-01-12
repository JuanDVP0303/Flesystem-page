
export const Logo = ({giant, medium}) => {
  return (
    <div
      className="
    flex
    items-center
    justify-center
    w-full
    text-xl
    font-bold
  "
    >
      {/* <img src="https://i.postimg.cc/Jz7k2pKv/Logo2.png" className='bg-green-900 p-1 rounded-full m-1' alt="" /> */}

      <span className={`text-black ${giant ? "text-4xl" : medium && 'text-3xl'}`}>
        Fle
      </span>
      <span className={`text-[#388e3c] ${giant ? "text-4xl" : medium && 'text-3xl'}`}>
      system
      </span>
      
    </div>
  );
};
