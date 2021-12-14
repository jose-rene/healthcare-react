import Handlebars from "handlebars";

Handlebars.registerHelper("compare", function (v1, operator, v2, options) {
    const operators = {
        // eslint-disable-next-line
        "==": v1 == v2,
        "===": v1 === v2,
        // eslint-disable-next-line
        "!=": v1 != v2,
        "!==": v1 !== v2,
        ">": v1 > v2,
        ">=": v1 >= v2,
        "<": v1 < v2,
        "<=": v1 <= v2,
        "||": !!(v1 || v2),
        "&&": !!(v1 && v2),
    };
    if (operators.hasOwnProperty(operator)) {
        if (operators[operator]) {
            return options.fn(this);
        }
        return options.inverse(this);
    }
    return console.error('Error: Expression "' + operator + '" not found');
});

export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
};

export const template = (templateString, object) => {
    const templateObj = Handlebars.compile(templateString);
    return templateObj(object);
};

export const handlebarsTemplate = (templateString, object) => {
    try {
        const templateObj = Handlebars.compile(templateString);
        return templateObj(object);
    } catch (e) {
        return e.toString();
    }
};

/**
 *
 * @param condition
 * @param form -  this is required even though it's not used here. The eval method could pull in one of those values
 * @returns {any}
 */
export const jsEval = (condition, form) => {
    try {
        //const template = handlebarsTemplate(condition, data);
        const template = condition
            // make sure the template is looking at form
            .replace(/~/g, "form.")
            // catch undefined errors here. Should be ok to globally
            // use the optional operator
            .replace(/\./g, "?.");

        /* eslint no-eval: 0 */
        return eval(template);
    } catch (e) {}

    return false;
};
