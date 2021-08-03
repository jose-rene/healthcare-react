import { template as _template } from 'lodash';

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
    try {
        const compiled = _template(templateString, { strict: false });
        return compiled(object);
    } catch (e) {
        const varToDefine = e.message.replace(/\sis not defined/, '');
        return template(templateString, { ...object, [varToDefine]: '' });
    }
};
