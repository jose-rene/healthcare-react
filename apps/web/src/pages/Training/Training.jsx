import React, { useEffect, useMemo } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";

import PageLayout from "layouts/PageLayout";

import PageTitle from "components/PageTitle";

import TabCompliance from "./Tabs/TabCompliance";
import TabPortalTraining from "./Tabs/TabPortalTraining";
import TabResources from "./Tabs/TabResources";
import TabWebinar from "./Tabs/TabWebinar";

import useApiCall from "hooks/useApiCall";

const mockTrainingDocuments = [
    {
        id: "mockTrainingDocuments1",
        name: "testing1",
        fileSize: 4.6,
        id_pdf: true,
        url: "http://www.africau.edu/images/default/sample.pdf",
    },
    {
        id: "mockTrainingDocuments2",
        name: "testing2",
        fileSize: 3.6,
        id_pdf: true,
        url: "https://smallpdf.com/pdf-reader?job=1621391229785",
    },
    {
        id: "mockTrainingDocuments3",
        name: "testing3",
        fileSize: 3.6,
        id_pdf: false,
        url: "https://www.w3schools.com/mov_bbb.mp4",
    },
];

const Training = () => {
    const [
        {
            loading,
            data: { meta = {} },
        },
        requestDocuments,
    ] = useApiCall({
        method: "get",
        url: "/training_document",
    });

    useEffect(() => {
        handleTab(1); // training document type id of database

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTab = (training_document_type_id) => {
        requestDocuments({ params: { training_document_type_id } });
    };

    // need to use real data, currently using mock data
    const pdfData = useMemo(() => {
        if (!mockTrainingDocuments) {
            return [];
        }

        return mockTrainingDocuments.filter((item) => {
            return item.id_pdf === true;
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mockTrainingDocuments]);

    const videoData = useMemo(() => {
        if (!mockTrainingDocuments) {
            return [];
        }

        return mockTrainingDocuments.filter((item) => {
            return item.id_pdf === false;
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mockTrainingDocuments]);

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle title="Training Materials" hideBack />

                <Tabs defaultActiveKey="compliances">
                    <Tab
                        eventKey="compliances"
                        title="Compliances Polices Procedures"
                        onEnter={() => handleTab(1)} // training document type id of database
                    >
                        <TabCompliance
                            data={pdfData}
                            meta={meta}
                            loading={loading}
                        />
                    </Tab>

                    <Tab
                        eventKey="portal"
                        title="Portal Training"
                        onEnter={() => handleTab(2)} // training document type id of database
                    >
                        <TabPortalTraining
                            pdfData={pdfData}
                            videoData={videoData}
                            meta={meta}
                            loading={loading}
                        />
                    </Tab>

                    <Tab
                        eventKey="resources"
                        title="Resources"
                        onEnter={() => handleTab(3)} // training document type id of database
                    >
                        <TabResources
                            pdfData={pdfData}
                            videoData={videoData}
                            meta={meta}
                            loading={loading}
                        />
                    </Tab>

                    <Tab
                        eventKey="webinar"
                        title="Webinar"
                        onEnter={() => handleTab(4)} // training document type id of database
                    >
                        <TabWebinar
                            pdfData={pdfData}
                            videoData={videoData}
                            meta={meta}
                            loading={loading}
                        />
                    </Tab>
                </Tabs>
            </Container>
        </PageLayout>
    );
};

export default Training;
