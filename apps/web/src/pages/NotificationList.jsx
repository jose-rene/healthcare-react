import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import dayjs from "dayjs";
import PageLayout from "layouts/PageLayout";
import PageTitle from "components/PageTitle";
import TableAPI from "components/elements/TableAPI";
import FapIcon from "components/elements/FapIcon";
import { useGlobalContext } from "Context/GlobalContext";
import { ACTIONS } from "helpers/table";

const NotificationList = () => {
    const { notifications: { markRead } = {}, messages } = useGlobalContext();

    const [headers] = useState([
        {
            columnMap: "title",
            label: "Type",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "message",
            label: "Data",
            type: String,
            disableSortBy: true,
        },
        {
            columnMap: "human_read_at",
            label: "Human Read Date",
            type: Date,
            disableSortBy: true,
            formatter: (date) =>
                date
                    ? dayjs(date).format("MM/DD/YYYY") === "Invalid Date"
                        ? date
                        : dayjs(date).format("MM/DD/YYYY")
                    : "-",
        },
        {
            columnMap: "human_created_at",
            label: "Human Created Date",
            type: Date,
            disableSortBy: true,
            formatter: (date) =>
                date
                    ? dayjs(date).format("MM/DD/YYYY") === "Invalid Date"
                        ? date
                        : dayjs(date).format("MM/DD/YYYY")
                    : "-",
        },
        {
            label: "Actions",
            columnMap: "id",
            type: ACTIONS,
            disableSortBy: true,
            formatter(id) {
                return (
                    <FapIcon
                        icon="check-circle"
                        type="fas"
                        size="1x"
                        className="text-success"
                        onClick={() => markRead[id]}
                    />
                );
            },
        },
    ]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!messages) {
            setLoading(true);
        }
    }, [messages]);

    return (
        <PageLayout>
            <Container fluid>
                <PageTitle title="Notifications" hideBack />

                <Row>
                    <Col>
                        <TableAPI
                            searchObj={{}}
                            headers={headers}
                            loading={loading}
                            data={messages}
                            dataMeta={{}}
                        />
                    </Col>
                </Row>
            </Container>
        </PageLayout>
    );
};

export default NotificationList;
