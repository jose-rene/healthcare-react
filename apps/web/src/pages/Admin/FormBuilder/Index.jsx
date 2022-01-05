import React, { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageLayout from "layouts/PageLayout";

import { Button } from "components";
import TableAPI from "components/elements/TableAPI";
import FapIcon from "components/elements/FapIcon";
import ConfirmationModal from "components/elements/ConfirmationModal";

import useApiCall from "hooks/useApiCall";
import useSearch from "hooks/useSearch";

import { POST, DELETE } from "config/URLs";

import { _GET } from "helpers/request";
import { ACTIONS } from "helpers/table";

const FormIndex = () => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [
        {
            loading,
            data: { data = [], meta = {} },
        },
        fireGetForms,
    ] = useApiCall({
        url: "form",
    });

    const [{ loading: postForm }, firePostForm] = useApiCall({
        url: "form",
        method: POST,
    });

    const [{ loading: deleteForm }, fireDeleteForm] = useApiCall({
        method: DELETE,
    });

    useEffect(() => {
        if (_GET("message") === "edit-bad-form-slug") {
            // TODO :: handle this better
            alert("Bad edit form slug");
        }
    }, []);

    const headers = useMemo(() => {
        return [
            {
                label: "ID",
                columnMap: "id",
                disableSortBy: true,
            },
            {
                label: "Slug",
                columnMap: "slug",
                disableSortBy: true,
            },
            {
                label: "Name",
                columnMap: "name",
                disableSortBy: true,
            },
            {
                label: "Description",
                columnMap: "description",
                disableSortBy: true,
            },
            {
                label: "Actions",
                columnMap: "slug",
                type: ACTIONS,
                disableSortBy: true,
                formatter(slug) {
                    return (
                        <div className="actions">
                            <Link
                                className="action"
                                to={`/admin/forms/${slug}/edit`}
                                title="Edit"
                            >
                                <FapIcon icon="edit" size="1x" />
                            </Link>

                            <Link
                                className="action"
                                to={`/forms/${slug}/show`}
                                title="View"
                            >
                                <FapIcon icon="eye" size="1x" />
                            </Link>

                            <Link
                                className="action"
                                onClick={() => handleCopyForm(slug)}
                                title="Duplicate"
                            >
                                <FapIcon icon="copy" size="1x" />
                            </Link>

                            <Link
                                className="action"
                                onClick={() => handleDeleteForm(slug)}
                                title="Delete"
                            >
                                <FapIcon icon="trash" size="1x" />
                            </Link>
                        </div>
                    );
                },
            },
        ];

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [{ searchObj }, { updateSearchObj, redoSearch }] = useSearch({
        searchObj: {
            perPage: 10,
            sortColumn: headers[1].columnMap,
            sortDirection: "asc",
        },
        onSearch: fireGetForms,
    });

    const handleCreateForm = async () => {
        const name = prompt("Form Name?");
        await firePostForm({
            params: {
                name,
            },
        });

        if (!postForm) {
            await redoSearch();
        }
    };

    const handleDeleteForm = (slug) => {
        setShowDeleteConfirm(slug);
    };

    const handleCopyForm = async (slug) => {
        const name = prompt("New Form Name?", slug + "_copy");

        await firePostForm({
            params: {
                name,
                copyFrom: slug,
            },
        });

        if (!postForm) {
            await redoSearch();
        }
    };

    const handleDeleteConfirm = async () => {
        await fireDeleteForm({
            url: `form/${showDeleteConfirm}`,
        });

        if (!deleteForm) {
            await redoSearch();
            setShowDeleteConfirm(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(null);
    };

    return (
        <PageLayout>
            <div className="content-box">
                <div className="float-right mb-3">
                    <Button
                        variant="primary"
                        onClick={handleCreateForm}
                        label="Create Form"
                    />
                </div>

                <TableAPI
                    loading={loading}
                    label="Forms"
                    headers={headers}
                    searchObj={searchObj}
                    data={data}
                    dataMeta={meta}
                    onChange={updateSearchObj}
                />

                <ConfirmationModal
                    handleAction={handleDeleteConfirm}
                    handleCancel={handleDeleteCancel}
                    content={"Sure?"}
                    showModal={!!showDeleteConfirm}
                />
            </div>
        </PageLayout>
    );
};

export default FormIndex;
