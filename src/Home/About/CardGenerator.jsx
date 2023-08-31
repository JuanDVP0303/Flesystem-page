import propTypes from "prop-types"

export const CardGenerator = ({bg, content, title, }) => {
    return <div className={`${bg} rounded-lg p-5  text-teal-900 h-auto  `}>
    <h2 className="font-bold text-2xl">{title}</h2>
    <p className="">
      {content} 
    </p>
    </div> 
  }

  CardGenerator.propTypes = {
    bg: propTypes.string,
    content: propTypes.string,
    title: propTypes.string
  }
  
  