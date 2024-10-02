import { createRoot } from 'react-dom/client'; // Import correct de createRoot
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Header from "../../components/Header"
import { FaSearch, FaCircle } from "react-icons/fa";
import { MdOutlineAddCircle, MdDelete, MdEdit } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import Select from 'react-select';
import PreLoader from "../../components/PreLoader";
import AddMateriel from './AddMateriel';
import Pagination from '../../components/Pagination';


export default function Materiel() {
  const [materiels, setMateriels] = useState([]);
  const [loading, setLoading] = useState();
  const selectedSoftwareValuesRef = useRef([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [originalHardwares, setOriginalHardwares] = useState([]); // Nouvel état pour stocker les données initiales
  const [totalPages, setTotalPages] = useState(0);
  const perPage = 10;

  



  useEffect(() => {
    fetchHardware();
  }, [])
  const fetchHardware = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/hardwares`);
      setMateriels(response.data);
      setOriginalHardwares(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des matériels", error);
    }
  };

  useEffect(() => {
  // récupérer la valeur totale des pages depuis votre source de données
  const totalNumberOfPages = Math.ceil(materiels.length / perPage);
  setTotalPages(totalNumberOfPages);
}, [materiels.length, perPage]);

const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * perPage;
  const paginatedHardwares = materiels.slice(offset, offset + perPage);

  // const pageCount = Math.ceil(employes.length / perPage);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setMateriels(originalHardwares); // Restaurer les données initiales si le champ de recherche est vide
    } else {
      const filteredHardwares = originalHardwares.filter(
        (logiciels) =>
          logiciels.name.toLowerCase().includes(query) || logiciels.serialNumber.toLowerCase().includes(query)
        );
      setMateriels(filteredHardwares);
    }

    setCurrentPage(0);
  };
// Créer un matériel
const addHardware = async (formData) => {
  try {
    const response = await axios.post('http://localhost:8080/hardwares', formData);

    // Vérification de la réponse après l'ajout
    console.log('Réponse après ajout :', response);

    if (response.data) {
      // Créer une nouvelle copie des matériels avec les données du nouvel élément ajouté
      const updatedMateriels = [...materiels, response.data];
      // Mettre à jour l'état local avec la nouvelle copie
      setMateriels(updatedMateriels);
      setShowModal(false);
      toast.success('Enregistrer avec succès', {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du matériel : ', error);
    toast.error('Une erreur s\'est produite lors de l\'ajout du service.', {
      position: 'top-right',
      autoClose: 3000,
    });
    throw error;
  }
};


  const fetchAvailableSoftware = async () => {
  try {
    const response = await axios.get('http://localhost:8080/softwares'); // Remplacez l'URL par celle de votre endpoint
    return response.data; // Supposons que response.data contient une liste de logiciels
  } catch (error) {
    console.error('Erreur lors de la récupération des logiciels disponibles : ', error);
    return []; // En cas d'erreur, retourner une liste vide ou gérer l'erreur selon vos besoins
  }
};

const handleEditHardware = async (hardware) => {
  try {
    const availableSoftware = await fetchAvailableSoftware();

    const selectedSoftwareOptions = availableSoftware.map((software) => ({
      value: software._id,
      label: software.name,
    }));

    const selectedSoftware = hardware.software.map((software) => ({
      value: software._id,
      label: software.name,
    }));


    const { value: formValues } = await Swal.fire({
      title: 'Modifier le matériel',
      html:
        `<input id="name" class="swal2-input" placeholder="Nom" value="${hardware.name}">` +
        `<input id="type" class="swal2-input" placeholder="Type" value="${hardware.type}">` +
        `<input id="serialNumber" class="swal2-input" placeholder="Numéro de série" value="${hardware.serialNumber}">` +
        `<div id="software-select"></div>`,
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler',
      focusConfirm: false,
      didOpen: () => {
        const selectContainer = document.getElementById('software-select');

        createRoot(selectContainer).render(
          <Select
            options={selectedSoftwareOptions}
            defaultValue={selectedSoftware}
            isMulti
            onChange={(selectedValues) => {
              selectedSoftwareValuesRef.current = selectedValues;
            }}
          />
        );
      },
      preConfirm: () => {
        return {
          name: document.getElementById('name').value,
          type: document.getElementById('type').value,
          serialNumber: document.getElementById('serialNumber').value,
          software: selectedSoftwareValuesRef.current.map(option => option.value), // Modification ici
        };
      }
    });


    if (formValues) {
      const response = await axios.put(`http://localhost:8080/hardwares/${hardware._id}`, formValues);

      if (response.status === 200) {
        Swal.fire('Modifié !', 'Le matériel a été modifié avec succès.', 'success');
        fetchHardware();
      }
    }
  } catch (error) {
    console.error('Erreur lors de la modification du matériel : ', error);
    Swal.fire('Erreur', 'Une erreur est survenue lors de la modification du matériel.', 'error');
  }
};
const handleDelete = async (materiel) => {
  if (materiel.status) {
    toast.error("Vous ne pouvez pas supprimer ce matériel car il est en cours d'utilisation.", {
      position: 'top-right',
      autoClose: 5000,
    });
    return;
  }

    Swal.fire({
      title: `Etes vous sur de vouloir supprimer ${materiel.name}?`,
      text: "Cette action est irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/hardwares/${materiel._id}`);
          setMateriels(materiels.filter((p) => p._id !== materiel._id));
          fetchHardware();
          Swal.fire('Suppession efféctuée', 'avec succès!');
        } catch (error) {
          console.error("Erreur lors de la suppression de l'employé :", error);
          Swal.fire('Erreur lors de la suppression', 'Une erreur s\'est produite.', 'error');
        }
      }
    });
  };

  return (
    <>
    <div>
      <Header title={"Listes des matériels"} />
      <div className='pt-[25px] px-[25px] bg-[#f5f4f4]'>
        <div className='flex items-center justify-between rounded-[5px]'>
          <div className='flex items-center'>
            <input
              className='bg-[#ffffff] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal'
              placeholder='Rechercher code IMMO ou nom ...'
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className='bg-[#1a1a1b] h-[40px] px-[14px] flex items-center justify-center cursor-pointer rounded-tr-[5px] rounded-br-[5px]'>
              <FaSearch color='white' />
            </div>
          </div>
          <div className='flex items-center justify-end gap-[15px] relative'>
            <button
              onClick={() => setShowModal(true)}
              className='bg-[#2fa50b] text-white h-[32px] rounded-[3px] flex items-center justify-center hover:bg-[#ffffff] hover:text-[#2fa50b] hover:border hover:border-black transition-all px-[30px] cursor-pointer'
              alt='Ajouter nouvelle région'
            >
              <MdOutlineAddCircle size={20} />
            </button>
          </div>
        </div>
        
        <table className="border border-gray-700 w-full text-left mt-5">
          <thead className='bg-[#161616] text-white'>
            <tr>
              <th className='capitalize px-3.5 py-2 cursor-pointer'>N°</th>
              <th className='capitalize px-3.5 py-2 cursor-pointer'>Nom</th>
              <th className='capitalize px-3.5 py-2'>Type</th>
              <th className='capitalize px-3.5 py-2'>Code IMMO</th>
              <th className='capitalize px-3.5 py-2'>Date</th>
              <th className='capitalize px-3.5 py-2'>Status</th>
              <th className='capitalize px-3.5 py-2'>Utilisateur</th>
              <th className='capitalize px-3.5 py-2'>Logiciels</th>
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
            paginatedHardwares.map((hardware, i) => (
              <tr key={hardware._id} className={i % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                <td className='px-3.5 py-2'> {i + 1} </td>
                <td className='px-3.5 py-2'> {hardware.name} </td>
                <td className='px-3.5 py-2'> {hardware.type} </td>
                <td className='px-3.5 py-2'> {hardware.serialNumber || 'Non défini'} </td>
                <td className='px-3.5 py-2'> {new Date(hardware.date).toLocaleDateString('fr-FR')} </td>
                <td className='px-3.5 py-2'> {hardware.status ? (
                      <FaCircle color='red' />
                    ) : (
                      <FaCircle color='green' />
                    )} 
                </td>
                <td className='px-3.5 py-2'> {hardware.user ? hardware.user.username : 'Non assigné'} </td>
                <td className='px-3.5 py-2'>
                  <ul>
                    {hardware.software.map((software, index) => (
                      <span key={software._id}>
                      {software.name}
                      {index !== hardware.software.length - 1 ? ', ' : ''}
                    </span>
                    ))}
                  </ul>
                </td>
                <td className='py-2'>
                  <span className='flex'>
                    <button
                      onClick={() => handleEditHardware(hardware)}
                      className='flex justify-center items-center mx-2 px-3.5 text-blue-600'><MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(hardware)}
                      className='flex justify-center items-center mx-2 px-3.5 text-red-600'
                      // disabled={hardware.status}
                      ><MdDelete size={20} />
                    </button>
                  </span>
                </td>
              </tr>
            )
            )
            )
        }
          </tbody>
        </table>
        <Pagination pageCount={totalPages} handlePageClick={handlePageClick} />
    </div>
    <AddMateriel isVisible={showModal} onClose={() => setShowModal(false)} addHardware={addHardware} materiels={materiels}/>
    <ToastContainer />
    </div>
    </>
  )
}
