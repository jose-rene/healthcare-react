import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useFormContext } from "../../../Context/FormContext";

/**
 *
 * @param name
 * @param value
 * @param onChange
 * @returns {JSX.Element}
 * @link https://www.tiny.cloud/docs/integrations/react/
 * @constructor
 */
const FancyEditor = ({
    name,
    height = 500,
    menubar = "tools",
}) => {
    const { getValue, update } = useFormContext();
    const value = getValue(name);

    const plugins = [
        "lists",
        "charmap",
        "searchreplace",
        "code",
        "insertdatetime",
        "contextmenu",
        "paste",
        "table",
        "wordcount",
    ];

    const handleOnChange = (newValue) => {
        update(name, newValue);
    };

    return (
        <Editor
            onEditorChange={handleOnChange}
            value={value}
            init={{
                height,
                menubar,
                plugins,
                toolbar: [
                    {
                        name: "history",
                        items: ["code", "undo", "redo", "insertdatetime"],
                    },
                    {
                        name: "styles",
                        items: ["styleselect", "table"],
                    },
                    {
                        name: "formatting",
                        items: ["bold", "italic", "underline"],
                    },
                    {
                        name: "list",
                        items: ["bullist"],
                    },
                    {
                        name: "edit",
                        items: ["searchreplace", "spellchecker", "wordcount"],
                    },
                ],
                table_toolbar:
                    "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
                paste_as_text: true,
                table_cell_advtab: false,
                table_row_advtab: false,
                insertdatetime_dateformat: "%m-%d-%Y",
                browser_spellcheck: true,
                formats: {
                    underline: { inline: "u", exact: true },
                },
                content_style:
                    "h1,h2,h3,h4,h5{margin-bottom:-.6em;margin-top:-.4em;}, p{line-height: 1em;}",
                style_formats: [
                    {
                        title: "Options",
                        items: [
                            { title: "Heading 1", format: "h1" },
                            { title: "Heading 2", format: "h2" },
                            { title: "Heading 3", format: "h3" },
                            { title: "Heading 4", format: "h4" },
                            { title: "Heading 5", format: "h5" },
                            { title: "Heading 6", format: "h6" },
                        ],
                    },
                ],
            }}
        />
    );
};

export default FancyEditor;
