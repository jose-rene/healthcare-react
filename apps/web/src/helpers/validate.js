import * as Yup from "yup";

export const validateFile = (file) => {
    if (!file) {
        return "No File Found";
    }
    if (file.type.indexOf("image") === -1 && file.type.indexOf("pdf") === -1) {
        return "File upload failed. Your file is not a supported file type. (image or pdf)";
    }
    if (file.size > 8000000) {
        return "File upload failed. Your file exceeded the 8MB size limit.";
    }
    return null;
};

export const validateImage = (file) => {
    if (!file) {
        return "No File Found";
    }
    if (file.type.indexOf("image") === -1) {
        return "File upload failed. Your file is not a supported file type. (image)";
    }
    if (file.size > 8000000) {
        return "File upload failed. Your file exceeded the 8MB size limit.";
    }
    return null;
};

export default Yup;
