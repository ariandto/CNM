import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const apiurl = 'http://localhost:5000'; 

const Navbar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);

    const handleBurgerClick = () => {
        setIsActive(!isActive);
    };

    const Logout = async () => {
        try {
            await axios.delete(`${apiurl}/logout`);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className="navbar is-light" role="navigation" aria-label="main navigation">
            <div className="container">
                <div className="navbar-brand">
                    <a className="navbar-item" href="#">
                        <img src="cnm.png" width="50" height="28" alt="logo" />
                    </a>

                    <a
                        onClick={handleBurgerClick}
                        role="button"
                        className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarBasicExample"
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                    <div className="navbar-start">
                        <a onClick={() => navigate('/home')} className="navbar-item">
                            Home
                        </a>

                        {/* Barang Masuk Dropdown */}
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">
                                Barang Masuk
                            </a>
                            <div className="navbar-dropdown">
                                <a onClick={() => navigate('/listbarangmasuk')} className="navbar-item">
                                    List Barang Masuk
                                </a>
                                <a onClick={() => navigate('/formbarangmasuk')} className="navbar-item">
                                    Form Input Barang Masuk
                                </a>
                                <a onClick={() => navigate('/editbarangmasuk')} className="navbar-item">
                                    Edit Barang Masuk
                                </a>
                            </div>
                        </div>

                        {/* Barang Keluar Dropdown */}
                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">
                                Barang Keluar
                            </a>
                            <div className="navbar-dropdown">
                                <a onClick={() => navigate('/listbarangkeluar')} className="navbar-item">
                                    List Barang Keluar
                                </a>
                                <a onClick={() => navigate('/formbarangkeluar')} className="navbar-item">
                                    Form Input Barang Keluar
                                </a>
                                <a onClick={() => navigate('/editbarangkeluar')} className="navbar-item">
                                    Edit Barang Keluar
                                </a>
                            </div>
                        </div>

                        <a onClick={() => navigate('/userlist')} className="navbar-item">
                            List User
                        </a>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <button onClick={Logout} className="button is-warning">
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
