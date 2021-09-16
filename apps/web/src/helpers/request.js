export const _GET = (key, default_value = undefined) => {
    if (typeof window == 'undefined') return default_value;

    if (typeof URLSearchParams == "undefined") {
        const results = new RegExp("[?&]" + key + "=([^&#]*)").exec(window.location.href);

        return results == null ? null : decodeURI(results[1]) || 0;
    }
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get(key) || default_value;
};

export const _SET_GET = (key, value) => {
    if (typeof window == "undefined") {
        return false;
    }

    try {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set(key, value);
        window.history.pushState("", "", "?" + urlParams);
        return true;
    } catch (e) {
        console.log("_SET_GET.error", { e });
    }

    return false;
};
