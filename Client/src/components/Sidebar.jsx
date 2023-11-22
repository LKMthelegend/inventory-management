import { useState } from 'react'
import {FaBars, FaObjectGroup, FaTachometerAlt} from 'react-icons/fa'
import {BsPersonGear, BsArrowLeftRight} from 'react-icons/bs'
import { IoHardwareChipOutline } from "react-icons/io5";
import { MdOutlineInventory2 } from "react-icons/md";
import { VscTools } from "react-icons/vsc";
import { NavLink, Outlet } from 'react-router-dom'
import Logo from '../assets/logo_fid.png'
import '../App.css'

export default function Sidebar() {
  const [isOpen, SetIsOpen] = useState(true);
  const toggle = () => SetIsOpen(!isOpen);
  const menuItem = [{
    path: "/",
    name: "Tableau de bord",
    icon: <FaTachometerAlt />
  },
  {
    path: "/employee",
    name: "employée",
    icon: <BsPersonGear />
  },
  {
    path: "/materiel",
    name: "Matériel",
    icon: <MdOutlineInventory2 />
  },
  {
    path: "/logiciel",
    name: "Logiciel",
    icon: <IoHardwareChipOutline />
  },
  {
    path: "/service",
    name: "Service",
    icon: <FaObjectGroup/>,
  },
  {
    path: "/affectation",
    name: "Afféctation",
    icon: <BsArrowLeftRight />
  },
  {
    path: "/preference",
    name: "Préférence",
    icon: <VscTools />  
  }
]
  return (
    <div className='container' style={{ display: 'flex', height: '100vh' }}>
    <div style={{ width: isOpen ? "250px" : "50px", position: 'fixed', top: 0, bottom: 0, left: 0 }} className="sidebar">
          <div className="top_section">
            <div style={{display: isOpen ? "block" : "none"}} className="logo">
              <img src={Logo} alt="Mon logo" />
            </div>
            <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="bars">
              <FaBars onClick={toggle}/>
            </div>
          </div>
          {
            menuItem.map((item, index) => (
              <NavLink to={item.path} key={index} className="link" activeclassname="active">
                <div className="icon">{item.icon}</div>
                <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
              </NavLink>
            ))
          }
        </div>
        <main style={{ marginLeft: isOpen ? "250px" : "50px", width: '100%', overflowY: 'auto' }}  className='w-full'>
          <Outlet />
        </main>
    </div>
  )
}
