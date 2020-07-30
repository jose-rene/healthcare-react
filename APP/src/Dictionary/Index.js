import {get} from 'lodash';

export const mash_field = (key, field_name = '') => {
    const found = get(en, key, '');

    if (field_name) {
        return found.replace(/%/, field_name)
    }

    return found.replace(/'%'\s?/, '')
}

export const en = {
    required: "This field '%' is required",
}
