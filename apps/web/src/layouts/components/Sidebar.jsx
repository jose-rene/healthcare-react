import React from "react";
import { Link, useLocation } from "react-router-dom";
import checkMiddleware from "../../helpers/user";

/* eslint-disable jsx-a11y/anchor-is-valid */
const PageSidebar = ({ logOut, primaryRole, abilities, showMenu }) => {
    const location = useLocation();
    const page = location.pathname ? location.pathname.replace("/", "") : "";

    return (
        <div className={`sidebar ${showMenu ? "d-block" : ""}`}>
            <ul className="sidebar-items">
                <li
                    className={page === "dashboard" ? "sidebar-active" : ""}
                    data-toggle="tooltip"
                    title="Dashboard"
                >
                    <Link to="/dashboard">
                        <img src="/images/icons/home.png" alt="Home" />
                        <div className="d-block d-sm-none">Home</div>
                    </Link>
                </li>
                {checkMiddleware(
                    ["hp_user", "hp_manager", "hp_champion"], // need to change role with admin
                    primaryRole,
                    abilities
                ) && (
                    <li
                        className={
                            page === "admin/companies" ||
                            page === "admin/add-companies"
                                ? "sidebar-active"
                                : ""
                        }
                        data-toggle="tooltip"
                        title="Companies"
                    >
                        <Link to="/admin/companies">
                            <img
                                src="/images/icons/briefcase.png"
                                alt="Companies"
                            />
                            <div className="d-block d-sm-none">Companies</div>
                        </Link>
                    </li>
                )}
                {checkMiddleware(
                    ["hp_user", "hp_manager", "hp_champion"], // need to change role with admin
                    primaryRole,
                    abilities
                ) && (
                    <li
                        className={
                            page === "admin/clinicians" ? "sidebar-active" : ""
                        }
                        data-toggle="tooltip"
                        title="Clinicians"
                    >
                        <Link to="/admin/clinicians">
                            <img
                                src="/images/icons/first-aid-kit.png"
                                alt="Clinicians"
                            />
                            <div className="d-block d-sm-none">Clinicians</div>
                        </Link>
                    </li>
                )}
                {checkMiddleware(
                    ["hp_user", "hp_manager", "hp_champion"], // need to change role with admin
                    primaryRole,
                    abilities
                ) && (
                    <li
                        className={
                            page === "admin/users" ? "sidebar-active" : ""
                        }
                        data-toggle="tooltip"
                        title="UserList"
                    >
                        <Link to="/admin/users">
                            <img src="/images/icons/users.png" alt="UserList" />
                            <div className="d-block d-sm-none">UserList</div>
                        </Link>
                    </li>
                )}
                {checkMiddleware(
                    ["hp_user", "hp_manager", "hp_champion"],
                    primaryRole,
                    abilities
                ) && (
                    <li
                        className={
                            page === "healthplan/start-request"
                                ? "sidebar-active"
                                : ""
                        }
                        data-toggle="tooltip"
                        title="Search Member"
                    >
                        <Link to="/healthplan/start-request">
                            <img
                                src="/images/icons/request.png"
                                alt="Requests"
                            />
                            <div className="d-block d-sm-none">Requests</div>
                        </Link>
                    </li>
                )}
                {checkMiddleware(
                    ["hp_user", "hp_manager", "hp_champion"],
                    primaryRole,
                    abilities
                ) && (
                    <li
                        className={
                            page === "healthplan/requests"
                                ? "sidebar-active"
                                : ""
                        }
                        title="Search Requests"
                    >
                        <Link to="/healthplan/requests">
                            <img
                                src="/images/icons/search.png"
                                alt="Search Requests"
                            />
                        </Link>
                    </li>
                )}
                <li
                    className={page === "account" ? "sidebar-active" : ""}
                    data-toggle="tooltip"
                    title="Account"
                >
                    <Link to="/account">
                        <img src="/images/icons/user.png" alt="Account" />
                        <div className="d-block d-sm-none">Account</div>
                    </Link>
                </li>
                <li
                    className={page === "payments" ? "sidebar-active" : ""}
                    data-toggle="tooltip"
                    title="Payments"
                >
                    <Link to="/payments">
                        <img src="/images/icons/pay.png" alt="Pay" />
                        <div className="d-block d-sm-none">Pay</div>
                    </Link>
                </li>
                <li
                    className={
                        page === "healthplan/training" ? "sidebar-active" : ""
                    }
                    data-toggle="tooltip"
                    title="Training"
                >
                    <Link to="/healthplan/training">
                        <img src="/images/icons/video.png" alt="Videos" />
                        <div className="d-block d-sm-none">Videos</div>
                    </Link>
                </li>
                <li
                    className={page === "help" ? "sidebar-active" : ""}
                    data-toggle="tooltip"
                    title="Help"
                >
                    <Link to="/help">
                        <img src="/images/icons/question.png" alt="Help" />
                        <div className="d-block d-sm-none">Help</div>
                    </Link>
                </li>
                <li>
                    <a href="/" title="Logout" onClick={logOut}>
                        <img src="/images/icons/logout.png" alt="Log Out" />
                        <div className="d-block d-sm-none">Log Out</div>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default PageSidebar;
