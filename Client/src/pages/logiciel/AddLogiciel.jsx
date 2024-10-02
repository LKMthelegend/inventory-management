import { useState } from 'react';
import { AiOutlineCloseCircle, AiOutlineSave } from 'react-icons/ai';

export default function AddLogiciel({isVisible, onClose, onAdd}) {    
const initialFormData = {
    name: '',
    version: '',
    licence: '',
  };
    const [formData, setFormData] = useState(initialFormData);

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
    onAdd(formData);
  } catch (error) {
    console.error('Erreur lors de l\'insertion du logiciel:', error);
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
                              <label htmlFor="name" className='block text-sm font-medium text-gray-700'>Nom du logiciel</label>
                              <div className='mt-1'>
                                <input id='name' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="name" value={formData.name} onChange={handleChange} autoComplete='off' required/>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="version" className='block text-sm font-medium text-gray-700'>Version</label>
                              <div className='mt-1'>
                                <input id='version' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="version" value={formData.version} onChange={handleChange}  autoComplete='off' required/>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="licence" className='block text-sm font-medium text-gray-700'>Licence</label>
                              <div className='mt-1'>
                                <input id='licence' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="licence" value={formData.licence} onChange={handleChange}  autoComplete='off' />
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

  )
}
