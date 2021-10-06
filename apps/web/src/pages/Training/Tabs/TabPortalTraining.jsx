import React, { useState } from "react";
import { Tabs, Tab, Row, Col } from "react-bootstrap";

import TableAPI from "components/elements/TableAPI";

import { ACTIONS } from "helpers/table";

const TabPortalTraining = ({ pdfData, videoData, meta, loading }) => {
    const [pdfFileUrl, setPdfFileUrl] = useState(null);
    const [videoFileUrl, setVideoFileUrl] = useState(null);

    const [pdfHeaders] = useState([
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
                            onClick={(e) => handlePdfPlay(e, url)}
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

    const [videoHeaders] = useState([
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
                            onClick={(e) => handleVideoPlay(e, url)}
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

    const handlePdfPlay = (e, url) => {
        e.preventDefault();
        setPdfFileUrl(url);
    };

    const handleVideoPlay = (e, url) => {
        e.preventDefault();
        setVideoFileUrl(url);
    };

    return (
        <Tabs defaultActiveKey="pdf" className="inside-tabs mb-4">
            <Tab eventKey="pdf" title="PDF">
                <Row>
                    <Col md={7}>
                        <Row>
                            <Col md={12}>
                                <TableAPI // need to update real data
                                    searchObj={{}}
                                    headers={pdfHeaders}
                                    loading={loading}
                                    data={pdfData}
                                    dataMeta={meta} // need to update backend api
                                />
                            </Col>
                        </Row>
                    </Col>

                    <Col md={5}>
                        <Row>
                            {pdfFileUrl ? (
                                <Col md={12}>
                                    <embed
                                        key={pdfFileUrl}
                                        src={pdfFileUrl}
                                        style={{
                                            width: "100%",
                                            height: "40rem",
                                        }}
                                        alt="Document Viewer"
                                        pluginspage="https://www.adobe.com/products/acrobat/readstep2.html"
                                    />
                                </Col>
                            ) : (
                                <Col
                                    md={12}
                                    className="d-flex justify-content-center"
                                >
                                    No Preview
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Tab>
            <Tab eventKey="video" title="Video">
                <Row>
                    <Col md={7}>
                        <Row>
                            <Col md={12}>
                                <TableAPI // need to update real data
                                    searchObj={{}}
                                    headers={videoHeaders}
                                    loading={loading}
                                    data={videoData}
                                    dataMeta={meta} // need to update backend api
                                />
                            </Col>
                        </Row>
                    </Col>

                    <Col md={5}>
                        <Row>
                            {videoFileUrl ? (
                                <Col md={12}>
                                    <video
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            borderRadius: "6px",
                                        }}
                                        controls
                                    >
                                        <source
                                            src={videoFileUrl}
                                            type="video/mp4"
                                        />
                                    </video>
                                </Col>
                            ) : (
                                <Col
                                    md={12}
                                    className="d-flex justify-content-center"
                                >
                                    No Preview
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Tab>
        </Tabs>
    );
};

export default TabPortalTraining;
