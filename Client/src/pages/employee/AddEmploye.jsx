import { useState, useEffect } from 'react';
import { AiOutlineCloseCircle, AiOutlineSave } from 'react-icons/ai';
import axios from 'axios';

export default function AddEmploye({isVisible, onClose, onAddEmployee}) {
  const initialFormData = {
    username: '',
    email: '',
    adress: '',
    telephone: '',
    department: '',
  };
    const [formData, setFormData] = useState(initialFormData);
    const [services, setServices] = useState([]);

  const getAllServices = async () => {
    const res = await axios.get(`http://localhost:8080/departments`);
    setServices(res.data);
  };

  useEffect(() => {
    getAllServices();
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: value,
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();

     try {
    if (!formData.department) {
      formData.department = null;
    }
    onAddEmployee(formData);
  } catch (error) {
    console.error('Erreur lors de l\'insertion de l\'employée:', error);
  }
    setFormData(initialFormData);
  };

    if (!isVisible) return null;
  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center shadow-lg'>
            <div className='w-[600px] flex flex-col'>
                <button className='text-white text-2xl place-self-end'
                onClick={()=> onClose()}><AiOutlineCloseCircle/></button>
                <div className='bg-white p-2 rounded'>
                    <div className='bg-white py-8 px-6 shadow rounded-lg sm:px-10'>
                        <form onSubmit={handleSubmit} className='mb-0 space-y-6'>

                            <div>
                              <label htmlFor="username" className='block text-sm font-medium text-gray-700'>Nom de l'employée</label>
                              <div className='mt-1'>
                                <input id='username' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="username" value={formData.username} onChange={handleChange} autoComplete='off' required/>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
                              <div className='mt-1'>
                                <input id='email' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="email" value={formData.email} onChange={handleChange} autoComplete='off' required />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="telephone" className='block text-sm font-medium text-gray-700'>Téléphone</label>
                              <div className='mt-1'>
                                <input id='telephone' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="telephone" value={formData.telephone} onChange={handleChange} autoComplete='off' required/>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="adress" className='block text-sm font-medium text-gray-700'>Addresse</label>
                              <div className='mt-1'>
                                <input id='adress' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="adress" value={formData.adress} onChange={handleChange} autoComplete='off' required/>
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                Service
                              </label>
                              <div className="mt-1">
                                <select
                                  id="department"
                                  className="w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                  name="department"
                                  required
                                  value={formData.department} // Ajoutez cette ligne pour lier la valeur du select à formData
                                  onChange={handleChange} // Assurez-vous que handleChange est bien défini pour mettre à jour formData
                                >
                                  <option value="">Sélectionnez un service</option>
                                  {services.map((service) => (
                                  <option key={service._id} value={service._id}>
                                    {service.name}
                                  </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* <div>
                              <label htmlFor="department" className='block text-sm font-medium text-gray-700'>Service</label>
                              <div className='mt-1'>
                                 <input id='department' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="department" value={{name}}   autoComplete='off' />
                              </div>
                            </div> */}
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
  )
}
