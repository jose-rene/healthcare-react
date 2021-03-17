import React from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Button from "../inputs/Button";
import InputText from "../inputs/InputText";

const UserTopSearch = ({
    handleSearch,
    updateSearchObj,
    resetSearch,
    searchObj,
}) => {
    const { register, handleSubmit, errors } = useForm();
    return (
        <div className="d-none d-sm-block mb-2">
            <Form onSubmit={handleSubmit(handleSearch)}>
                <div className="d-flex justify-content-between">
                    <div className="flex-fill px-2">
                        <InputText
                            name="search"
                            prepend="search"
                            onClear={resetSearch}
                            label=""
                            errors={errors}
                            defaultValue={searchObj.search}
                            onChange={updateSearchObj}
                            ref={register({
                                required: "Search value is required",
                                minLength: {
                                    value: 3,
                                    message:
                                        "Search must be at least 3 characters",
                                },
                            })}
                        />
                    </div>
                    <div className="ml-auto px-2">
                        <Button type="submit" className="pt-1 pb-1">
                            Search
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default UserTopSearch;
