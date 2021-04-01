import React, { useState } from "react";

import PageLayout from "../../layouts/PageLayout";
import Stepper from "../../components/elements/Stepper";

import "./newRequestAdd.css";

export default function NewRequestAdd() {
    return (
        <PageLayout>
            <div className="content-box" style={{ backgroundColor: "#fff" }}>
                <h1 className="box-title mb-0">New Request</h1>
                <p className="box-legenda mb-3">
                    Please fill the request sections
                </p>

                <div className="row">
                    <div className="col-md-12">
                        <h1 className="box-subtitle mt-5">Test M Smith</h1>

                        <Stepper />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
