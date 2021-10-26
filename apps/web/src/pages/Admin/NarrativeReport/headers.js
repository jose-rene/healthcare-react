import React from "react";
import { ACTIONS } from "../../../helpers/table";
import { Link } from "react-router-dom";
import Icon from "../../../components/elements/Icon";

export default ({ handleDelete }) => [
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
        label: "Actions",
        columnMap: "slug",
        type: ACTIONS,
        disableSortBy: true,
        formatter (slug) {
            return (
                <div className="actions">
                    <Link
                        className="action"
                        to={`/admin/narrative-report/${slug}/edit`}
                        title="Edit"
                    >
                        <Icon icon="edit" size="1x" />
                    </Link>

                    {/*<Link
                        className="action"
                        to={`/admin/narrative-report/${slug}/show`}
                        title="View"
                    >
                        <Icon icon="eye" size="1x" />
                    </Link>*/}

                    <Link
                        className="action"
                        onClick={() => handleDelete(slug)}
                        title="Delete"
                    >
                        <Icon icon="trash" size="1x" />
                    </Link>
                </div>
            );
        },
    },
]
