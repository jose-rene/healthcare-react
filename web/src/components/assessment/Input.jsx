import React from "react";
import { useFormContext } from "react-hook-form";
import InputText from "../inputs/InputText";
import Select from "../inputs/Select";
import Textarea from "../inputs/Textarea";
import Checkbox from "../inputs/Checkbox";

function Input({ data }) {
  const name = `input_${data.id}`;
  // get these from the react hooks forms context rather than passing down
  const { register, errors } = useFormContext();
  const validation = { required: data.required ? "This is required" : false };
  // console.log("render", data.ele_type, JSON.stringify(data));
  switch (data.ele_type) {
    case "textarea":
      return (
        <div>
          <Textarea
            name={name}
            label={data.title}
            ref={register(validation)}
            errors={errors}
          />
        </div>
      );
    case "select":
      return (
        <div>
          <Select
            label={data.title}
            ref={register(validation)}
            options={
              data.valuelist && data.valuelist.listitems
                ? data.valuelist.listitems
                : []
            }
            name={name}
            errors={errors}
          />
        </div>
      );
      case "checkbox":
        return (
        <div>
            <Checkbox
            name={name}
            label={data.title}
            ref={register(validation)}
            errors={errors}
            />
        </div>
        );
    case "text":
    default:
      return (
        <div>
          <InputText
            name={name}
            label={data.title}
            ref={register(validation)}
            errors={errors}
          />
        </div>
      );
  }
}

export default Input;
