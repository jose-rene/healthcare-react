import { createRef, useState } from "react";
import { slugify } from "../helpers/string";
import { toast } from "react-toastify";

const useToast = ({ type = "info", onClose = false } = {}) => {
    const [registry, setRegistry] = useState({});

    const isToastActive = (id) => {
        const { [id]: found = false } = registry;

        return found;
    };

    const toastDefault = ({
        message,
        messageType = type,
        onClose: _onClose = onClose,
        ...props
    }) => {
        const ref = createRef();
        props.toastId = slugify(message); // prevents duplicates

        if (isToastActive(props.toastId)) {
            return null;
        }

        setRegistry({ ...registry, [props.toastId]: true });

        props.onClose = () => {
            setRegistry({ ...registry, [props.toastId]: false });
            _onClose && _onClose({ message, messageType, ...props });
        };

        registry[props.toastId] = true;

        ref.current = toast[messageType](message, props);
    };

    const toastErrorDefault = (props) => {
        return toastDefault({
            type: "error",
            position: "top-center",
            timeout: 5000,
            ...props,
        });
    };

    const success = (message, props = {}) =>
        toastErrorDefault({ message, type: "success", ...props });
    const info = (message, props = {}) =>
        toastErrorDefault({ message, type: "info", ...props });
    const warn = (message, props = {}) =>
        toastErrorDefault({ message, type: "warn", ...props });
    const error = (message, props = {}) =>
        toastErrorDefault({ message, type: "error", ...props });

    // template toasts
    const formError = (
        message = "Make sure all fields pass validation",
        props = {}
    ) => toastErrorDefault({ message, ...props });
    const generalError = (
        message = "Oops. An error occurred please wait a few seconds and re-try.",
        props = {}
    ) => toastErrorDefault({ message, ...props });

    return { success, info, error, warn, formError, generalError };
};

export default useToast;
