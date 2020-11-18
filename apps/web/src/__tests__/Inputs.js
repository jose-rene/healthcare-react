import "@testing-library/jest-dom";
import React from "react";
import renderer from "react-test-renderer";
import Checkbox from "../components/inputs/Checkbox";
import Textarea from "../components/inputs/Textarea";
import InputText from "../components/inputs/InputText";
import Select from "../components/inputs/Select";

// bug with coverage https://github.com/facebook/create-react-app/issues/8689

describe("Input Components", () => {
    it("renders Text input correctly", () => {
        const input = renderer.create(<InputText />).toJSON();
        expect(input).toMatchSnapshot();
    });
    it("renders Checkbox input correctly", () => {
        const input = renderer.create(<Checkbox />).toJSON();
        expect(input).toMatchSnapshot();
    });
    it("renders Textarea input correctly", () => {
        const input = renderer.create(<Textarea />).toJSON();
        expect(input).toMatchSnapshot();
    });
    it("renders Select input correctly", () => {
        const input = renderer.create(<Select />).toJSON();
        expect(input).toMatchSnapshot();
    });
});
