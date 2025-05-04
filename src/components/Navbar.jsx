import React from 'react';
import { FaHeart, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../pages/firebase';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [menuOpen, setMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out of your account",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, logout!',
        });

        if (result.isConfirmed) {
            try {
                await signOut(auth);
                navigate('/');
                Swal.fire('Logged out!', 'You have been successfully logged out.', 'success');
            } catch (error) {
                console.error("Logout error:", error);
            }
        }
    };

    const handleFavoritesClick = () => {
        if (!user) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to view your favorites',
                icon: 'info',
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });
            return;
        }
        navigate('/favorites');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light shadow py-3 position-relative" style={{ backgroundColor: '#fff' }}>
                <div className="container-fluid">
                    {/* Mobile menu button */}
                    <button className="navbar-toggler ms-auto border-0 d-lg-none" type="button" onClick={toggleMenu}>
                        <FaBars size={20} />
                    </button>

                    {/* Centered title */}
                    <a className="navbar-brand fw-bold fs-4 text-dark position-absolute start-50 translate-middle-x" href="#">
                        Country Flags Explorer
                    </a>

                    {/* Desktop buttons */}
                    <div className="d-none d-lg-flex ms-auto">
                        <button className="btn btn-outline-danger me-2" onClick={handleFavoritesClick}>
                            <FaHeart /> Favorites
                        </button>
                        {user && (
                            <button className="btn btn-outline-secondary" onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile offcanvas menu */}
            {menuOpen && (
                <div
                    className="position-fixed top-0 end-0 bg-white shadow p-4"
                    style={{
                        width: '250px',
                        height: '100vh',
                        zIndex: 1050,
                        transition: 'transform 0.3s ease-in-out',
                    }}
                >
                    <button className="btn btn-outline-danger w-100 mb-3" onClick={() => { handleFavoritesClick(); closeMenu(); }}>
                        <FaHeart /> Favorites
                    </button>
                    {user && (
                        <button className="btn btn-outline-secondary w-100" onClick={() => { handleLogout(); closeMenu(); }}>
                            <FaSignOutAlt /> Logout
                        </button>
                    )}
                    <button className="btn btn-link text-danger mt-3" onClick={closeMenu}>
                        Close
                    </button>
                </div>
            )}
        </>
    );
}
