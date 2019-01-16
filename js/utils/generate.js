import { delInput } from "./delete.js";
import { cacheAll } from "./cache.js";

export const addInput = e => {
    e.preventDefault();
    let settings = {};

    // container of the clicked form
    const clickedForm = e.target.parentNode.parentNode.parentNode;
    // add data-nest attribute to new element
    settings.nest = parseInt(clickedForm.dataset.nest) +1;
    // add data-type-value attribute (text, number, radio) to new element
    settings.typeValue = clickedForm.querySelector(".type select").value;
    // add new element to container
    clickedForm.appendChild(generateForm(settings));
    // trigger caching function
    cacheAll();
}

export const generateForm = settings => {
    // add form container and form
    const container = document.createElement("div");
    const form = document.createElement("form");
    
    // add nest and margin
    if(settings && settings.nest){
        container.dataset.nest = settings.nest;
        form.style.marginLeft = settings.nest * 30 + "px";
    } else {
        container.dataset.nest = 0;
        form.style.marginLeft = 0;
    }

    // add data-type-value attribute (text, number, radio)
    if(settings && settings.typeValue) form.dataset.typeValue = settings.typeValue;
    
    // if new form has no parent form:
    if(settings && settings.nest > 0){

        // add the Condition row
        const condition = document.createElement("div");
        condition.classList.add("row", "condition");

        const conditionParagraph = document.createElement("p");
        conditionParagraph.textContent = "Condition";
        condition.appendChild(conditionParagraph);

        // add condition select
        const conditionKey = document.createElement("select");
        conditionKey.name = "conditionKey";
        // add Equals option
        const conditionOptionEquals = document.createElement("option");
        conditionOptionEquals.value = "Equals";
        conditionOptionEquals.textContent = "Equals";
        conditionKey.appendChild(conditionOptionEquals);

        // if it's number form, add aditional options
        if(settings.typeValue === "number"){
            const conditionOptionGreater = document.createElement("option");
            conditionOptionGreater.value = "Greater than";
            conditionOptionGreater.textContent = "Greater than";
            conditionKey.appendChild(conditionOptionGreater);

            const conditionOptionLess = document.createElement("option");
            conditionOptionLess.value = "Less than";
            conditionOptionLess.textContent = "Less than";
            conditionKey.appendChild(conditionOptionLess);
        }

        // add data from settings (if exist)
        if(settings && settings.conditionKey) conditionKey.value = settings.conditionKey;
        // add caching event
        conditionKey.addEventListener("change", cacheAll);
        condition.appendChild(conditionKey);

        // if it's radio form, add select
        if(settings.typeValue === "radio"){
            const conditionValue = document.createElement("select");
            conditionValue.name = "conditionValue";
            const valueYes = document.createElement("option");
            valueYes.value = "Yes";
            valueYes.textContent = "Yes";
            conditionValue.appendChild(valueYes);

            const valueNo = document.createElement("option");
            valueNo.value = "No";
            valueNo.textContent = "No";
            conditionValue.appendChild(valueNo);

            // add data from settings (if exist)
            if(settings && settings.conditionValue) conditionValue.value = settings.conditionValue;
            // add caching event
            conditionValue.addEventListener("change", cacheAll);
            condition.appendChild(conditionValue);
        } else {
            // if it isn't radio form, add text or number input
            const conditionValue = document.createElement("input");
            conditionValue.name = "conditionValue";

            if(settings.typeValue === "number"){
                conditionValue.type = "number";
            } else conditionValue.type = "text";

            // add data from settings (if exist)
            if(settings.conditionValue) conditionValue.value = settings.conditionValue;
            // add caching event 
            conditionValue.addEventListener("change", cacheAll);
            condition.appendChild(conditionValue);
        }
        form.appendChild(condition);
    }

    // add the Question row
    const question = document.createElement("div");
    question.classList.add("row", "question");

    const questionParagraph = document.createElement("p");
    questionParagraph.textContent = "Question";
    question.appendChild(questionParagraph);

    // add Question input
    const questionInput = document.createElement("input");
    questionInput.name = "questionInput";
    questionInput.type = "text";

    // add data from settings (if exist)
    if(settings && settings.questionInput) questionInput.value = settings.questionInput;
    // add caching event 
    questionInput.addEventListener("change", cacheAll);
    question.appendChild(questionInput);

    form.appendChild(question);


    // add the Type row
    const type = document.createElement("div");
    type.classList.add("row", "type");

    const typeParagraph = document.createElement("p");
    typeParagraph.textContent = "Type";
    type.appendChild(typeParagraph);

    // add select and options
    const selectValue = document.createElement("select");
    selectValue.name = "selectValue";

    const optionText = document.createElement("option");
    optionText.value = "text";
    optionText.textContent = "Text";
    selectValue.appendChild(optionText);

    const optionNumber = document.createElement("option");
    optionNumber.value = "number";
    optionNumber.textContent = "Number";
    selectValue.appendChild(optionNumber);

    const optionRadio = document.createElement("option");
    optionRadio.value = "radio";
    optionRadio.textContent = "Yes / No";
    selectValue.appendChild(optionRadio);

    // add data from settings (if exist)
    if(settings && settings.selectValue) selectValue.value = settings.selectValue;
    // add caching event 
    selectValue.addEventListener("change", cacheAll);
    type.append(selectValue);

    form.appendChild(type);


    // creating row with buttons
    const buttons = document.createElement("div");
    buttons.classList.add("row", "submit");

    const addNewInput = document.createElement("input");
    addNewInput.type = "submit";
    addNewInput.value = "Add Sub-input";
    addNewInput.addEventListener("click", addInput);
    buttons.appendChild(addNewInput);

    const deleteInput = document.createElement("input");
    deleteInput.type = "submit";
    deleteInput.value = "Delete";
    deleteInput.addEventListener("click", delInput);
    buttons.appendChild(deleteInput);

    form.appendChild(buttons);

    // add all form to container
    container.appendChild(form);

    return container;
}