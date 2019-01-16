import { generateForm } from "./generate.js";

// indexedDB variable
let db;

// create IndexedDB element
window.addEventListener("load", () => {

    if(!window.indexedDB) return;
    const request = indexedDB.open("formBuilder", 1);

    request.addEventListener("error", e => {
        throw e.target.error;
    });

    request.addEventListener("success", () => {
        db = request.result;
        readData();
    });

    request.addEventListener("upgradeneeded", e => {
        const db = e.target.result;
        db.createObjectStore("form", { keyPath: "index" });
    });
});

// function that reads data from IndexedDB
const readData = () => {
    if(!window.indexedDB) return;
    const objectStore = db.transaction("form").objectStore("form");
    const allItems = objectStore.getAll();
    allItems.addEventListener("success", () => {
        recoverFromIndexedDB(allItems.result);
    });
    allItems.addEventListener("error", e => {
        throw e.target.error;
    });
}

// function that recover data from IndexedDB
const recoverFromIndexedDB = (items) => {
    const fragment = document.createDocumentFragment();
    items.forEach(elem => {
        const form = generateForm(elem);
        if(parseInt(elem.nest) === 0){
            fragment.appendChild(form);
        } else {
            const elemParents = fragment.querySelectorAll(`[data-nest="${elem.nest -1}"]`);
            elemParents[elemParents.length -1].appendChild(form);
        }
    });
    playground.insertBefore(fragment, document.querySelector("#addInput"));
}


// caching function
export const cacheAll = () => {
    let index = 0;
    // create array to add forms settings
    const cacheArr = [];
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
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

// add data to IndexedDB
const addData = cacheArr => {
    const transaction = db.transaction(["form"], "readwrite");
    const objectStore = transaction.objectStore("form");
    const request = objectStore.clear();

    request.addEventListener("error", e => {
        throw e.target.error;
    });

    cacheArr.forEach(elem => {
        const request = db.transaction(["form"], "readwrite").objectStore("form").add(elem);
        request.addEventListener("error", e => {
            throw e.target.error;
        });
    });
}