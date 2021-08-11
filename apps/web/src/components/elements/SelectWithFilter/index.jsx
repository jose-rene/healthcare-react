import React, { useMemo, useState, useEffect } from "react";

import AsyncSelect from "react-select/async";
import { includes } from "lodash";

import "./SelectWithFilter.scss";

const SelectWithFilter = ({ name, ...props }) => {
    const {
        id = name,
        label,
        options = [],
        value,
        error = false,

        className,
        classNamePrefix = undefined,
        placeholder = "Enter search term(s)",
        disabled,
        isClearable = true,

        defaultIfOneOption = true,

        debug = false,

        onTermChange,
        onChange,

        optionFilterCheck = ({ term, option: { label, value, option } }) => {
            return (
                includes(label.toLowerCase(), term.toLowerCase()) ||
                includes(value.toLowerCase(), term.toLowerCase()) ||
                includes(option.id, term.toLowerCase())
            );
        },

        getOption = (option) => {
            const { label, text, value } = option;

            return {
                value,
                label: text || label,
                option,
            };
        },
    } = props;

    const [_defaultIfOneOption, setDefaultIfOneOption] = useState(
        defaultIfOneOption
    );

    const formattedOptions = useMemo(() => {
        return options.map((option) => getOption(option));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    const filterOptions = (search = "") => {
        if (!search.trim().length) {
            return formattedOptions;
        }
        const searchTerm = search.toLowerCase();

        return formattedOptions.filter((option) =>
            optionFilterCheck({
                term: searchTerm,
                option,
            })
        );
    };

    const loadOptions = (inputValue, callback) => {
        if (onTermChange) {
            onTermChange(inputValue, callback, getOption);
            // callback(onTermChange(inputValue));
        } else {
            callback(filterOptions(inputValue));
        }
    };

    const getTheme = (theme) => ({
        ...theme,
        borderRadius: 0,

        // TODO:: does not work probably using the wrong prop
        control: {
            height: 48,
        },

        spacing: {
            ...theme.spacing,
            controlHeight: 49,
        },
    });

    const getLabelForValue = (value) => {
        const found_option =
            formattedOptions.find((option) => option.value === value) || {};

        debug && console.log("base.getLabelForValue", { found_option });

        return found_option.label || "";
    };

    /**
     * this method is triggered many times. check to make sure the value has changed before triggering again.
     *
     * @param label
     * @param value
     * @param option
     */
    const handleOnChange = (e) => {
        const { label = "", value = "", option = {} } = e || {};
        debug && console.log("base.handleOnChange", { label, value, option });
        if (value !== props.value) {
            debug && console.log("base.handleOnChange.calling.onChange");
            onChange({
                target: {
                    name,
                    value: value || "",
                    label: label || "",
                    option: option || {},
                },
            });
        }
    };

    const setFirstOption = () => {
        if (_defaultIfOneOption !== true || options.length !== 1) {
            return false;
        }

        setDefaultIfOneOption(false);

        const { value: singleValue = "" } = getOption(options[0]) || {};

        onChange({ target: { name, value: singleValue } });
    };

    const selectValue = useMemo(() => {
        if (value) {
            return {
                label: getLabelForValue(value),
                value,
            };
        }

        return "";

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, options]);

    useEffect(() => {
        setFirstOption();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);

    return (
        <div>
            <div className="form-group" id={`${id}-wrapper`}>
                {label && (
                    <label
                        htmlFor={id}
                        className={`control-label label-for-${name}`}
                    >
                        {label}
                    </label>
                )}
                <AsyncSelect
                    id={id}
                    placeholder={placeholder}
                    name={name}
                    classNamePrefix={classNamePrefix}
                    className={className}
                    loadOptions={loadOptions}
                    defaultOptions={formattedOptions}
                    cacheOptions={true}
                    value={selectValue}
                    theme={getTheme}
                    onChange={handleOnChange}
                    isDisabled={disabled}
                    isClearable={isClearable}
                />
                {error && (
                    <ul className="parsley-errors-list filled">
                        <li className="parsley-required">{error}</li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SelectWithFilter;
