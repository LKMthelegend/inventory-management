import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Compte() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    // Récupérer les données de l'utilisateur actuellement connecté
    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get('/api/utilisateurs/current');
                const { firstName, lastName, email } = response.data;
                setUserData({ ...userData, firstName, lastName, email });
            } catch (error) {
                console.error('Erreur lors du chargement des données utilisateur', error);
            }
        }

        fetchUserData();
    }, []); // Le tableau vide [] en tant que second argument pour useEffect s'exécute une seule fois, lors du montage initial

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/utilisateurs/update', userData);
            // Gestion des succès ou redirection après la mise à jour réussie
        } catch (error) {
            console.error('Erreur lors de la mise à jour du compte utilisateur', error);
            // Gestion des erreurs
        }
    };

  return (
    <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">Account Settings</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name:</label>
                    <input
                        id="firstName"
                        type="text"
                        value={userData.firstName}
                        onChange={handleChange}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name:</label>
                    <input
                        id="lastName"
                        type="text"
                        value={userData.lastName}
                        onChange={handleChange}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type='email'
                        value={userData.email}
                        onChange={handleChange}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Save Changes
                </button>
            </form>
        </div>
  )
}
