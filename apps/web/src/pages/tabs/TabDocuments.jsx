import React from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Button from "../../components/inputs/Button";
/* eslint-disable jsx-a11y/anchor-is-valid */

const TabDocuments = () => {
    return (
        <Row>
            <Col lg={6} className="d-none d-sm-block">
                <h2 className="box-outside-title">Document Viewer</h2>

                <div className="white-box white-box-small">
                    <Row>
                        <Col lg={12}>
                            <embed
                                src="/sample/sample.pdf"
                                style={{
                                    width: "100%",
                                    height: "40rem",
                                }}
                                alt="Document Viewer"
                                pluginspage="https://www.adobe.com/products/acrobat/readstep2.html"
                            />
                        </Col>
                    </Row>
                </div>
            </Col>

            <Col lg={6}>
                <h2 className="box-outside-title">Files</h2>

                <div className="white-box white-box-small">
                    <Row>
                        <Col lg={12}>
                            <div className="table-responsive">
                                <table className="table app-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>File Size</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td>Document File 2020</td>
                                            <td>6.3 MB</td>
                                            <td width="120">
                                                <Button useButton={false} variant="icon">
                                                    <img
                                                        alt="Download"
                                                        src="/images/icons/download.png"
                                                    />
                                                </Button>
                                                <a
                                                    href="#"
                                                    className="action-btn"
                                                >
                                                    <img
                                                        alt="Play"
                                                        src="/images/icons/play.png"
                                                    />
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>License Document File 2020</td>
                                            <td>6.3 MB</td>
                                            <td width="120">
                                                <a
                                                    href="#"
                                                    className="action-btn"
                                                >
                                                    <img
                                                        alt="Download"
                                                        src="/images/icons/download.png"
                                                    />
                                                </a>
                                                <a
                                                    href="#"
                                                    className="action-btn"
                                                >
                                                    <img
                                                        alt="Play"
                                                        src="/images/icons/play.png"
                                                    />
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
};

export default TabDocuments;
