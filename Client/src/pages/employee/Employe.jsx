import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { FaSearch } from "react-icons/fa";
import { MdOutlineAddCircle, MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import AddEmployee from "./AddEmploye";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "../../components/Pagination";
import PreLoader from "../../components/PreLoader";

export default function Employe() {
  const [employes, setEmployes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalEmployes, setOriginalEmployes] = useState([]); // Nouvel état pour stocker les données initiales
  const [totalPages, setTotalPages] = useState(0);
  const perPage = 10;
  const [loading, setLoading] = useState()
  

useEffect(() => {
  // récupérer la valeur totale des pages depuis votre source de données
  const totalNumberOfPages = Math.ceil(employes.length / perPage);
  setTotalPages(totalNumberOfPages);
}, [employes.length, perPage]);

  

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/users`);
      const employesData = response.data;

      const serviceResponses = await Promise.all(
        employesData.map(async (employe) => {
          if (employe.department) {
            try {
              return await axios.get(`http://localhost:8080/departments/${employe.department._id}`);
            } catch (error) {
              console.error(`Erreur lors de la récupération du département pour l'employé ${employe._id}`, error);
              throw error;
            }
          } else {
            console.warn(`Department is undefined for employee ${employe._id}. Skipping.`);
            return null;
          }
        })
      );

      const employesWithService = employesData.map((employe, index) => {
        const serviceResponse = serviceResponses[index];
        if (serviceResponse && serviceResponse.data) {
          return {
            ...employe,
            department: serviceResponse.data,
            _id: employe._id || index.toString(),
          };
        } else {
          console.warn(`Department data is null for employee ${employe._id}. Skipping.`);
          return employe;
        }
      });

      setEmployes(employesWithService);
      setOriginalEmployes(employesWithService); // Stockage des données initiales
      setLoading(false); // Fin du chargement, masquer le PreLoader

   } catch (error) {
      handleError(error, "Erreur lors de la récupération des employées");
      setLoading(false); // En cas d'erreur, masquer le PreLoader
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleError = (error, message) => {
    console.error(message, error);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * perPage;
  const paginatedEmployes = employes.slice(offset, offset + perPage);

  // const pageCount = Math.ceil(employes.length / perPage);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === '') {
      setEmployes(originalEmployes); // Restaurer les données initiales si le champ de recherche est vide
    } else {
      const filteredEmployees = originalEmployes.filter(
        (employe) =>
          employe.username.toLowerCase().includes(query) ||
          employe.email.toLowerCase().includes(query)
      );
      setEmployes(filteredEmployees);
    }

    setCurrentPage(0);
  };


  const handleDelete = async (employe) => {
    try {
      const userId = employe._id;
    const response = await axios.get(`http://localhost:8080/check-user/${userId}`);
    const affectedHardware = response.data;

    if (affectedHardware.length > 0) {
      Swal.fire({
        title: 'Erreur de suppression',
        text: 'Cet utilisateur est affecté à un matériel. Veuillez retirer l\'affectation avant de le supprimer.',
        icon: 'error',
      });
    } else {
      const confirmDelete = await Swal.fire({
        title: `Êtes-vous sûr de vouloir supprimer ${employe.username}?`,
        text: 'Cette action est irréversible!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer!',
        cancelButtonText: 'Annuler',
      });

      if (confirmDelete.isConfirmed) {
        await axios.delete(`http://localhost:8080/users/${userId}`);
        setEmployes(employes.filter((u) => u._id !== employe._id));
        Swal.fire('Suppression effectuée', 'Utilisateur supprimé avec succès!', 'success');
      }
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    Swal.fire('Erreur lors de la suppression', 'Une erreur s\'est produite.', 'error');
  }
  };

//EDITER un employé
  const [services, setServices] = useState([]);

  const getAllServices = async () => {
    const res = await axios.get(`http://localhost:8080/departments`);
    setServices(res.data);
  };

  useEffect(() => {
    getAllServices();
  }, []);
const handleEdit = async (employe) => {
  try {
   
    const selectedDepartmentId = employe.department ? employe.department._id : null;
    const { value: formValues, isDismissed } = await Swal.fire({
      title: 'Modifier l\'employé',
      html: `<input id="swal-input1" class="swal2-input" value="${employe.username}" required>
            <input id="swal-input2" class="swal2-input" value="${employe.email}" required> 
            <input id="swal-input3" class="swal2-input" value="${employe.telephone}" required>
            <input id="swal-input4" class="swal2-input" value="${employe.adress}" required>
            <select id="swal-input5" class="swal2-input" required>
          <option value="">Selectionner un service</option>
          ${services.map((department) => `
            <option value="${department._id}" ${selectedDepartmentId === department._id ? 'selected' : ''}>
              ${department.name}
            </option>
          `).join('')}
        </select>`,
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Annuler',
      focusConfirm: false,
      preConfirm: () => {
        const usernameInput = document.getElementById('swal-input1');
        const emailInput = document.getElementById('swal-input2');
        const telephoneInput = document.getElementById('swal-input3');
        const adressInput = document.getElementById('swal-input4');
        const departmentSelect = document.getElementById('swal-input5');

        if (usernameInput && emailInput && telephoneInput && adressInput && departmentSelect) {
          if (usernameInput.value && emailInput.value && telephoneInput.value && adressInput.value) {
            if (departmentSelect.value !== "") {
              return {
                username: usernameInput.value,
                email: emailInput.value,
                telephone: telephoneInput.value,
                adress: adressInput.value,
                department: departmentSelect.value,
              };
            } else {
              Swal.showValidationMessage('Veuillez sélectionner un service.');
              return false;
            }
          } else {
            Swal.showValidationMessage('Veuillez remplir tous les champs.');
            return false;
          }
        } else {
          return false;
        }
      },
    });

    if (isDismissed) {
      return;
    }

    if (formValues) {
      let isValid = true;

      if (!formValues.username) {
        Swal.showValidationMessage('Le champ Nom est requis.');
        isValid = false;
      }

      if (!formValues.email) {
        Swal.showValidationMessage('Le champ Email est requis.');
        isValid = false;
      }

      if (!formValues.telephone) {
        Swal.showValidationMessage('Le champ Téléphone est requis.');
        isValid = false;
      }

      if (!formValues.adress) {
        Swal.showValidationMessage('Le champ Adresse est requis.');
        isValid = false;
      }

      if (formValues.department === null || formValues.department === '') {
        Swal.showValidationMessage('Veuillez sélectionner un service.');
        isValid = false;
      }

      if (isValid) {
        try {
          const updatedEmployee = {
            username: formValues.username,
            email: formValues.email,
            telephone: formValues.telephone,
            adress: formValues.adress,
            department: formValues.department,
          };

          await axios.put(`http://localhost:8080/users/${employe._id}`, updatedEmployee);
          fetchData();
          Swal.fire('Mise à jour réussie', '', 'success');
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'employé :", error);
          Swal.fire('Erreur lors de la mise à jour', 'Une erreur s\'est produite lors de la mise à jour.', 'error');
        }
      } else {
        console.warn('Champs requis non remplis');
      }
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé :", error);
  }
};

  const handleAddEmployee = async (formData) => {
    try {
      await axios.post('http://localhost:8080/users', formData);
      setShowModal(false);
      fetchData();

      toast.success('Enregistrement réussi', {
        position: 'top-right',
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé :", error);
      toast.error('Une erreur s\'est produite lors de l\'ajout de l\'employé.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div>
      <Header title={"Listes des employés"} />
      <div className='pt-[25px] px-[25px] bg-[#f5f4f4]'>
        <div className='flex items-center justify-between rounded-[5px]'>
          <div className='flex items-center'>
            <input
              className='bg-[#ffffff] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal'
              placeholder='Rechercher nom ou email...'
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
              <th className='capitalize px-3.5 py-2'>Email</th>
              <th className='capitalize px-3.5 py-2'>Telephone</th>
              <th className='capitalize px-3.5 py-2'>Adresse</th>
              <th className='capitalize px-3.5 py-2'>Service</th>
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
            paginatedEmployes.map((employe, i) => (
              <tr key={employe._id} className={i % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                <td className='px-3.5 py-2'> {i + 1} </td>
                <td className='px-3.5 py-2'> {employe.username} </td>
                <td className='px-3.5 py-2'> {employe.email} </td>
                <td className='px-3.5 py-2'> {employe.telephone || 'Non défini'} </td>
                <td className='px-3.5 py-2'> {employe.adress || 'Non défini'} </td>
                <td className='px-3.5 py-2'> {employe.department ? employe.department.name : 'Non assigné'}</td>
                <td className='py-2'>
                  <span className='flex'>
                    <button
                      onClick={() => handleEdit(employe)}
                      className='flex justify-center items-center mx-2 px-3.5 text-blue-600'><MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(employe)}
                      className='flex justify-center items-center mx-2 px-3.5 text-red-600'><MdDelete size={20} />
                    </button>
                  </span>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
        {/* Composant de pagination */}
      <Pagination pageCount={totalPages} handlePageClick={handlePageClick}/>
      </div>
      <AddEmployee isVisible={showModal} onClose={() => setShowModal(false)} onAddEmployee={handleAddEmployee}/>
      <ToastContainer />
    </div>
  );
}
