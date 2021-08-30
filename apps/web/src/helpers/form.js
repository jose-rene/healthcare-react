/**
 * @example objFilterThenArray({test: {one: true, two: false}, another: {}}, 'test')
 * @example_return [one]
 * @param hostObj
 * @param key
 * @returns {*[]}
 */
export const objFilterThenArray = (hostObj, key) => {
    const { [key]: obj = {} } = hostObj;
    const rtv = [];

    Object.keys(obj).forEach(n => {
        if (obj[n]) {
            rtv.push(n);
        }
    });

    return rtv;
};
