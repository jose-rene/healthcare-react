import React from "react";
import Button from "../inputs/Button";

const TableTopSort = ({handleSearch, updateSearchObj}) => {
    return (
        <div className="d-none d-sm-block mb-3">
            <div className="d-flex justify-content-between">
                <div className="flex-fill px-2">
                    <select className="app-input-filter margin-input">
                        <option>Therapist</option>
                    </select>
                </div>

                <div className="flex-fill px-2">
                    <select className="app-input-filter margin-input" name="status" onChange={updateSearchObj}>
                        <option>Status</option>
                        <option value='1'>Active</option>
                        <option value='0'>In Active</option>
                    </select>
                </div>

                <div className="flex-fill px-2">
                    <select className="app-input-filter margin-input">
                        <option>From Date</option>
                    </select>
                </div>

                <div className="flex-fill px-2">
                    <select className="app-input-filter margin-input">
                        <option>To Date</option>
                    </select>
                </div>

                <div className="flex-fill px-2">
                    <select className="app-input-filter margin-input">
                        <option>Date Range</option>
                    </select>
                </div>

                <div className="ms-auto px-2">
                    <Button className="pt-1 pb-1" onClick={handleSearch}>
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TableTopSort;
