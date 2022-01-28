import React, { useState, useEffect } from "react";

import { useUser } from "Context/UserContext";

import FapIcon from "components/elements/FapIcon";

import { fromUtcTime, fromUtcDate } from "helpers/datetime";
import { getIcon } from "helpers/iconophy";

import Item from "./TreeItem";

export default (props) => {
    const [items, setItems] = useState();

    const { getUser } = useUser();
    const { timeZoneName } = getUser();

    useEffect(() => {
        setItems(props.items);
    }, [props.items]);

    /*
        The default slot is also the labelSlot. If the user passes in
        a rendering function then we use that, otherwise we render
        the title.
     */
    const labelSlot =
        props.children instanceof Function
            ? (item) => (
                  <span onClick={() => toggleOpen(item)}>
                      {props.children(item)}
                  </span>
              )
            : (item) => (
                  <div className="content">
                      <time className="cbp_tmtime">
                          <span className="large">
                              {fromUtcTime(item.datetime, timeZoneName)}
                          </span>{" "}
                          <span>
                              {fromUtcDate(item.datetime, "MM/DD/YYYY")}
                          </span>
                      </time>
                      <div className="cbp_tmicon">
                          <FapIcon
                              icon={
                                  item.type ? getIcon(item.type) : "briefcase"
                              }
                              size="1x"
                          />
                      </div>
                      <div className="cbp_tmlabel">
                          {" "}
                          <span>{item.message}</span>{" "}
                      </div>
                  </div>
              );

    /*
        Optional prepend slot
     */
    const prependSlot =
        props.prependSlot instanceof Function
            ? (item) => props.prependSlot(item)
            : () => props.prependSlot;

    return (
        <>
            {items && (
                <Item
                    key="1"
                    {...{
                        ...props,
                        prependSlot,
                        labelSlot,
                        toggleOpen,
                        items,
                    }}
                />
            )}
        </>
    );

    /*
        Toggle the $open state of an item 
        in the (nested) items array.
     */
    function toggleOpen(item) {
        setItems(toggle(items, item));

        function toggle(items) {
            let result = items.map((i) => {
                return i.id === item.id
                    ? {
                          ...i,
                          $open: !i.$open,
                      }
                    : {
                          ...i,
                          ...(i.items && { items: toggle(i.items) }),
                      };
            });
            return result;
        }
    }
};
