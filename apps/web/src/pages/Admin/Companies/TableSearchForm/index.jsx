import React from "react";
import InputText from "../../../../components/inputs/ContextInput";
import Select from "../../../../components/contextInputs/Select";
import TableTop from "../../../../components/elements/TableTop";
import PhoneInput from "../../../../components/inputs/PhoneInput";
import ZipcodeInput from "../../../../components/inputs/ZipcodeInput";

const TableSearchForm = ({
    categoryOptions = [],
    subCategoryOptions = [],
    loading,
    redoSearch,
}) => {
    return (
        <>
            <div className="white-box white-box-small">
                <TableTop loading={loading} redoSearch={redoSearch}>
                    <InputText
                        name="company_name"
                        label="Name"
                        placeholder="Name"
                    />

                    <InputText
                        name="address.address_1"
                        label="Street"
                        placeholder="000 Street Ln."
                    />

                    <InputText
                        name="address.city"
                        label="City"
                        placeholder="City Name"
                    />

                    <ZipcodeInput name="address.zip" label="ZIP" />

                    <PhoneInput type="phone" name="phone" label="Phone" />

                    <Select
                        name="category"
                        label="Category"
                        options={categoryOptions}
                    />

                    <Select
                        name="subCategory"
                        label="Subcategory"
                        options={subCategoryOptions}
                    />
                </TableTop>
            </div>
        </>
    );
};

export default TableSearchForm;
