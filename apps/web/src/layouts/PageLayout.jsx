import React, {useState} from "react";
import {connect} from "react-redux";
import {NavDropdown} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import {signOut} from "../actions/authAction";
import Icon from "../components/elements/Icon";
import useIdleTimeout from "../hooks/useIdleTimeout";
import TimeoutModal from "../components/elements/TimeoutModal";
/* eslint-disable jsx-a11y/anchor-is-valid */
const PageLayout = ({full_name, email, localAuth, signOut, children}) => {
    const [{showTimeoutModal}, {dismissTimeout}] = useIdleTimeout();

    const logOut = (e) => {
        e.preventDefault();
        signOut();
    };

    const [{showMenu}, setMenu] = useState({
        showMenu: false,
    });

    const toggleMenu = () => {
        setMenu(() => ({
            showMenu: !showMenu,
        }));
    };

    const location = useLocation();
    const page = location.pathname ? location.pathname.replace("/", "") : "";

    return (
        <>
            <div className="header d-flex">
                <div className="align-items-center w-50 d-flex">
                    <img src="/images/logo-header.png" alt="" />

                    <div className="mobile-menu d-sm-none">
                        <button
                            type="button"
                            onClick={toggleMenu}
                            className="btn btn-outline ml-1"
                        >
                            <Icon icon="bars" />
                        </button>
                    </div>
                    <div className="header-search d-none d-lg-block">
                        <Icon icon="search" className="header-icon" />
                        <input
                            className="search-input"
                            type="text"
                            placeholder="What are you looking for?"
                        />
                    </div>
                </div>

                <div className="d-flex w-50 align-items-center justify-content-end">
                    <a href="#">
                        <Icon icon="notification" className="header-icon" />
                    </a>

                    <span
                        data-testid="userinfo"
                        className="header-name d-none d-sm-block"
                    >
                        {full_name}
                    </span>
                    <img
                        alt=""
                        className="header-avatar"
                        src="/images/icons/user.png"
                    />
                    <NavDropdown title="" alignRight>
                        <NavDropdown.ItemText>{email}</NavDropdown.ItemText>
                        <NavDropdown.Divider />
                        <NavDropdown.Item>
                            <a
                                href="/"
                                onClick={logOut}
                                className="dropdown-item"
                                title="Logout"
                            >
                                Logout
                            </a>
                        </NavDropdown.Item>
                    </NavDropdown>
                </div>
            </div>

            <div className={`sidebar ${showMenu ? "d-block" : ""}`}>
                <ul className="sidebar-items">
                    <li
                        className={page === "dashboard" ? "sidebar-active" : ""}
                    >
                        <Link to="/dashboard">
                            <img src="/images/icons/home.png" alt="Home" />
                        </Link>
                    </li>
                    <li className={page === "requests" ? "sidebar-active" : ""}>
                        <Link to="/requests">
                            <img
                                src="/images/icons/request.png"
                                alt="Requests"
                            />
                        </Link>
                    </li>
                    <li className={page === "account" ? "sidebar-active" : ""}>
                        <Link to="/account">
                            <img src="/images/icons/user.png" alt="Account" />
                        </Link>
                    </li>
                    <li className={page === "payments" ? "sidebar-active" : ""}>
                        <Link to="/payments">
                            <img src="/images/icons/pay.png" alt="Pay" />
                        </Link>
                    </li>
                    <li className={page === "training" ? "sidebar-active" : ""}>
                        <Link to="/training">
                            <img src="/images/icons/video.png" alt="Videos" />
                        </Link>
                    </li>
                    <li className={page === "help" ? "sidebar-active" : ""}>
                        <Link to="/help">
                            <img src="/images/icons/question.png" alt="Help" />
                        </Link>
                    </li>
                    <li>
                        <a href="/" title="Logout" onClick={logOut}>
                            <img src="/images/icons/logout.png" alt="Log Out"/>
                        </a>
                    </li>
                </ul>
            </div>

            <div className="content-container">
                {children}
            </div>
            <TimeoutModal show={showTimeoutModal} onHide={dismissTimeout} handleLogout={logOut}/>
        </>
    );
};

const mapStateToProps = ({ auth, user: { email, full_name } }) => ({
    localAuth: auth,
    email,
    full_name,
});

const mapDispatchToProps = {
    signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);
