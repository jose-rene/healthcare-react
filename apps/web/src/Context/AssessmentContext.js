import React, {
    createContext,
    useState,
    useContext,
    useMemo,
    useEffect,
} from "react";
import { set, isEmpty } from "lodash";

export const AssessmentContext = createContext({});
export const useAssessmentContext = () => useContext(AssessmentContext);

export const AssessmentProvider = ({ children }) => {
    const [sections, setSections] = useState({});
    const [criticalFactors, setCriticalFactors] = useState({});
    const [sectionStatuses, setSectionStatuses] = useState({});
    const [fullFormValid, setFullFormValid] = useState({});

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sections]);

    const sectionsCompleted = useMemo(() => {
        if (isEmpty(sectionStatuses)) {
            return false;
        }

        let isCompleted = true;

        Object.keys(sectionStatuses).forEach((key) => {
            if (isCompleted === true && !sectionStatuses[key]) {
                isCompleted = false;
            }
        });

        return isCompleted;
    }, [sectionStatuses]);

    const isFullFormValid = useMemo(() => {
        let isCompleted = true;

        Object.keys(fullFormValid).forEach((key) => {
            if (isCompleted === true && !fullFormValid[key]) {
                isCompleted = false;
            }
        });

        return isCompleted;
    }, [fullFormValid]);

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

    /**
     *
     * @param {string} sectionName section name of the form
     * @param {boolean} [status] valid(true) of not valid(false)
     */
    const setFormValidation = (sectionName, status = true) => {
        setFullFormValid((prev) => ({ ...prev, [sectionName]: status }));
    };

    const updateFormValidation = ($validation) =>
        setFullFormValid((prev) => ({ ...prev, ...$validation }));

    const isSectionValid = (name) => {
        const { [name]: valid = false } = fullFormValid;
        return valid;
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
                fullFormValid,
                setFormValidation,
                updateFormValidation,
                isSectionValid,
                isFullFormValid: isFullFormValid && sectionsCompleted,
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
