import { NavLink } from 'react-router-dom'
import {PropTypes} from "prop-types"

function NavButtons({content, to}) {
  return (
    <NavLink className={({isActive}) => {
      const color = isActive ? "active" : "text-white"
      return `p-2 text-md ${color} hover:text-[#2BCFB3]`

    }} to={to}>{content}</NavLink>
  )
}

NavButtons.propTypes = {
  content: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
}

export default NavButtons