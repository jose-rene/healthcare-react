import React from "react";
import Questions from "./Questions";
import Input from "./Input";

function Sections({ data }) {
    const listItems = data.map((section) => {
        let headerQuestions;
        let questions;
        if (section.questions?.length) {
            headerQuestions = section.questions.find(
                (item) =>
                    item.question_type && item.question_type === "na_toggle"
            );
            questions = section.questions.filter((item) => !item.question_type);
        }
        console.log(headerQuestions ?? "None");
        return (
            <li key={section.id}>
                <div className="card">
                    <div className="card-header">
                        <h4>{section.title}</h4>
                        {headerQuestions ? (
                            <Input data={headerQuestions} />
                        ) : null}
                    </div>
                    <div className="card-body">
                        {questions.length ? (
                            <Questions data={questions} />
                        ) : null}
                        {section.childSections ? (
                            <Sections data={section.childSections} />
                        ) : null}
                    </div>
                </div>
            </li>
        );
    });
    return (
        <ul className="list-unstyled list-group list-group-flush text-left">
            {listItems}
        </ul>
    );
}

export default Sections;
