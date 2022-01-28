import React, {
    createContext,
    useState,
    useContext,
    useMemo,
    useEffect,
} from "react";
import { set } from "lodash";

export const AssessmentContext = createContext({});
export const useAssessmentContext = () => useContext(AssessmentContext);

export const AssessmentProvider = ({ children }) => {
    const [sections, setSections] = useState({});
    const [criticalFactors, setCriticalFactors] = useState({});
    const [sectionStatuses, setSectionStatuses] = useState({});

    const processSections = () => {
        const sectionStatuses = {};
        const criticalFactors = {};

        Object.keys(sections).forEach((sectionName) => {
            const thisSection = sections[sectionName];

            const { completed_form = false, ...fields } = thisSection;

            Object.keys(fields).forEach((key) => {
                const currentField = fields[key];
                const { cf = false } = currentField;

                if (cf) {
                    set(criticalFactors, `${sectionName}.${key}`, currentField);
                }
            });

            sectionStatuses[sectionName] = completed_form;
        });

        setCriticalFactors(criticalFactors);
        setSectionStatuses(sectionStatuses);
    };

    useEffect(() => {
        processSections();
    }, [sections]);

    const sectionsCompleted = useMemo(() => {
        let isCompleted = true;

        Object.keys(sectionStatuses).forEach((key) => {
            if (isCompleted === true && !sectionStatuses[key]) {
                isCompleted = false;
            }
        });

        return isCompleted;
    }, [sectionStatuses]);

    /**
     *
     * @param {string} section_name
     * @param {array} values
     */
    const update = (section_name, values) => {
        setSections((prev) => {
            return { ...prev, [section_name]: values };
        });
    };

    const sectionStatus = (sectionName) => {
        return sectionStatuses[sectionName] || false;
    };

    return (
        <AssessmentContext.Provider
            value={{
                sectionsCompleted,
                criticalFactors,
                sectionStatus,
                sectionStatuses,
                update,
                sections,
                setSections,
            }}
        >
            {/*
            <strong>criticalFactors</strong>
            <pre>
                {JSON.stringify(criticalFactors, null, 2)}
            </pre>
            <strong>sections</strong>
            <pre>
                {JSON.stringify(sections, null, 2)}
            </pre>
            */}
            {children}
        </AssessmentContext.Provider>
    );
};
