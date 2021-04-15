import React from "react";
import Select from "../../components/inputs/Select";

import "./newRequestAddSteps.css";

const NewRequestAddSteps4 = ({ data }) => {
    console.log("newRequestAddSteps", { data });

    // todo track expanding rows

    return (
        <>
            <div className="container-info">
                <div className="col-md-12 px-0">
                    <div className="row">
                        <div className="col-md-12">
                            <p className="title-info padding-title-step4">
                                Select a Request Classification / Category / Type
                            </p>
                        </div>

                        <div className="col-md-6">
                            <Select
                                name="classification"
                                label="Classification"
                                options={[
                                    {
                                        id: "Select option",
                                        title: "Select option",
                                        val: "Select option",
                                    },
                                ]}
                            />
                        </div>

                        <div className="col-md-6">
                            <Select
                                name="category"
                                label="Category"
                                options={[
                                    {
                                        id: "Select option",
                                        title: "Select option",
                                        val: "Select option",
                                    },
                                ]}
                            />
                        </div>

                        <div className="col-md-12">
                            <Select
                                name="type"
                                label="Type"
                                options={[
                                    {
                                        id: "Select option",
                                        title: "Select option",
                                        val: "Select option",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default NewRequestAddSteps4;
