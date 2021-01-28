import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import useApiService from "../../hooks/useApiService";
import "../../styles/AlertList.scss";

const List = () => {
    /* const [{ data, loading, error }] = useApiService({
        route: "alert/list",
    }); */

    return (
        <>
            <div className="box-same-line">
                <h1 className="box-title">Alerts</h1>
                <div className="d-none d-sm-block">
                    <p className="text-select-all">Select All</p>
                </div>
            </div>
            <div className="white-box-alerts">
                <div className="container-items">
                    <ListGroup>
                        <ListGroupItem className="border-0">
                            <div className="d-flex">
                                <div>
                                    <input id="not1" type="checkbox" />
                                </div>
                                <div>
                                    <label
                                        htmlFor="not1"
                                        className="checkbox-label"
                                    >
                                        Server - Aaron C-Test
                                    </label>
                                </div>
                                <div className="ml-auto">
                                    <p className="checkbox-time">2d Ago</p>
                                </div>
                            </div>
                            <p className="checkbox-subtitle">
                                Test_123_321 - Member has not been schedule yet
                            </p>
                        </ListGroupItem>
                        <ListGroupItem className="border-0">
                            <div className="d-flex">
                                <div>
                                    <input id="not2" type="checkbox" />
                                </div>
                                <div>
                                    <label
                                        htmlFor="not2"
                                        className="checkbox-label"
                                    >
                                        Tom Test-Jones
                                    </label>
                                </div>
                                <div className="ml-auto">
                                    <p className="checkbox-time">1hr Ago</p>
                                </div>
                            </div>
                            <p className="checkbox-subtitle">
                                TEST-123 - Request has been cancelled.
                            </p>
                        </ListGroupItem>
                    </ListGroup>
                </div>
            </div>
        </>
    );
};

export default List;
