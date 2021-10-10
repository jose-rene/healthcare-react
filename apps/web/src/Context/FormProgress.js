import React, { useContext, createContext, useState, useEffect, useMemo } from "react";
import { set } from "lodash";

export const FormProgressContext = createContext({});

export const useFormProgressContext = () => useContext(FormProgressContext);

const FormProgressProvider = ({
    sections: baseSections = {},
    children,
}) => {
    const [sections, setSections] = useState(baseSections);

    useEffect(() => {
        setSections(baseSections);
    }, [baseSections]);

    const changeSectionStatus = (sectionName, { isCompleted = false }) => {
        const oldSections = { ...sections };
        set(oldSections, `${sectionName}.isCompleted`, isCompleted);
        setSections(oldSections);
    };

    const handleSetSections = (newSections = {}) => {
        // check to make sure isCompleted is set
        Object.keys(newSections).forEach(k => {
            const {
                isCompleted = "not-set",
            } = newSections[k];

            if (isCompleted === "not-set") {
                newSections[k].isCompleted = false;
            }
        });

        setSections(newSections);
    };

    const sectionsMapper = useMemo(() => {
        const mappedSections = [];

        Object.keys(sections).forEach(k => {
            mappedSections.push({ ...sections[k], name: k });
        });

        return mappedSections;
    }, [sections]);

    return (
        <FormProgressContext.Provider
            value={{
                sections,
                setSections,
                changeSectionStatus,
                handleSetSections,
                sectionsMapper,
            }}
        >
            {children}
        </FormProgressContext.Provider>
    );
};

export default FormProgressProvider;
