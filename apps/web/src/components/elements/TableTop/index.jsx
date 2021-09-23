import React from "react";
import Button from "../Button";

const TableTop = ({ filters = false, redoSearch, children, loading }) => {
    return (
        <div className="d-flex mb-1 flex-row">
            <div className="d-flex mb-1 flex-sm-row flex-column flex-wrap">
                {(filters || children).map((f, index) => (
                    <div
                        className="px-2 flex-grow-1"
                        key={`filter-${index}`}
                        style={{ minWidth: 300, maxWidth: 500 }}
                    >
                        {f}
                    </div>
                ))}
            </div>
            <div className="px-2 ms-auto">
                <Button
                    type="submit"
                    size="lg"
                    iconSize="1x"
                    className="px-3 py-1"
                    variant="primary"
                    label="Search"
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default TableTop;
