import { useEffect, useState } from "react";
import Header from "../../components/Header"
import { FaSearch } from "react-icons/fa";
import { MdOutlineAddCircle, MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import PreLoader from "../../components/PreLoader";
import Pagination from "../../components/Pagination";
import AddLogiciel from "./AddLogiciel";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Logiciel() {
  const [logiciels, setLogiciels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState()
  const [currentPage, setCurrentPage] = useState(0);
  const [originalSoftwares, setOriginalSoftwares] = useState([]); // Nouvel état pour stocker les données initiales
  const [totalPages, setTotalPages] = useState(0);
  const perPage = 10;



  const fetchSoftware  = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/softwares`);
      setLogiciels(response.data);
      setOriginalSoftwares(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des logiciels", error);
    }
    };
  
  useEffect(() => {
    fetchSoftware();
  }, []);

  useEffect(() => {
  // récupérer la valeur totale des pages depuis votre source de données
  const totalNumberOfPages = Math.ceil(logiciels.length / perPage);
  setTotalPages(totalNumberOfPages);
}, [logiciels.length, perPage]);

const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * perPage;
  const paginatedSoftwares = logiciels.slice(offset, offset + perPage);

  // const pageCount = Math.ceil(employes.length / perPage);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setLogiciels(originalSoftwares); // Restaurer les données initiales si le champ de recherche est vide
    } else {
      const filteredSoftwares = originalSoftwares.filter(
        (logiciels) =>
          logiciels.name.toLowerCase().includes(query)
        );
      setLogiciels(filteredSoftwares);
    }

    setCurrentPage(0);
  };

  const handleAddLogiciel = async (formData) => {
    try {
      console.log("Logiciel", formData);
      // Envoyer les données au serveur en utilisant Axios
      const response = await axios.post('http://localhost:8080/softwares', formData);
      console.log('Nouveau logiciel ajouté:', response.data);

      // Fermer le modal
      setShowModal(false);

      // Afficher une notification de succès
      toast.success('Enregistrer avec succès', {
        position: 'top-right',
        autoClose: 5000,
      });

      // Mettre à jour la liste des régions
      fetchSoftware();
    } catch (error) {
      // Gérer les erreurs, par exemple, afficher une notification d'erreur en cas d'échec.
      toast.error('Une erreur s\'est produite lors de l\'ajout du service.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  //Editer
  const handleEdit = async (logiciel) => {
  const { value: formValues } = await Swal.fire({
    title: 'Modifier le logiciel',
    html: `<input id="swal-input1" class="swal2-input" value="${logiciel.name}">`+
    `<input id="swal-input2" class="swal2-input" value="${logiciel.version}">`+
    `<input id="swal-input3" class="swal2-input" value="${logiciel.licence}">`,
    showCancelButton: true,
    confirmButtonText: 'Modifier',
    cancelButtonColor: '#d33',
    cancelButtonText: 'Annuler',
    focusConfirm: false,
    preConfirm: () => {
      return {
        name: document.getElementById('swal-input1').value,
        version: document.getElementById('swal-input2').value,
        licence: document.getElementById('swal-input3').value,
      };
    },
  });

  if (formValues && formValues.name && formValues.version && formValues.licence ) {
    try {
      // Envoyez les données mises à jour au serveur en utilisant Axios
      await axios.put(`http://localhost:8080/softwares/${logiciel._id}`, formValues);

      // Mettez à jour la liste des régions
      fetchSoftware();

      Swal.fire('Mise à jour réussie', '', 'success');
    } catch (error) {
      // Gérez les erreurs, par exemple, affichez une notification d'erreur en cas d'échec.
      Swal.fire('Erreur lors de la mise à jour', 'Une erreur s\'est produite lors de la mise à jour de la région.', 'error');
    }
  }
};
//Suppression
const handleDelete = async (logiciel) => {
  Swal.fire({
  title: `Etes vous sur de vouloir supprimer ${logiciel.name}?`,
  text: "Cette action est irreversible!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Oui, supprimer!',
  cancelButtonText: "Annuler",
}).then(async (result) => {
    if (result.isConfirmed){
      try {
        const response = await axios.delete(`http://localhost:8080/softwares/${logiciel._id}`);
        if (response.status === 200 || response.status === 204) {
          // Suppression réussie, mettre à jour l'état local des logiciels après la suppression
          const updatedLogiciels = logiciels.filter((p) => p._id !== logiciel._id);
          setLogiciels(updatedLogiciels);
          Swal.fire(
            'Suppression effectuée',
            'avec succès!',
            'success'
          );
        } else {
          // Gestion d'une réponse inattendue du serveur lors de la suppression
          console.error('Réponse inattendue lors de la suppression du logiciel:', response);
          Swal.fire(
            'Erreur inattendue',
            'Une erreur inattendue s\'est produite lors de la suppression du logiciel.',
            'error'
          );
        }
      } catch (error) {
        // Gérer les erreurs survenues pendant la requête Axios
        console.error("Erreur lors de la suppression du logiciel", error);
        Swal.fire(
          'Erreur lors de la suppression',
          'Une erreur s\'est produite lors de la suppression du logiciel.',
          'error'
        );
      }
    }
  })
};
  return (
    <>
    <div>
      <Header title={"Listes des logiciels"} />
      <div className='pt-[25px] px-[25px] bg-[#f5f4f4]'>
        <div className='flex items-center justify-between rounded-[5px]'>
          <div className='flex items-center'>
            <input
              className='bg-[#ffffff] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal'
              placeholder='Rechercher nom du logiciel...'
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
              <th className='capitalize px-3.5 py-2'>Version</th>
              <th className='capitalize px-3.5 py-2'>Licence</th>
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
            ) : (paginatedSoftwares.map((logiciel, i) => (
              <tr key={logiciel._id} className={i % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                <td className='px-3.5 py-2'> {i + 1} </td>
                <td className='px-3.5 py-2'> {logiciel.name} </td>
                <td className='px-3.5 py-2'> {logiciel.version} </td>
                <td className='px-3.5 py-2'> {logiciel.licence ? logiciel.licence : 'Gratuit'} </td>
                <td className='py-2'>
                  <span className='flex'>
                    <button
                      onClick={() => handleEdit(logiciel)}
                      className='flex justify-center items-center mx-2 px-3.5 text-blue-600'><MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(logiciel)}
                      className='flex justify-center items-center mx-2 px-3.5 text-red-600'><MdDelete size={20} />
                    </button>
                  </span>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
        <Pagination pageCount={totalPages} handlePageClick={handlePageClick}/>
    </div>
    <AddLogiciel isVisible={showModal} onClose={() => setShowModal(false)} onAdd={handleAddLogiciel}/>
    <ToastContainer />
    </div>
    </>
  )
}
