import React from "react";
import Button from "../../inputs/Button";

const TableTop = ({filters = [], redoSearch}) => {
    return (
        <div className="d-flex mb-1 flex-sm-row flex-column">
            {filters.map((f, index) => (
                <div className="px-2 flex-grow-1" key={`filter-${index}`}>
                    {f}
                </div>
            ))}
            <div className="px-2 ml-auto">
                <Button className="px-3 py-1" variant="primary" onClick={() => redoSearch()} label="Search"/>
            </div>
        </div>
    );
};

export default TableTop;
