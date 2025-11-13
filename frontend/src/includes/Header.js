import React from "react";
import "../styles/globalStyle.css";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

const Header = () => {
    const navigate = useNavigate();

    const handleCheckin = () => {
        console.log("Checkin clicked");
        toast.success("Đang chuyển đến trang Checkin...");
        setTimeout(() => {navigate("/checkin");}, 0);
    };

    const handleCheckout = () => {
        console.log("Checkout clicked");
        navigate("/checkout");
    };

    const handleAddPerson = () => {
        console.log("Thêm người mới clicked");
        navigate("/add-person");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
            <div className="container px-5">
                <a className="navbar-brand" href="#page-top">Face recognition project</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                        </li>
                    </ul>

                    {/* Button group on the right side of the navbar */}
                    <div className="d-flex align-items-center ms-3">
                        <button
                            type="button"
                            className="btn btn-outline-light me-2"
                            aria-label="Check in"
                            onClick={handleCheckin}
                        >
                            Checkin
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline-light me-2"
                            aria-label="Check out"
                            onClick={handleCheckout}
                        >
                            Checkout
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            aria-label="Thêm người mới"
                            onClick={handleAddPerson}
                        >
                            Thêm người mới
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;