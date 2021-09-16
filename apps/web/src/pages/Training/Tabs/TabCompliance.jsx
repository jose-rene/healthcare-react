import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";

import TableAPI from "components/elements/TableAPI";

import { ACTIONS } from "helpers/table";

const TabCompliance = ({ data, meta, loading }) => {
    const [fileUrl, setFileUrl] = useState(null);

    const [complianceHeaders] = useState([
        { columnMap: "name", label: "Name", type: String, disableSortBy: true },
        {
            columnMap: "fileSize",
            label: "File Size",
            type: String,
            disableSortBy: true,
            formatter(fileSize) {
                return <span>{fileSize}MB</span>;
            },
        },
        {
            columnMap: "id",
            label: "Actions",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id, { url }) {
                return (
                    <>
                        <span className="action-btn">
                            <img
                                className="action-btn"
                                src="/images/icons/download.png"
                                alt="Download"
                            />
                        </span>
                        <span
                            className="action-btn"
                            onClick={(e) => handlePlay(e, url)}
                        >
                            <img
                                className="action-btn"
                                src="/images/icons/play.png"
                                alt="Play"
                            />
                        </span>
                    </>
                );
            },
        },
    ]);

    const handlePlay = (e, url) => {
        e.preventDefault();
        setFileUrl(url);
    };

    return (
        <Row>
            <Col md={7}>
                <h2 className="fs-5 mt-4 pt-2">Files</h2>

                <Row>
                    <Col md={12}>
                        <TableAPI // need to update real data
                            searchObj={{}}
                            headers={complianceHeaders}
                            loading={loading}
                            data={data}
                            dataMeta={meta} // need to update backend api
                        />
                    </Col>
                </Row>
            </Col>

            <Col md={5}>
                <h2 className="fs-5 my-3 pt-3">Document Viewer</h2>

                <Row>
                    {fileUrl ? (
                        <Col md={12}>
                            <embed
                                key={fileUrl}
                                src={fileUrl}
                                style={{ width: "100%", height: "40rem" }}
                                alt="Document Viewer"
                                pluginspage="https://www.adobe.com/products/acrobat/readstep2.html"
                            />
                        </Col>
                    ) : (
                        <Col md={12} className="d-flex justify-content-center">
                            No Preview
                        </Col>
                    )}
                </Row>
            </Col>
        </Row>
    );
};

export default TabCompliance;
