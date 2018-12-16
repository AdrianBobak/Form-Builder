(function(){
    const playground = document.querySelector("#playground");
    const btn = playground.querySelector("button");

    btn.addEventListener("click", function(){
        playground.insertBefore(generateForm(), btn);
        cacheAll();
    });

    function generateForm(settings){
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

    function addInput(e){
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

    // function that delete selected form and all them siblings
    function delInput(e){
        e.preventDefault();
        if(confirm("Are you sure?")) {
            e.target.parentNode.parentNode.parentNode.remove();
            cacheAll();
        } else return;
    }

    // caching function
    function cacheAll(){
        let index = 0;
        // create array to add forms settings
        let cacheArr = [];
        const forms = document.querySelectorAll("form");
        forms.forEach(function(form){
            // create object with all form settings
            const obj = {
                index: index++,
                nest: form.parentNode.dataset.nest,
                typeValue: form.dataset.typeValue,
                questionInput: form.querySelector('[name="questionInput"]').value,
                selectValue: form.querySelector('[name="selectValue"]').value
            };
            if(form.querySelector('[name="conditionKey"]')) obj.conditionKey = form.querySelector('[name="conditionKey"]').value;
            if(form.querySelector('[name="conditionValue"]')) obj.conditionValue = form.querySelector('[name="conditionValue"]').value;
            cacheArr.push(obj);
        });
        addData(cacheArr);
    }

    // function that recover data from IndexedDB
    function recoverFromIndexedDB(items){
        const fragment = document.createDocumentFragment();
        items.forEach(function(elem){
            let form = generateForm(elem);
            if(parseInt(elem.nest) === 0){
                fragment.appendChild(form);
            } else {
                const elemParents = fragment.querySelectorAll(`[data-nest="${elem.nest -1}"]`);
                elemParents[elemParents.length -1].appendChild(form);
            }
        });
        playground.insertBefore(fragment, btn);
    }

    // indexedDB variable
    let db;

    // create IndexedDB element
    window.addEventListener("load", function(){

        if(!window.indexedDB) return;
        let request = indexedDB.open("formBuilder", 1);

        request.addEventListener("error", function(e) {
            throw e.target.error;
        });

        request.addEventListener("success", function() {
            db = request.result;
            readData();
        });

        request.addEventListener("upgradeneeded", function(e) {
            let db = e.target.result;
            db.createObjectStore("form", { keyPath: "index" });
        });
    });

    // function that reads data from IndexedDB
    function readData(){
        if(!window.indexedDB) return;
        let objectStore = db.transaction("form").objectStore("form");
        let allItems = objectStore.getAll();
        allItems.addEventListener("success", function(){
            recoverFromIndexedDB(allItems.result);
        });
        allItems.addEventListener("error", function(e){
            throw e.target.error;
        });
    }

    // add data to IndexedDB
    function addData(cacheArr){
        let transaction = db.transaction(["form"], "readwrite");
        let objectStore = transaction.objectStore("form");
        let request = objectStore.clear();

        request.addEventListener("error", function(e) {
            throw e.target.error;
        });

        cacheArr.forEach(function(elem){
            var request = db.transaction(["form"], "readwrite").objectStore("form").add(elem);
            request.addEventListener("error", function(e) {
                throw e.target.error;
            });
        });
    }
})();