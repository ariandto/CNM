import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiurl } from './api/config';
import jwtDecode from 'jwt-decode';

const Navbar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState({ masuk: false, keluar: false, settings: false });
    const [userInfo, setUserInfo] = useState({ name: '', role: '' });

    const handleBurgerClick = () => {
        setIsActive(!isActive);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserInfo({ name: decoded.name, role: decoded.role });
        }
    }, []);

    const handleDropdownClick = (menu) => {
        setIsDropdownOpen({
            ...isDropdownOpen,
            [menu]: !isDropdownOpen[menu],
        });
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
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a onClick={() => navigate('/home')} className="flex-shrink-0">
                            <img src="cnm.png" alt="logo" className="h-16 w-16" />
                        </a>
                        <div className="hidden md:flex space-x-4 ml-10">
                            <a
                                onClick={() => navigate('/home')}
                                className="text-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                            >
                                Home
                            </a>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700 font-medium">
                                    {userInfo.name} ({userInfo.role})
                                </span>
                            </div>
                            <div className="relative inline-block text-left">
                                <div>
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        id="menu-button-masuk"
                                        aria-expanded={isDropdownOpen.masuk}
                                        aria-haspopup="true"
                                        onClick={() => handleDropdownClick('masuk')}
                                    >
                                        Barang Masuk
                                        <svg
                                            className="-mr-1 h-5 w-5 text-gray-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {isDropdownOpen.masuk && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button-masuk"
                                        tabIndex="-1"
                                    >
                                        <div className="py-1" role="none">
                                            <a
                                                onClick={() => navigate('/listbarangmasuk')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                List Barang Masuk
                                            </a>
                                            <a
                                                onClick={() => navigate('/formbarangmasuk')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                Form Input Barang Masuk
                                            </a>
                                            <a
                                                onClick={() => navigate('/editbarangmasuk')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                Edit Barang Masuk
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative inline-block text-left">
                                <div>
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        id="menu-button-keluar"
                                        aria-expanded={isDropdownOpen.keluar}
                                        aria-haspopup="true"
                                        onClick={() => handleDropdownClick('keluar')}
                                    >
                                        Barang Keluar
                                        <svg
                                            className="-mr-1 h-5 w-5 text-gray-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                {isDropdownOpen.keluar && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button-keluar"
                                        tabIndex="-1"
                                    >
                                        <div className="py-1" role="none">
                                            <a
                                                onClick={() => navigate('/listbarangkeluar')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                List Barang Keluar
                                            </a>
                                            <a
                                                onClick={() => navigate('/formbarangkeluar')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                Form Input Barang Keluar
                                            </a>
                                            <a
                                                onClick={() => navigate('/editbarangkeluar')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                Edit Barang Keluar
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="relative inline-block text-left">
                                <button
                                    type="button"
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    id="menu-button-settings"
                                    aria-expanded={isDropdownOpen.settings}
                                    aria-haspopup="true"
                                    onClick={() => handleDropdownClick('settings')}
                                >
                                    Profile
                                    <svg
                                        className="-mr-1 h-5 w-5 text-gray-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                {isDropdownOpen.settings && (
                                    <div
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="menu-button-settings"
                                        tabIndex="-1"
                                    >
                                        <div className="py-1" role="none">
                                            <a
                                                onClick={() => navigate('/userprofile')}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                My Profile
                                            </a>
                                            <button
                                                onClick={Logout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                role="menuitem"
                                                tabIndex="-1"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={handleBurgerClick}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                        >
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className={`${isActive ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a
                        onClick={() => navigate('/home')}
                        className="text-gray-700 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Home
                    </a>
                    <div className="flex items-center space-x-4 px-3 py-2">
                        <span className="text-gray-700 font-medium">
                            {userInfo.name} ({userInfo.role})
                        </span>
                    </div>
                    <a
                        onClick={() => navigate('/listbarangmasuk')}
                        className="text-gray-700 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        List Barang Masuk
                    </a>
                    <a
                        onClick={() => navigate('/formbarangmasuk')}
                        className="text-gray-700 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Form Input Barang Masuk
                    </a>
                    <a
                        onClick={() => navigate('/editbarangmasuk')}
                        className="text-gray-700 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Edit Barang Masuk
                    </a>
                    <a
                        onClick={() => navigate('/listbarangkeluar')}
                        className="text-gray-700 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        List Barang Keluar
                    </a>
                    <a
                        onClick={() => navigate('/formbarangkeluar')}
                        className="text-gray-700 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Form Input Barang Keluar
                    </a>
                    <a
                        onClick={() => navigate('/editbarangkeluar')}
                        className="text-gray-700 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Edit Barang Keluar
                    </a>
                    <a
                        onClick={() => navigate('/userprofile')}
                        className="text-gray-700 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        My Profile
                    </a>
                    <button
                        onClick={Logout}
                        className="text-gray-700 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
    