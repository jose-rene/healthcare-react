export const ACTIONS = "actions";

export const mapTypeToClass = (columnType) => {
    switch (columnType) {
        case ACTIONS:
            return "text-center text-nowrap";
        case Number:
            return "text-right";
        case String:
        default:
            return "text-left align-middle";
    }
};
