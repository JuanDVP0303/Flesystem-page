import React from 'react'
import propTypes from "prop-types"
function Footer() {
  return (
    <footer className='bg-gradient-to-r from-[#1e3c72] to-[#2a5298] h-auto w-full  relative flex justify-center'>
      <section className='md:grid md:gap-24 md:grid-flow-col md:mb-5'>
        <article className='pt-20 flex justify-center flex-col  w-full text-center '>
          <h2 className='text-white'>Empresa</h2>
          <Paragraph content={"Copyright ® 2015-2016 Flesystem C.A."}/>
          <Paragraph content={"Flejes y sistemas C.A"}/>
          <Paragraph content={"Todos los derechos reservados"}/>
        </article>
        <article className='flex flex-col mt-10 justify-center items-center' >
          <h2 className='text-white'>Contactos</h2>
          <Mail content={"ventas@flesystem.com"}/>
          <Mail content={"compras@flesystem.com"}/>
          <Mail content={"adminstración@flesystem.com"}/>
        </article>
        <figure className='w-full flex justify-center mt-10 mb-10 flex-col items-center'>
          <Paragraph content={"¡Contactanos a nuestro WhatsApp!"}/>
          <a href='https://api.whatsapp.com/send/?phone=584141399568&text&type=phone_number&app_absent=0' target='_blank' rel='noreferrer'>
        <img src="https://cdn.icon-icons.com/icons2/373/PNG/256/Whatsapp_37229.png" className='w-12 h-12 mt-3' alt="" />
        </a>
        </figure>
      </section>
    </footer>
  )
}

export const Paragraph = ({content, color}) => {
  const textColor = color ? color : "white"
  return <p className={`text-${textColor} block p-1`}>{content}</p>
}

Paragraph.propTypes = {
  content: propTypes.string,
  color: propTypes.string
}


const Mail = ({content}) => {
  return <a className='text-[#5eaf5a] pt-1 underline' href={`mailto:${content}`}>{content}</a>
}

Mail.propTypes = {
  content: propTypes.string.isRequired
}


export default Footer