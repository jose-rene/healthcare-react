import React from "react";
import FapIcon from "../../../../../components/elements/FapIcon";

const FormListItem = ({
    ...item
}) => {
    const {
        fields = [],
        name,
        updated_at,
    } = item;

    return (
        <div className="list-group-item-light my-3 border-2 p-3 shadow-sm">
            <div className="container-flex">
                <div className="row">
                    <div className="col-md-8">
                        <h3>{name}</h3>
                        <div className="text-muted mb-3">
                            <FapIcon icon="calendar" />
                            Last Updated: {updated_at}
                        </div>
                    </div>
                    <div className="col-md-4 border-left-1">
                        <strong>Fields:</strong>
                        <p>
                            "{fields.map(f => f.label).join("\", \"").replace(/, ([^,]*)$/, " and $1")}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormListItem;
