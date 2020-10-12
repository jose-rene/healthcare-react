import React from "react";
// import { useFormContext } from "react-hook-form";
import Input from "./Input";

function Questions({ data }) {
  // pass these down as props instead of use context, it would re-render for every input
  // const { register, errors } = useFormContext();
  const listItems = data.map((question) => (
    <li className="list-group-item" key={question.id}>
      <Input data={question} />
    </li>
  ));
  return <ul className="list-group">{listItems}</ul>;
}

export default Questions;
