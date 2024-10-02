import {useState} from 'react'
import {AiOutlineCloseCircle, AiOutlineSave} from "react-icons/ai";

function AddService({isVisible, onClose, onAddService}) {
  const initialFormData = {
    name: '',
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
      onAddService(formData);
    } catch (error) {
      console.error('Erreur lors de la création de du service:', error);
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
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700'>Nom du service</label>
                            <div className='mt-1'>
                            <input id='name' className='w-full border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500' type="text" name="name" value={formData.name} onChange={handleChange} autoComplete='off' />
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

export default AddService
