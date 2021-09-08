import React from "react";
import * as Yup from "yup";

import { FloatingLabel } from "react-bootstrap";
import RawInput from "../contextInputs/RawInput";
import Form from "./Form";
import Button from "../inputs/Button";
import FapIcon from "./FapIcon";

const UserTopSearch = ({ handleSearch, searchObj }) => {
    const validation = {
        search: {
            yupSchema: Yup.string()
                .required("Search value is required")
                .min(3, "Search must be at least 3 characters"),
        },
    };

    return (
        <div className="mb-2">
            <Form
                autocomplete={false}
                defaultData={searchObj}
                validation={validation}
                onSubmit={handleSearch}
            >
                <div className="d-flex">
                    <FloatingLabel label="Search Users">
                        <RawInput
                            id="search"
                            name="search"
                            placeholder="Search Users"
                            required
                            className="grouper-left"
                        />
                    </FloatingLabel>
                    <Button
                        id="btnSearch"
                        className="grouper-right"
                        type="submit"
                    >
                        <FapIcon icon="search" /> Search
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default UserTopSearch;
