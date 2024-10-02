import { BsPersonGear } from 'react-icons/bs'
import {IoHardwareChipOutline } from 'react-icons/io5'
import { MdOutlineInventory2 } from 'react-icons/md'
import Header from '../../components/Header';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';





export default function Dashboard() {
  const [totalHardware, setTotalHardware] = useState(0);
  const [totalSoftware, setTotalSoftware] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usedHardwareCount, setUsedHardwareCount] = useState(0);
const [UsersWithHardware, setUsersWithHardware] = useState(0);
  useEffect(() => {
    fetchData();
  }, []);
 useEffect(() => {
    // Fonction pour récupérer le nombre de matériels utilisés depuis votre API
    const fetchUsedHardwareCount = async () => {
      try {
        const response = await axios.get('http://localhost:8080/count-hardwares');
        setUsedHardwareCount(response.data.usedHardwareCount);
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de matériels utilisés : ', error);
      }
    };

    fetchUsedHardwareCount();
  }, []);
  const fetchData = async () => {
    try {
      const hardwareResponse = await axios.get('http://localhost:8080/hardwares');
      const softwareResponse = await axios.get('http://localhost:8080/softwares');
      const userResponse = await axios.get('http://localhost:8080/users');
      const userWithHardwaresresponse = await axios.get('http://localhost:8080/user-with-hardwares');
      // Obtenir le nombre total de matériels et de matériels utilisés
      const totalHardwareCount = hardwareResponse.data.length;

      // Obtenir le nombre total de logiciels
      const totalSoftwareCount = softwareResponse.data.length;

      // Obtenir le nombre total d'utilisateurs
      const totalUsersCount = userResponse.data.length;

      const UsersWithHardwareCount = userWithHardwaresresponse.data.uniqueUsersCount;


      setTotalHardware(totalHardwareCount);
      setTotalSoftware(totalSoftwareCount);
      setTotalUsers(totalUsersCount);
      setUsersWithHardware(UsersWithHardwareCount);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const [Assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchRecentAssignments();
  }, []);

  const fetchRecentAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/assignments');
      const limitedAssignments = response.data.slice(0, 15); // Récupérer les 15 premières affectations
      setAssignments(limitedAssignments); // Modifier l'URL pour récupérer les 10 dernières affectations
      // setAssignments(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des dernières affectations :', error);
    }
  };



  const data = [
    { name: 'Matériels utilisés', value: usedHardwareCount },
    { name: 'Matériels disponibles', value: totalHardware - usedHardwareCount },
  ];

  const data1 = [
    { name: 'Total Utilisateurs', total: totalUsers },
    { name: 'Utilisateurs avec Matériels', utilisateurs: UsersWithHardware },
  ];

  const COLORS = ['#0088FE', '#00C49F'];
  return (
    <div className='w-full'>
          <Header title={"Tableau de bord"} />
          <div className='pt-[25px] px-[25px] bg-[#f5f4f4]'>
        {/* ------------------------Grid------------------------------------ */}
        <div className='grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]'>
          <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#3c3c3f] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
            <div>
              <h2 className='text-[#4dac3b] text-[11px] leading-[17px] font-bold'>Matériels (Total)</h2>
              <h1 className='text-[20px] leading-[24px] font-bold text-[#5A5C69] mt-[5px]'>{totalHardware}</h1>
            </div>
            <MdOutlineInventory2 fontSize={28}/>
          </div>
          <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#3c3c3f] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
            <div>
              <h2 className='text-[#4dac3b] text-[11px] leading-[17px] font-bold'>Matériels (Utilisés)</h2>
              <h1 className='text-[20px] leading-[24px] font-bold text-[#5A5C69] mt-[5px]'>{usedHardwareCount}</h1>
            </div>
            <MdOutlineInventory2 fontSize={28}/>
          </div>
          <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#3c3c3f] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
            <div>
              <h2 className='text-[#4dac3b] text-[11px] leading-[17px] font-bold'>Logiciels (Total)</h2>
              <h1 className='text-[20px] leading-[24px] font-bold text-[#5A5C69] mt-[5px]'>{totalSoftware}</h1>
            </div>
            <IoHardwareChipOutline fontSize={28}/>
          </div>
          <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#3c3c3f] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
            <div>
              <h2 className='text-[#4dac3b] text-[11px] leading-[17px] font-bold'>Utilisateurs (Total)</h2>
              <h1 className='text-[20px] leading-[24px] font-bold text-[#5A5C69] mt-[5px]'>{totalUsers} personnes</h1>
            </div>
            <BsPersonGear fontSize={28}/>
          </div>
      </div>
          {/* Nouvelle section pour les containers */}
        <div className='flex pb-6'>
          {/* Container pour le graphique */}
          <div className='flex-1 mr-4 bg-white rounded-lg p-4 shadow-md'>
            <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                dataKey='value'
                isAnimationActive={true}
                data={data}
                outerRadius={80}
                fill='#8884d8'
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          </div>
          
          {/* Container pour la liste des affectations */}
          <div className='flex-1 bg-white rounded-lg p-4 shadow-md'>
            <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data1}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='total' fill='#8884d8' name='Total Utilisateurs' />
              <Bar dataKey='utilisateurs' fill='#82ca9d' name='Utilisateurs avec Matériels' />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
    </div>
    {/* Container pour afficher la liste des 10 dernières affectations */}
      <div className='mt-6'>
      <h2 className='text-2xl font-bold mb-4'>Les 15 dernières Affectations</h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {Assignments.map((assignment) => (
          <div key={assignment.id} className='bg-white rounded-lg shadow-md p-4'>
            <p className='font-semibold'>{assignment.user.username}</p>
            <p className='text-gray-500'>{assignment.hardware.name}</p>
            <p className='text-gray-500'>{assignment.hardware.serialNumber}</p>
            <p className='text-sm text-gray-400'>{assignment.assignmentDate}</p>
            {/* ... */}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
