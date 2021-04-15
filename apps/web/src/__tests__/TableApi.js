import "@testing-library/jest-dom";
import React from "react";
import renderer from "react-test-renderer";
import TablePagination from "../components/elements/TableAPI/TablePagination";
import TableHeaders from "../components/elements/TableAPI/TableHeaders";

// bug with coverage https://github.com/facebook/create-react-app/issues/8689

describe("<TableAPI />", () => {
    it("renders pagination with a select", () => {
        const props = {
            onChange: jest.fn(),
            totalPages: 21,
            lastPage: 2,
            searchObj: {
                page: 1,
                perPage: 20,
            },
        };

        const pagination = renderer
            .create(<TablePagination {...props} />)
            .toJSON();
        expect(pagination).toMatchSnapshot();
    });

    it("renders regular pagination", () => {
        const props = {
            onChange: jest.fn(),
            totalPages: 9,
            lastPage: 2,
            searchObj: {
                page: 1,
                perPage: 20,
            },
        };

        const pagination = renderer
            .create(<TablePagination {...props} />)
            .toJSON();
        expect(pagination).toMatchSnapshot();
    });

    it("renders sortable headers", () => {
        const props = {
            onChange: jest.fn(),
            headers: [
                {
                    label: "Title",
                    columnMap: "roles.0.title", // name.title
                    disableSortBy: true,
                },
                {
                    label: "First Name",
                    columnMap: "first_name",
                },
                {
                    label: "Last Name",
                    columnMap: "last_name",
                },
                {
                    label: "Email",
                    columnMap: "email",
                    // disableSortBy: true,
                },
                {
                    label: "City",
                    columnMap: "address.city",
                },
            ],
            searchObj: {},
        };

        const tableHeader = renderer
            .create(<TableHeaders {...props} />)
            .toJSON();
        expect(tableHeader).toMatchSnapshot();
    });
});
