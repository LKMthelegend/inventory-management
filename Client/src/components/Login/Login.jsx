 import {useState} from 'react';
 import {Link} from 'react-router-dom';
 import axios from 'axios';
 import CoverImage from "../../assets/madagscar.jpg"

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState()

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/api/auth";
            const {data:res} = await axios.post(url, data);
            localStorage.setItem("token", res.data);
            window.location = "/"
            console.log(res.message);
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <=500) {
                setError(error.response.data.message)
            }
        }
    };
    return (
        <div className="w-full h-screen flex items-start">
            <div className="relative w-1/2 h-full flex flex-col">
                <div className="absolute top-[25%] left-[10%] flex flex-col">
                    <h1 className="text-4xl text-white font-extrabold my-3">Fond d'Intervention pour le Développement</h1>
                    <p className='text-4xl text-white font-extrabold my-4'>Madagascar</p>
                    <p className='text-l text-white font-normal'>" FID, Agence Nationale de mise en oeuvre des programmes de Protection Sociale "</p>
                </div>
                <img src={CoverImage} className='w-full h-full object-cover' alt='FID Madagascar'/>
            </div>
            <div className='w-1/2 h-full bg-[#F5F5F5] flex flex-col p-20 justify-between'>
                <h1 className='text-xl text-[#060606] font-semibold'>Bienvenue sur notre site de Gestion de parc informatique</h1>


                <div className='w-full flex flex-col max-w-[500px]'>
                    <div className='w-full flex flex-col mb-2'>
                     <form onSubmit={handleSubmit}>

                        <h3 className='text-3xl font-semibold mb-2'>Page de connexion</h3>
                        <p className='text-base mb-2'>Veuillez entrer vos informations.</p>
                    
                    <div className='w-full flex flex-col'>
                        <input 
                        type="email"
                        placeholder='Email'
                        name='email'
                        onChange={handleChange}
                        value={data.email}
                        required
                        className='w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none'/>
                        <input 
                        type='password'
                        placeholder='Mots de passe'
                        name='password'
                        value={data.password}
                        onChange={handleChange}
                        required
                        className='w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none'/>
                    </div>

                        <div className='w-full flex flex-col my-4'>
                            <button type='submit' className='w-full text-white my-2 bg-[#060606] rounded-md p-4 text-center flex items-center justify-center'>
                                Se connecter
                            </button>
                            {error && <p className='text-red-500'>{error}</p>}
                        </div>
                        </form>

                        <div className='w-full flex items-center justify-center relative py-2'>
                            <div className='w-full h-[1px] bg-black'>
                            </div>
                        </div>
                    
                    
                    </div>
                </div>

                <div className='w-full flex'>
                    <p className='font-sm font-normal text-[#060606]'>Mots de passe oublié? <span className='font-semibold underline underline-offset-2 cursor-pointer'>Récupérer votre compte</span></p>
                </div>
            </div>
        </div>


    );
};

export default Login;