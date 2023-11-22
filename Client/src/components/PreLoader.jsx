import { FaSpinner } from 'react-icons/fa';

const PreLoader = () => {
  return (
    <>
    <div className="flex items-center justify-center mt-5">
      <FaSpinner className="animate-spin text-blue-500 mr-2" />
      <span>Chargement en cours...</span>
    </div>
  </>
  );
};

export default PreLoader;
