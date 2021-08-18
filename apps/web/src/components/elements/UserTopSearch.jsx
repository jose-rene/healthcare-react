import React from "react";
import * as Yup from "yup";

import Form from "components/elements/Form";
import Button from "components/inputs/Button";
import ContextInput from "components/inputs/ContextInput";

const UserTopSearch = ({ handleSearch, searchObj }) => {
    const validation = {
        search: {
            yupSchema: Yup.string()
                .required("Search value is required")
                .min(3, "Search must be at least 3 characters"),
        },
    };

    return (
        <div className="d-none d-sm-block mb-2">
            <Form
                autocomplete={false}
                defaultData={searchObj}
                validation={validation}
                onSubmit={handleSearch}
            >
                <div className="d-flex justify-content-between">
                    <div className="flex-fill px-2">
                        <ContextInput
                            name="search"
                            label="Do the search"
                            required
                            small
                        />
                    </div>

                    <div className="ms-auto px-2">
                        <Button type="submit" className="py-3">
                            Search
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default UserTopSearch;
