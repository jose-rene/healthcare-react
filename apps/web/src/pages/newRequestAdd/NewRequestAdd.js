import React, { useEffect, useMemo } from "react";
import PageLayout from "../../layouts/PageLayout";
import Stepper from "../../components/elements/Stepper";

import "./newRequestAdd.css";
import useApiCall from "../../hooks/useApiCall";
import { POST } from "../../config/URLs";
import Icon from "../../components/elements/Icon";

const NewRequestAdd = ({
    match: {
        params: { member_id, request_id = false },
    },
    history,
}) => {
    const [{ loading: saving = true }, fireCreateRequest] = useApiCall({
        method: POST,
        url: `/member/${member_id}/member-requests`,
    });
    const [{ loading = true, data, error }, fireLoadRequest] = useApiCall({
        url: `/member/${member_id}/member-requests/${request_id}`,
    });

    const goToSearch = () => {
        history.push({
            pathname: "/healthplan/start-request",
            state: {
                message: "Invalid Member",
                type: "error",
            },
        });
    };

    useEffect(() => {
        (async () => {
            if (!request_id) {
                let id = null;
                try {
                    const { id: newReportId } = await fireCreateRequest();
                    id = newReportId;
                } catch (e) {}

                if (!id) {
                    goToSearch();
                    return;
                }

                history.push(`/member/${member_id}/request/${id}/edit`);
                window.location.reload();
            } else {
                fireLoadRequest();
            }
        })();
    }, []);

    useEffect(() => {
        if (error) {
            goToSearch();
        }
    }, []);

    const { member = {} } = data;

    const name = useMemo(() => {
        const { title = "", last_name = "", first_name = "" } = member || {};

        return `${title} ${first_name} ${last_name}`;
    }, [member]);

    return (
        <PageLayout>
            <div className="content-box" style={{ backgroundColor: "#fff" }}>
                <h1 className="box-title mb-0">
                    New Request{" "}
                    {(loading || saving) && (
                        <Icon icon="spinner" size="1x" spin={true} />
                    )}
                </h1>
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
