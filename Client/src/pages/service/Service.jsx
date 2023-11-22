import axios from "axios";
import { useEffect, useState } from "react"
import Header from "../../components/Header";
import { FaSearch } from "react-icons/fa";
import { MdOutlineAddCircle, MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddService from "./AddService";
import PreLoader from "../../components/PreLoader";


export default function Service() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState();


  const getAllServices = async () => {
    setLoading(true);
    const res = await axios.get(`http://localhost:8080/departments`);
    setServices(res.data);
    setLoading(false);
  };

  useEffect(() => {
    getAllServices();
  }, []);

  const handleDelete = async (department) => {
    // setRegions(regions.filter((p) => p._id !== region._id));
    // await axios.delete(`http://localhost:8080/regions/${region._id}`);
     
Swal.fire({
  title: `Etes vous sur de vouloir supprimer ${department.name}?`,
  text: "Cette action est irreversible!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Oui, supprimer!',
  cancelButtonText: "Annuler",
}).then(async (result) => {
    if (result.isConfirmed) {
      await axios.delete(`http://localhost:8080/departments/${department._id}`);
      setServices(services.filter((p) => p._id !== department._id));
    Swal.fire(
      'Suppession efféctuée',
      'avec succès!'
    )
  }
})
  };

  //Editer
  const handleEdit = async (department) => {
  const { value: formValues } = await Swal.fire({
    title: 'Modifier le service',
    html: `<input id="swal-input1" class="swal2-input" value="${department.name}">`,
    showCancelButton: true,
    confirmButtonText: 'Modifier',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Annuler',
    focusConfirm: false,
    preConfirm: () => {
      return {
        name: document.getElementById('swal-input1').value,
      };
    },
  });

  if (formValues && formValues.name) {
    try {
      // Envoyez les données mises à jour au serveur en utilisant Axios
      await axios.put(`http://localhost:8080/departments/${department._id}`, formValues);

      // Mettez à jour la liste des régions
      getAllServices();

      Swal.fire('Mise à jour réussie', '', 'success');
    } catch (error) {
      // Gérez les erreurs, par exemple, affichez une notification d'erreur en cas d'échec.
      Swal.fire('Erreur lors de la mise à jour', 'Une erreur s\'est produite lors de la mise à jour de la région.', 'error');
    }
  }
};

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter regions
  const filteredServices = services.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEService = async (formData) => {
    try {
      console.log("service", formData);
      // Envoyer les données au serveur en utilisant Axios
      const response = await axios.post('http://localhost:8080/departments', formData);
      console.log('Nouveau service ajouté:', response.data);

      // Fermer le modal
      setShowModal(false);

      // Afficher une notification de succès
      toast.success('Enregistrer avec succès', {
        position: 'top-right',
        autoClose: 5000,
      });

      // Mettre à jour la liste des régions
      getAllServices();
    } catch (error) {
      // Gérer les erreurs, par exemple, afficher une notification d'erreur en cas d'échec.
      toast.error('Une erreur s\'est produite lors de l\'ajout du service.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  return (
    <div>
      <Header title={"Listes des services"} />
            <div className='pt-[25px] px-[25px] bg-[#f5f4f4]'>
            <div className='flex items-center justify-between rounded-[5px]'>
                <div className='flex items-center'>
                    <input className='bg-[#ffffff] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal' placeholder='Rechercher le nom du service...'
                    value={searchQuery}
                    onChange={handleSearchChange} 
                    />
                    <div className='bg-[#1a1a1b] h-[40px] px-[14px] flex items-center justify-center cursor-pointer rounded-tr-[5px] rounded-br-[5px]'>
                        <FaSearch color='white'/>
                    </div>
                </div>
            <div className='flex items-center justify-end gap-[15px] relative'>
                <button 
                onClick={()=> setShowModal(true)}
                className='bg-[#2fa50b] text-white h-[32px] rounded-[3px] flex items-center justify-center hover:bg-[#ffffff] hover:text-[#2fa50b] hover:border hover:border-black transition-all px-[30px] cursor-pointer' alt='Ajouter nouvelle région' >
                    <MdOutlineAddCircle size={20}  />
                </button>
            </div>
            </div>

        <table className="border border-gray-700 w-full text-left mt-5">
          <thead className='bg-[#161616] text-white'>
            <tr>
              <th className='capitalize px-3.5 py-2 cursor-pointer'>N°</th>
              <th className='capitalize px-3.5 py-2 cursor-pointer'>Nom</th>
              <th className='capitalize px-3.5 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
    <tr>
      <td>
        <PreLoader />
      </td>
    </tr>
  ) : (
            filteredServices.map((department, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                <td className='px-3.5 py-2'> {i + 1} </td>
                <td className='px-3.5 py-2'> {department.name} </td>
                <td className='py-2'>
                  <span className='flex'>
                <button
                onClick={() => handleEdit(department)}
                className='flex justify-center items-center mx-2 px-3.5 text-blue-600'><MdEdit size={20}/></button>
                <button
                onClick={() => handleDelete(department)}
                className='flex justify-center items-center mx-2 px-3.5 text-red-600'><MdDelete size={20}/></button>
            </span>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
            </div>
            <AddService isVisible={showModal} 
            onClose={()=> 
              setShowModal(false) } 
              onAddService={handleAddEService} 
              />
              <ToastContainer />
    </div>
  )
}