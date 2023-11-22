import { BsPersonGear } from 'react-icons/bs'
import {IoHardwareChipOutline } from 'react-icons/io5'
import { MdOutlineInventory2 } from 'react-icons/md'
import Header from '../../components/Header';

export default function Dashboard() {
  return (
    <div className='w-full'>
          <Header title={"Tableau de bord"} />
          <div className='pt-[25px] px-[25px] bg-[#f5f4f4]'>
        {/* <div className='flex items-center justify-between'>
            <h1 className='text-[#5A5C69] text-[28px] leading-[34px]'>Tableau de bord</h1>
            <button className='bg-[#b9b9b9] h-[32px] rounded-[3px] flex items-center justify-center px-[30px] cursor-pointer'>Génerer rapport</button>
        </div> */}
        {/* ------------------------Grid------------------------------------ */}
        <div className='grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]'>
          <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#3c3c3f] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
            <div>
              <h2 className='text-[#4dac3b] text-[11px] leading-[17px] font-bold'>Matériels (Total)</h2>
              <h1 className='text-[20px] leading-[24px] font-bold text-[#5A5C69] mt-[5px]'>79</h1>
            </div>
            <MdOutlineInventory2 fontSize={28}/>
          </div>
          <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#3c3c3f] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
            <div>
              <h2 className='text-[#4dac3b] text-[11px] leading-[17px] font-bold'>Matériels (Utilisés)</h2>
              <h1 className='text-[20px] leading-[24px] font-bold text-[#5A5C69] mt-[5px]'>61</h1>
            </div>
            <MdOutlineInventory2 fontSize={28}/>
          </div>
          <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#3c3c3f] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
            <div>
              <h2 className='text-[#4dac3b] text-[11px] leading-[17px] font-bold'>Logiciels (Total)</h2>
              <h1 className='text-[20px] leading-[24px] font-bold text-[#5A5C69] mt-[5px]'>52</h1>
            </div>
            <IoHardwareChipOutline fontSize={28}/>
          </div>
          <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#3c3c3f] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
            <div>
              <h2 className='text-[#4dac3b] text-[11px] leading-[17px] font-bold'>Utilisateurs (Total)</h2>
              <h1 className='text-[20px] leading-[24px] font-bold text-[#5A5C69] mt-[5px]'>32 personnes</h1>
            </div>
            <BsPersonGear fontSize={28}/>
          </div>
        </div>
        {/* ----------------------------------------------------------------- */}
    </div>
        </div>
  )
}
