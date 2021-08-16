import React from "react";
import Select from "../../inputs/Select";

const AddressType = ({
    name = "address.address_type_id",
    label = "",
    options,
    ...props
}) => {

    return (
        <Select
            name={name}
            label="Type*"
            {...props}
            options={options}
        />
    );
};

export default AddressType;
