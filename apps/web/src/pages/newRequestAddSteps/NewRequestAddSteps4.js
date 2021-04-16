import React, { useState, useEffect, useMemo } from 'react';
import Select from '../../components/inputs/Select';

import './newRequestAddSteps.css';
import Button from '../../components/inputs/Button';

const NewRequestAddSteps4 = ({ data }) => {
    const [apiItem, setApiItem] = useState([
        {
            id: 'Select option',
            title: 'Select option',
            val: '',
            types: [],
        },
        {
            id: 'test 1',
            val: 'test 1',
            title: 'Test option 1',
            types: [
                'wheels',
                'skittles',
            ],
        },
        {
            id: 'test 2',
            val: 'test 2',
            title: 'Test option 2',
            types: [
                'shoes',
                'skittles',
            ],
        },
        {
            id: 'test 3',
            val: 'test 3',
            title: 'Test option 3',
            types: [
                'cats',
                'wheels',
                'skittles',
            ],
        },
    ]);

    const [itemTemplate] = useState({
        id: '',
        types: [],
    });

    const [item, setItem] = useState([itemTemplate]);

    const values = useMemo(() => {
        return item.filter(d => !!d.id);
    }, [item]);

    useEffect(() => {
        console.log({ values });
    }, [values]);

    const handleAppendItem = (originalDiag = item) => {
        if (originalDiag.length != 0) {
            if (!originalDiag[originalDiag.length - 1].id) {
                return;
            }
        }

        const oldDiag = [...originalDiag];
        oldDiag.push(itemTemplate);

        setItem(oldDiag);
    };

    const handleOnChange = async ({ target: { name, value, ...otherProps } }, index) => {
        // If the user removed the type it, then delete this row from the form.
        if (name == 'id' && !value) {
            return handleRemoveItemIndex(index);
        }
        const {
            types: selectedTypes = [],
        } = apiItem[apiItem.findIndex(({ id }) => id == value)];

        const newDiag = item.map((d, idx) =>
            idx == index ?
                { ...d, [name]: value, types: selectedTypes } :
                d,
        );
        await setItem(newDiag);
        handleAppendItem(newDiag);
        return true;
    };

    const handleRemoveItemIndex = async (index) => {
        const originalDiag = [...item];
        originalDiag.splice(index, 1);
        await setItem(originalDiag);
    };

    return (
        <>
            <div className="container-info">
                <div className="col-md-12 px-0">
                    <div className="row">
                        <div className="col-md-12">
                            <p className="title-info padding-title-step4">
                                Select a Request Classification / Category / Type
                            </p>
                        </div>

                        {item.map(({ id, types = [] }, index) => (<>
                            <div className="col-md-12">
                                <Button onClick={() => handleRemoveItemIndex(index)}>Remove {index} id
                                    - {id}</Button>
                                <Select
                                    onChange={e => handleOnChange(e, index)}
                                    name="id"
                                    value={id}
                                    label="Category"
                                    options={apiItem}
                                />
                            </div>

                            <div className="offset-md-1 col-md-11">
                                {types.map((t, value) => (
                                    <input
                                        disabled={true}
                                        readme={true}
                                        name={t}
                                        id={`${id}-${t}`}
                                        label="Type"
                                        value={t}
                                    />
                                ))}
                            </div>
                        </>))}
                    </div>
                </div>
            </div>
        </>
    );
};
export default NewRequestAddSteps4;
