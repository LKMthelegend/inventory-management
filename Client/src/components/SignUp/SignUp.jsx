 import {useState} from 'react';
 import {Link, useNavigate} from 'react-router-dom';
 import styles from './Styles.module.css';
 import axios from 'axios';

const Signup = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState()

    const navigate = useNavigate();

    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        console.log(data);
        try {
            const url = "http://localhost:8080/api/utilisateurs";
            const {data:res} = await axios.post(url, data);
            navigate("/login")
            console.log(res.message);
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <=500) {
                setError(error.response.data.message)
            }
        }
    };
    return (
        <div className={styles.signup_container} >
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome back</h1>
                    <Link to="/login">
                        <button type='button' >Sign in</button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input 
                        type="email"
                        placeholder='Email'
                        name='email'
                        onChange={handleChange}
                        value={data.email}
                        required
                        className={styles.input} 
                        />
                        <input 
                        type="password"
                        placeholder='Password'
                        name='password'
                        onChange={handleChange}
                        value={data.password}
                        required
                        className={styles.input} 
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type='submit' className={styles.green_btn}>
                            sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;