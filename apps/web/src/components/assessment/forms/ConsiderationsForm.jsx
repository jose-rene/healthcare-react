import useApiCall from "hooks/useApiCall";
import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    Col,
    Collapse,
    Form,
    FormLabel,
    ListGroup,
    Row,
} from "react-bootstrap";

const ConsiderationForm = ({toggleOpenConsideration, activeRequestItem: requestItem}) => {

    const { considerations = [] } = requestItem;
    const [{ loading: classLoading }, fetchClassification] = useApiCall();
    const getClassfication = async (id) => {
        const data = await fetchClassification({
            url: `classification/${id}`,
        });
    };

    return (
        <>
            {considerations.map(({id, classification_name, name}) => (
                <div key={id}>
                    <h6 className="mb-2">{`${classification_name} > ${name}`}</h6>
                    <FormLabel className="me-2">
                        Is this consideration recommended?
                    </FormLabel>
                    <Form.Check
                        inline
                        label="Yes"
                        name="recommended"
                        type="radio"
                        id="recommended-yes"
                        value="yes"
                    />
                    <Form.Check
                        inline
                        label="No"
                        name="recommended"
                        type="radio"
                        id="recommended-no"
                        value="no"
                    />
                </div>
            ))}
            <Button
                variant="secondary"
                onClick={() => toggleOpenConsideration()}
                className="me-3 mt-3"
            >
                Cancel
            </Button>
        </>
    );
};

export default ConsiderationForm;
