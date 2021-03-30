import React from "react";

import "./newRequestAdd.css";
import PageLayout from "../../layouts/PageLayout";
// import Stepper from "../../components/elements/Stepper";

export default function NewRequestAdd() {
    return (
        <PageLayout>
            <div className="content-box" style={{ backgroundColor: "#FFF" }}>
                <h1 className="box-title">New Request</h1>
                <p className="box-legenda">Please fill the request sections</p>

                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="box-subtitle">Test M Smith</h1>

                        {/* <Stepper /> */}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
