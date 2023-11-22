import { FaRegBell } from 'react-icons/fa'
import { FiLogOut } from "react-icons/fi"
import { useNavigate } from 'react-router-dom';

export default function Header(props) {
    const navigate = useNavigate();
    const handleLogout = () => {
        const shouldLogout = window.confirm("Voulez-vous vraiment vous déconnecter ?");
        if (shouldLogout) {
            localStorage.removeItem("token");
            navigate('/login');
        }
    // window.location.reload();
    };
  return (
    <div className='flex items-center justify-between h-[70px] shadow-lg px-[25px]'>
            <h1 className='text-[#5A5C69] text-[28px] leading-[34px]'>{props.title}</h1>
        <div className='flex items-center gap-[15px] relative'>
            <div className='flex items-center gap-[25px] border-r-[1px] pr-[25px] cursor-pointer'>
                <FaRegBell />
            </div>
            <div className='flex items-center justify-center gap-[15px] relative'>
                <button className="flex justify-between items-center m-6 text-white bg-red-500 p-2 rounded-full" onClick={handleLogout}><FiLogOut size={20} /></button>
            </div>
        </div>
    </div>
  )
}
