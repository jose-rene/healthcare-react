import React, { useState } from "react";

import TableAPI from "components/elements/TableAPI";
import { ACTIONS } from "../../../helpers/table";

const data = [
    {
        id: "mockTrainingDocuments1",
        name: "Document File 2020",
        fileSize: 6.3,
        id_pdf: true,
        url: "http://www.africau.edu/images/default/sample.pdf",
    },
    {
        id: "mockTrainingDocuments2",
        name: "License Document File 2020",
        fileSize: 6.3,
        id_pdf: true,
        url: "https://smallpdf.com/pdf-reader?job=1621391229785",
    },
];

const TabDocuments = () => {
    const [headers] = useState([
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
                        <span className="action-btn">
                            <i0mg
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

    return (
        <div className="row">
            <div className="col-md-6 d-none d-sm-block">
                <h2 className="box-outside-title">Document Viewer</h2>

                <div className="white-box white-box-small">
                    <div className="row">
                        <div className="col-md-12">
                            <embed
                                src="/sample/sample.pdf"
                                style={{
                                    width: "100%",
                                    height: "40rem",
                                }}
                                alt="Document Viewer"
                                pluginspage="https://www.adobe.com/products/acrobat/readstep2.html"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <h2 className="box-outside-title mt-4 pt-2">Files</h2>

                <div className="white-box white-box-small">
                    <div className="row">
                        <div className="col-md-12">
                            <TableAPI // need to update real data
                                searchObj={{}}
                                headers={headers}
                                loading={false}
                                data={data}
                                dataMeta={{}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabDocuments;
