import React, { useEffect } from "react";
import useApiCall from "../../hooks/useApiCall";
import "../../styles/RequestList.scss";
import Button from "../inputs/Button";

const List = () => {
    const [{ data, loading }, fireRequestList] = useApiCall({
        route: "request/list",
    });

    useEffect(() => {
        // fireRequestList();
    }, []);

    return (
        <>
            <div className="d-none d-sm-block">
                <div className="d-flex justify-content-between">
                    <div className="flex-fill">
                        <select className="app-input-filter margin-input">
                            <option>Therapist</option>
                        </select>
                    </div>

                    <div className="flex-fill">
                        <select className="app-input-filter margin-input">
                            <option>Status</option>
                        </select>
                    </div>

                    <div className="flex-fill">
                        <select className="app-input-filter margin-input">
                            <option>From Date</option>
                        </select>
                    </div>

                    <div className="flex-fill">
                        <select className="app-input-filter margin-input">
                            <option>To Date</option>
                        </select>
                    </div>

                    <div className="flex-fill">
                        <select className="app-input-filter margin-input">
                            <option>Date Range</option>
                        </select>
                    </div>

                    <div className="ml-auto">
                        <Button className="pt-1 pb-1">Search</Button>
                    </div>
                </div>
            </div>

            <div className="white-box white-box-small">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="table-responsive">
                            <table className="table app-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>ID/Auth</th>
                                        <th>Status</th>
                                        <th>Category</th>
                                        <th>Received</th>
                                        <th>Due</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Mister Jones</td>
                                        <td>Test_123_321</td>
                                        <td>Assigned</td>
                                        <td>Manual Wheelchair/Stroller</td>
                                        <td>05/05/2020</td>
                                        <td>06/06/2020</td>
                                    </tr>
                                    <tr>
                                        <td>John Doe</td>
                                        <td>Test_123_321</td>
                                        <td>Scheduled</td>
                                        <td>Manual Wheelchair/Stroller</td>
                                        <td>05/05/2020</td>
                                        <td>06/06/2020</td>
                                    </tr>
                                    <tr>
                                        <td>Kenny Smith</td>
                                        <td>Test_123_321</td>
                                        <td>Assigned</td>
                                        <td>Prosthetic Accessories</td>
                                        <td>05/05/2020</td>
                                        <td>06/06/2020</td>
                                    </tr>
                                    <tr>
                                        <td>Guilherme Ferreira</td>
                                        <td>Test_123_321</td>
                                        <td>Assigned</td>
                                        <td>Manual Wheelchair/Stroller</td>
                                        <td>05/05/2020</td>
                                        <td>06/06/2020</td>
                                    </tr>
                                    <tr>
                                        <td>Aaron C-Test</td>
                                        <td>Test_123_321</td>
                                        <td>Scheduled</td>
                                        <td>Prosthetic</td>
                                        <td>05/05/2020</td>
                                        <td>06/06/2020</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default List;
