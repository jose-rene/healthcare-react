import React, { useMemo, useState } from "react";
import { Button } from "../../../components";
import TableAPI from "../../../components/elements/TableAPI";
import ConfirmationModal from "../../../components/elements/ConfirmationModal";
import headers from "./headers";
import useApiCalls from "./useApiCalls";

const NarrativeReport = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    const handleDelete = (slug) => {
        setShowDeleteModal(slug);
    };

    const tableHeaders = useMemo(() => {
        return headers({ handleDelete });
    }, []);

    const {
        loading,
        data,
        meta,

        fireCreateTemplate,
        creating,

        deleting,
        fireDeleteTemplate,

        searchObj,
        updateSearchObj,
        redoSearch,
    } = useApiCalls({
        headers: tableHeaders,
    });

    const handleDeleteConfirmation = async (onlyClose = false) => {
        if (!onlyClose) {
            await fireDeleteTemplate({
                url: `narrative_report_template/${showDeleteModal}`,
            });
            await redoSearch();
        }

        setShowDeleteModal(null);
    };

    const handleCreate = async () => {
        const name = prompt("Report name: ");
        if (name) {
            await fireCreateTemplate({
                params: {
                    name,
                },
            });
            await redoSearch();
        }
    };

    return (
        <div className="content-box">
            <div className="float-right mb-3">
                <Button
                    loading={creating}
                    variant="primary"
                    onClick={handleCreate}
                    label="Create Narrative Report"
                />
            </div>

            <TableAPI
                loading={loading}
                label="Forms"
                headers={tableHeaders}
                searchObj={searchObj}
                data={data}
                dataMeta={meta}
                onChange={updateSearchObj}
            />

            <ConfirmationModal
                handleAction={() => handleDeleteConfirmation()}
                handleCancel={() => handleDeleteConfirmation(true)}
                content={"Sure?"}
                loading={deleting}
                showModal={!!showDeleteModal}
            />
        </div>
    );
};

export default NarrativeReport;
