import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiOutlineCloseCircle, AiOutlineSave } from 'react-icons/ai';


export default function AddMateriel({ isVisible, onClose, addHardware, materiels }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);

  const isSerialNumberUnique = (serialNumber) => {
    return !materiels.some((hardware) => hardware.serialNumber === serialNumber);
  };

  useEffect(() => {
    if (isVisible) {
      // Effacez les valeurs des champs lorsque le modal est ouvert
      setName('');
      setType('');
      setSerialNumber('');
      setSelectedSoftware([]);
    }
    fetchAvailableSoftware();
  }, [isVisible]); 

  const fetchAvailableSoftware = async () => {
    try {
      const response = await axios.get('http://localhost:8080/softwares');
      const options = response.data.map((software) => ({
        value: software._id,
        label: software.name,
      }));
      setSoftwareOptions(options);
    } catch (error) {
      console.error('Erreur lors de la récupération des logiciels disponibles : ', error);
    }
  };

  const handleAddHardware = async (e) => {
    e.preventDefault();
    if (!isSerialNumberUnique(serialNumber)) {
      toast.error('Le code IMMO existe déjà.');
      return;
    }
    const formData = {
      name,
      type,
      serialNumber,
      software: selectedSoftware.map((option) => option.value),
    };

    try {
        addHardware(formData);
    } catch (error) {
          console.error('Erreur lors de l\'insertion du logiciel:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center shadow-lg'>
            <div className='w-[600px] flex flex-col'>
                <button className='text-white text-2xl place-self-end'
                onClick={()=> onClose()}><AiOutlineCloseCircle/></button>
                <div className='bg-white p-2 rounded'>
                    <div className='bg-white py-8 px-6 shadow rounded-lg sm:px-10'>
                        <form onSubmit={handleAddHardware} className='mb-0 space-y-6'>

                            <div>
                              <label htmlFor="name" className='block text-sm font-medium text-gray-700'>Nom du matériel</label>
                              <div className='mt-1'>
                                <input id='name' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete='off' required/>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="type" className='block text-sm font-medium text-gray-700'>Type</label>
                              <div className='mt-1'>
                                <input id='type' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="type" value={type} onChange={(e) => setType(e.target.value)}  autoComplete='off' required/>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="serialNumber" className='block text-sm font-medium text-gray-700'>Code IMMO</label>
                              <div className='mt-1'>
                                <input id='serialNumber' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)}  autoComplete='off' required />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="software" className='block text-sm font-medium text-gray-700'>Logiciel(s)</label>
                              <div className='mt-1'>
                                <Select
                                    id='software'
                                    name='software'
                                    options={softwareOptions}
                                    value={selectedSoftware}
                                    isMulti
                                    onChange={setSelectedSoftware}
                                />
                              </div>
                            </div>
                            

                        <div className="flex justify-end">
                <button
                  type='submit'
                  className='flex text-white font-semibold rounded p-2 mt-4 bg-[#2680d4]'
                >
                  <AiOutlineSave className="mr-2" /> Ajouter
                </button>
              </div>
                        </form>
                        </div>

                </div>
            </div>
        </div>

  );
}
