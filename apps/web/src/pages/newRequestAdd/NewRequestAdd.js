import React, { useEffect, useMemo } from "react";
import PageLayout from "../../layouts/PageLayout";
import Stepper from "../../components/elements/Stepper";
import useApiCall from "../../hooks/useApiCall";

import "./newRequestAdd.css";

const NewRequestAdd = ({
    match: {
        params: { member_id },
    },
}) => {
    const [{ data }, dataRequest] = useApiCall({
        method: "post",
        url: `/member/${member_id}/member-requests`,
    });

    const { member = {} } = data;

    useEffect(() => {
        dataRequest();
    }, []);

    const name = useMemo(() => {
        const { last_name = "", first_name = "" } = member || {};

        return `${first_name} ${last_name}`;
    }, [member]);

    return (
        <PageLayout>
            <div className="content-box" style={{ backgroundColor: "#fff" }}>
                <h1 className="box-title mb-0">New Request</h1>
                <p className="box-legenda mb-3">
                    Please fill the request sections
                </p>

                <div className="row">
                    <div className="col-md-12">
                        <h1 className="box-subtitle mt-5">{name}</h1>

                        <Stepper data={data} />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default NewRequestAdd;
