import React from "react";
import { Row } from "react-bootstrap";
import "../../styles/RequestInfo.scss";
import useApiService from "../../hooks/useApiService";

const Info = () => {
    const [{ data, loading }] = useApiService({
        route: "request/summary",
    });

    return (
        <Row className="mb-4">
            <div className="col-6 col-sm-3 margin-box margin-box-bottom">
                <div className="info-box">
                    <p style={{ color: "#2EE556" }} className="title-info-box">
                        {loading ? "*" : data?.new ?? "n/a"}
                    </p>
                    <p className="subtitle-info-box">New Requests</p>
                </div>
            </div>

            <div className="col-6 col-sm-3 margin-box margin-box-bottom">
                <div className="info-box">
                    <p style={{ color: "#2E94E6" }} className="title-info-box">
                        {loading ? "*" : data?.in_progress ?? "n/a"}
                    </p>
                    <p className="subtitle-info-box">In Progress</p>
                </div>
            </div>

            <div className="col-6 col-sm-3 margin-box">
                <div className="info-box">
                    <p style={{ color: "#E5A72E" }} className="title-info-box">
                        {loading ? "*" : data?.scheduled ?? "n/a"}
                    </p>
                    <p className="subtitle-info-box">Scheduled</p>
                </div>
            </div>

            <div className="col-6 col-sm-3 margin-box">
                <div className="info-box">
                    <p style={{ color: "#E5442E" }} className="title-info-box">
                        {loading ? "*" : data?.submitted ?? "n/a"}
                    </p>
                    <p className="subtitle-info-box">Submitted</p>
                </div>
            </div>
        </Row>
    );
};

export default Info;
