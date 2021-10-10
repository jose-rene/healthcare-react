import React, { useEffect } from "react";
import PageLayout from "../../../../../layouts/PageLayout";
import { DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";
import useApiCall from "../../../../../hooks/useApiCall";
import FormListItem from "./FormListItem";
import { ReactSortable } from "react-sortablejs";
import useApiSortable from "../../../../../hooks/useApiSortable";

const GormGroupEdit = (params) => {
    const { match } = params;
    const { form_group_slug } = match.params || {};

    const [
        {
            loaded = false,
            items = [],
            setItems,
            handleSaveOrder,
        }, fireLoadGroups] = useApiSortable({
        keyBy: "slug",
        basUrl: `/form_group/${form_group_slug}`,

        formatter: ({ forms = [] }) => forms,
    });

    const [{ data: { data }, loading }, loadForms] = useApiCall({ url: "form" });

    useEffect(() => {
        loadForms();
        fireLoadGroups();
    }, []);

    const handleSaveSort = async () => {
        await handleSaveOrder(items);
    };

    const handleFormSelected = async (form) => {
        const newForms = [...items, form];
        await setItems(newForms);

        await handleSaveOrder(newForms);
    };

    return (
        <PageLayout loading={loading}>
            <div className="container mt-3">
                <h3>Form Group Editor form group slug - {form_group_slug}</h3>

                <div className="row my-3">
                    <div className="col">
                        <DropdownButton
                            as={ButtonGroup}
                            id="dropdown-basic-button"
                            class="w-100"
                            title="Add form to form group"
                        >
                            {data?.map(o => (
                                <Dropdown.Item
                                    onClick={() => handleFormSelected(o)}
                                >
                                    {o.name}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                </div>

                {loaded && (
                    <ReactSortable
                        list={items}
                        setList={setItems}
                        onEnd={handleSaveSort}
                        animation={200}
                        delayOnTouchStart={true}
                        delay={2}
                    >
                        {items.map((f, index) => (
                            <FormListItem
                                key={`form-list-${index}`}
                                {...f}
                                index={index}
                            />
                        ))}
                    </ReactSortable>
                )}
            </div>

        </PageLayout>
    );
};

export default GormGroupEdit;
