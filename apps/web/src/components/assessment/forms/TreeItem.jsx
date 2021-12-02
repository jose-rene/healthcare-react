import React from "react";

export default function Item({
    items,
    style,
    toggleOpen,
    labelSlot,
    prependSlot,
    expanderOpen,
    expanderClosed,
}) {
    const subTree = items.map((item) => (
        <div key={item.id} className="d-flex flex-wrap w-100" style={style}>
            <span onClick={() => toggleOpen(item)} className="expander">
                {item.activities
                    ? item.$open
                        ? expanderOpen
                        : expanderClosed
                    : null}
            </span>
            {prependSlot(item)}
            {labelSlot(item)}
            {item.activities && item.$open && (
                <Item
                    {...{
                        style: { ...style, marginLeft: "50px" },
                        items: item.activities,
                        toggleOpen,
                        labelSlot,
                        prependSlot,
                        expanderOpen,
                        expanderClosed,
                    }}
                />
            )}
        </div>
    ));

    return subTree;
}
