import React, { useState } from "react";
import "./layoutAdmin.scss";

const LayoutAdmin = ({children}) => {
    const [showMobile, setShowMobile] = useState(false);

    return (
        <>
            <div className="header">
                <div className="header-left">
                    <img src="/images/logo-header.png" alt=""/>

                    <div className="mobile-menu">
                        <button onClick={() => setShowMobile(!showMobile)} className="btn-mobile-menu"><i className="fas fa-bars"/></button>
                    </div>
                </div>
            </div>

            <div className={`admin-sidebar ${showMobile ? "display" : ""}`}>
                <ul className="admin-sidebar-items">
                    <li className="sidebar-active"><a href="#"><img src="/icons/home.png" alt=""/></a></li>
                    <li><a href="#"><img src="/icons/briefcase.png" alt=""/></a></li>
                    <li><a href="#"><img src="/icons/user.png" alt=""/></a></li>
                    <li><a href="#"><img src="/icons/first-aid-kit.png" alt=""/></a></li>
                    <li><a href="#"><img src="/icons/request.png" alt=""/></a></li>
                    <li><a href="#"><img src="/icons/bank.png" alt=""/></a></li>
                    <li><a href="#"><img src="/icons/video.png" alt=""/></a></li>
                    <li><a href="#"><img src="/icons/pie-chart.png" alt=""/></a></li>
                    <li><a href="#"><img src="/icons/settings.png" alt=""/></a></li>
                    <li><a href="#"><img src="/icons/logout.png" alt=""/></a></li>
                </ul>
            </div>

            <div className="content-container">
                {children}
            </div>
        </>
    )
}

export default LayoutAdmin;
