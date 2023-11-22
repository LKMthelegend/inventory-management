import { AiOutlineCloseCircle, AiOutlineSave } from 'react-icons/ai';
import Select from 'react-select';
import axios from 'axios';
import { useState, useEffect } from 'react';


export default function AddAssignment({isVisible, onClose, handleAddAssignment}) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedHardware, setSelectedHardware] = useState(null);
    const [userOptions, setUserOptions] = useState([]);
    const [hardwareOptions, setHardwareOptions] = useState([]);

  useEffect(() => {
    setSelectedUser(null);
    setSelectedHardware(null);
    fetchUsers();
    fetchHardware();
  }, [isVisible]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users');
      const options = response.data.map((user) => ({
        value: user._id,
        label: user.username,
      }));
      setUserOptions(options);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs : ', error);
    }
  };

  const fetchHardware = async () => {
    try {
    const response = await axios.get('http://localhost:8080/hardwares?status=false');
    const options = response.data.map((hardware) => ({
      value: hardware._id,
      label: hardware.name,
      status: hardware.status, // Inclure le statut dans les options de matériel
    }));
    setHardwareOptions(options);
    } catch (error) {
      console.error('Erreur lors de la récupération des matériels : ', error);
    }
  };
const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = {
      userId: selectedUser?.value,
      hardwareId: selectedHardware?.value,
    };

    try {
      await handleAddAssignment(formData);
      onClose(); // Fermer le modal après une affectation réussie
    } catch (error) {
      console.error('Erreur lors de l\'affectation : ', error);
    }
  };

  if (!isVisible) return null;


  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center shadow-lg'>
      <div className='w-[600px] flex flex-col'>
        <button className='text-white text-2xl place-self-end' onClick={() => onClose()}>
          <AiOutlineCloseCircle />
        </button>
        <div className='bg-white p-2 rounded'>
          <div className='bg-white py-8 px-6 shadow rounded-lg sm:px-10'>
            <form className='mb-0 space-y-6' onSubmit={handleSubmit}>
              <div>
                <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                  Nom de l'utilisateur
                </label>
                <div className='mt-1'>
                  <Select
                    id='username'
                    name='username'
                    options={userOptions}
                    value={selectedUser}
                    onChange={setSelectedUser}
                  />
                </div>
              </div>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                  Nom du matériel
                </label>
                <div className='mt-1'>
                  <Select
                    id='name'
                    name='name'
                    options={hardwareOptions.filter(option => option.status === false)}
                    value={selectedHardware}
                    onChange={setSelectedHardware}
                  />
                </div>
              </div>

              <button
                type='submit'
                className='bg-[#2680d4] flex text-white font-semibold rounded p-2 mt-4 justify-end place-self-end'
              >
                <AiOutlineSave /> Ajouter
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
