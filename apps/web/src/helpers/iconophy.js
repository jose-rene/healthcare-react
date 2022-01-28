export const getIcon = (type) => {
    switch (type) {
        case "scheduling":
            return "clock";
        case "request-update":
            return "heart-rate";
        case "assigned":
            return "briefcase-medical";

        default:
            return "envelope";
    }
};
