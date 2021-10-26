import React, { useRef, useState, useEffect } from "react";
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
    const [editorValue, setEditorValue] = useState("");
    const editorRef = useRef(null);

    const toolbarSections = [
        "undo redo",
        "formatselect",
        "bold italic underline backcolor",
        "alignleft aligncenter alignright alignjustify",
        "bullist numlist outdent indent",
        "removeformat",
        "help",
    ];

    const plugins = [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "print",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "paste",
        "code",
        "help",
        "wordcount",
    ];

    useEffect(() => {
        setEditorValue(value);
    }, [value]);

    const handleOnChange = () => {
        const newValue = editorRef.current.getContent();
        setEditorValue(newValue);
        update(name, newValue);
    };

    return (
        <Editor
            onInit={(evt, editor) => editorRef.current = editor}
            onSelectionChange={handleOnChange}
            value={editorValue}
            init={{
                height,
                menubar,
                plugins,
                toolbar: toolbarSections.join(" | "),
                //content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
        />
    );
};

export default FancyEditor;
