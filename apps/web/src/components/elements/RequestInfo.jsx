import React, { useEffect } from "react";
import { Row } from "react-bootstrap";

import useApiCall from "hooks/useApiCall";

import "styles/RequestInfo.scss";

const Info = () => {
    const [{ data, loading }, fireRequest] = useApiCall({
        url: "request/summary",
    });

    useEffect(() => {
        fireRequest();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Row className="mb-4">
            <div className="col-6 col-sm-3 margin-box margin-box-bottom">
                <div className="info-box">
                    <p className="title-info-box text-received">
                        {loading ? "*" : data?.new ?? "n/a"}
                    </p>
                    <p className="subtitle-info-box">New Requests</p>
                </div>
            </div>

            <div className="col-6 col-sm-3 margin-box margin-box-bottom">
                <div className="info-box">
                    <p className="title-info-box text-in_progress">
                        {loading ? "*" : data?.assigned ?? "n/a"}
                    </p>
                    <p className="subtitle-info-box">In Progress</p>
                </div>
            </div>

            <div className="col-6 col-sm-3 margin-box">
                <div className="info-box">
                    <p className="title-info-box text-scheduled">
                        {loading ? "*" : data?.scheduled ?? "n/a"}
                    </p>
                    <p className="subtitle-info-box">Scheduled</p>
                </div>
            </div>

            <div className="col-6 col-sm-3 margin-box">
                <div className="info-box">
                    <p className="title-info-box text-submitted">
                        {loading ? "*" : data?.submitted ?? "n/a"}
                    </p>
                    <p className="subtitle-info-box">Submitted</p>
                </div>
            </div>
        </Row>
    );
};

export default Info;
