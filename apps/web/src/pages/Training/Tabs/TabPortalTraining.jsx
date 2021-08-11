import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

import TableAPI from "components/elements/TableAPI";
import { ACTIONS } from "../../../helpers/table";

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
        <Tabs defaultActiveKey="pdf" className="inside-tabs">
            <Tab eventKey="pdf" title="PDF">
                <div className="row">
                    <div className="col-md-7">
                        <div className="white-box mt-0">
                            <div className="row">
                                <div className="col-md-12">
                                    <TableAPI // need to update real data
                                        searchObj={{}}
                                        headers={pdfHeaders}
                                        loading={loading}
                                        data={pdfData}
                                        dataMeta={meta} // need to update backend api
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5 d-none d-sm-block">
                        <div className="white-box mt-0">
                            <div className="row">
                                {pdfFileUrl ? (
                                    <div className="col-md-12">
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
                                    </div>
                                ) : (
                                    <div className="col-md-12 d-flex justify-content-center">
                                        No Preview
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Tab>
            <Tab eventKey="video" title="Video">
                <div className="row">
                    <div className="col-md-7">
                        <div className="white-box mt-0">
                            <div className="row">
                                <div className="col-md-12">
                                    <TableAPI // need to update real data
                                        searchObj={{}}
                                        headers={videoHeaders}
                                        loading={loading}
                                        data={videoData}
                                        dataMeta={meta} // need to update backend api
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5 d-none d-sm-block">
                        <div className="white-box mt-0">
                            <div className="row">
                                {videoFileUrl ? (
                                    <div className="col-md-12">
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
                                    </div>
                                ) : (
                                    <div className="col-md-12 d-flex justify-content-center">
                                        No Preview
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Tab>
        </Tabs>
    );
};

export default TabPortalTraining;
