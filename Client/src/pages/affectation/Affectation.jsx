import axios from "axios";
import * as XLSX from 'xlsx';
import Header from "../../components/Header"
import { FaSearch } from "react-icons/fa";
import {BsFiletypeXlsx} from "react-icons/bs";
import { useEffect, useState } from "react";
import PreLoader from "../../components/PreLoader";
import { MdOutlineAddCircle } from "react-icons/md";
import Pagination from "../../components/Pagination";
import AddAssignment from "./AddAssignment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoRocketSharp } from "react-icons/io5";


export default function Affectation() {
  const [loading, setLoading] = useState();
  const [showModal, setShowModal] = useState(false);
  const [affectations, setAffectations] = useState();
  const [OriginalAssignments, setOriginalAssignments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const perPage = 10;




  const fetchAssignment = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8080/assignments`);
      setAffectations(response.data);
      setOriginalAssignments(response.data);
      setLoading(false);

    } catch (error) {
      console.error('Erreur lors de la récupération des affectations!', error);
    }
  };

  useEffect(() => {
    fetchAssignment();
  }, []);

  useEffect(() => {
    // récupérer la valeur totale des pages depuis votre source de données
    if (affectations && affectations.length > 0) {
      const totalNumberOfPages = Math.ceil(affectations.length / perPage);
      setTotalPages(totalNumberOfPages);
    }
  }, [affectations, perPage]);

const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * perPage;
const paginatedAssignment = affectations ? affectations.slice(offset, offset + perPage) : [];

const handleSearchChange = (event) => {
  const query = event.target.value.toLowerCase();
  setSearchQuery(query);

  if (query === '') {
    setAffectations(OriginalAssignments); // Restaurer les données initiales si le champ de recherche est vide
  } else {
    const filteredAssignment = OriginalAssignments.filter((assignment) => {
      if (
        assignment.user &&
        assignment.user.username &&
        typeof assignment.user.username === 'string'
      ) {
        return (
          assignment.user.username.toLowerCase().includes(query) ||
          (assignment.hardware &&
            assignment.hardware.serialNumber &&
            assignment.hardware.serialNumber.toLowerCase().includes(query))
        );
      }
      return false;
    });
    setAffectations(filteredAssignment);
  }

  setCurrentPage(0);
};
  const handleAddAssignment = async (formData) => {
    try {
       await axios.post(`http://localhost:8080/assignments`, formData);
      setShowModal(false);
      toast.success('Enregistrer avec succès', {
        position: 'top-right',
        autoClose: 5000,
      });
      fetchAssignment();
    } catch (error) {
      console.error('Erreur lors de l\'affectation : ', error);
      toast.error('Une erreur s\'est produite lors de l\'affectation.', {
        position: 'top-right',
        autoClose: 3000,
      });
      throw error;
    }
  };

  // Libérer un matériel
  const handleRelease = async (assignmentId) => {
  try {
    await axios.delete(`http://localhost:8080/assignments/${assignmentId}`);

    // Rafraîchir la liste des affectations après la libération du matériel
    fetchAssignment();

    toast.success('Matériel libéré avec succès', {
      position: 'top-right',
      autoClose: 3000,
    });
  } catch (error) {
    console.error('Erreur lors de la libération du matériel : ', error);
    toast.error('Une erreur s\'est produite lors de la libération du matériel.', {
      position: 'top-right',
      autoClose: 3000,
    });
  }
};


const exportToExcel = () => {
  const dataToExport = affectations.map(({ user, hardware, assignmentDate }) => ({
    Utilisateur: user?.username || 'N/A',
    Matériel: hardware?.name || 'N/A',
    'Code IMMO': hardware?.name || 'N/A',
    Date: assignmentDate || 'indeterminé',
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // Appliquer un style à l'en-tête
  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: '2F5496' } }, // Couleur de fond
  };

  // Appliquer le style à la première ligne (en-tête)
  Object.keys(worksheet).forEach((cell) => {
    if (cell.startsWith('A1:') || cell.startsWith('B1:') || cell.startsWith('C1:')) {
      worksheet[cell].s = headerStyle;
    }
  });

  // Ajuster la largeur des colonnes
  const columnWidths = [
    { wch: 20 }, // User
    { wch: 20 }, // Hardware
    { wch: 15 }, // AssignmentDate
  ];

  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Affectations');

  // Générer un nom de fichier unique
  const fileName = `affectations_${Date.now()}.xlsx`;

  // Générer le fichier Excel et le télécharger
  XLSX.writeFile(workbook, fileName);
};


  

  return (
    <div>
      <Header title={"Listes des afféctations"} />
      <div className='pt-[25px] px-[25px] bg-[#f5f4f4]'>
        <div className='flex items-center justify-between rounded-[5px]'>
          <div className='flex items-center'>
            <input
              className='bg-[#ffffff] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal'
              placeholder='Rechercher utilisateur ou code IMMO...'
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
              <button 
              onClick={exportToExcel}
              className='bg-[#3498db] text-white h-[32px] rounded-[3px] flex items-center justify-center hover:bg-[#ffffff] hover:text-[#3498db] hover:border hover:border-black transition-all px-[30px] cursor-pointer'>
                <BsFiletypeXlsx size={25}/>
              </button>
      </div>
        </div>

        <table className="border border-gray-700 w-full text-left mt-5">
          <thead className='bg-[#161616] text-white'>
            <tr>
              <th className='capitalize px-3.5 py-2 cursor-pointer'>N°</th>
              <th className='capitalize px-3.5 py-2 cursor-pointer'>Utilisateur</th>
              <th className='capitalize px-3.5 py-2'>Matériel</th>
              <th className='capitalize px-3.5 py-2'>Code IMMO</th>
              <th className='capitalize px-3.5 py-2'>Date</th>
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
            ) : (paginatedAssignment.map((affectation, i) => (
              <tr key={affectation._id} className={i % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                <td className='px-3.5 py-2'> {i + 1} </td>
                <td className='px-3.5 py-2'>{affectation.user?.username || 'N/A'}</td>
                <td className='px-3.5 py-2'>{affectation.hardware?.name || 'N/A'}</td>
                <td className='px-3.5 py-2'>{affectation.hardware?.serialNumber || 'N/A'}</td>
                <td className='px-3.5 py-2'>{affectation.assignmentDate || 'indeterminé'}</td>
                <td className='py-2'>
                  <span className='flex'>
                    <button
                      onClick={() => handleRelease(affectation._id)}
                      className='flex justify-center items-center mx-2 px-3.5 text-[#AF08D2]'><IoRocketSharp size={20}/>

                    </button>
                  </span>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
        <Pagination pageCount={totalPages} handlePageClick={handlePageClick}/>
        </div>
        <AddAssignment isVisible={showModal} onClose={() => setShowModal(false)} handleAddAssignment={handleAddAssignment}/>
        <ToastContainer />

    </div>
  )
}
