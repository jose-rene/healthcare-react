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
        <div key={item.id} className="d-flex flex-wrap" style={style}>
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
                        style: { ...style, marginLeft: "20px" },
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
