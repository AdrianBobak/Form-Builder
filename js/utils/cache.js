import { generateForm } from "./generate.js";

// indexedDB variable
let db;

// create IndexedDB element
window.addEventListener("load", function(){

    if(!window.indexedDB) return;
    const request = indexedDB.open("formBuilder", 1);

    request.addEventListener("error", function(e) {
        throw e.target.error;
    });

    request.addEventListener("success", function() {
        db = request.result;
        readData();
    });

    request.addEventListener("upgradeneeded", function(e) {
        const db = e.target.result;
        db.createObjectStore("form", { keyPath: "index" });
    });
});

// function that reads data from IndexedDB
function readData(){
    if(!window.indexedDB) return;
    const objectStore = db.transaction("form").objectStore("form");
    const allItems = objectStore.getAll();
    allItems.addEventListener("success", function(){
        recoverFromIndexedDB(allItems.result);
    });
    allItems.addEventListener("error", function(e){
        throw e.target.error;
    });
}

// function that recover data from IndexedDB
function recoverFromIndexedDB(items){
    const fragment = document.createDocumentFragment();
    items.forEach(function(elem){
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
export function cacheAll(){
    let index = 0;
    // create array to add forms settings
    const cacheArr = [];
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

// add data to IndexedDB
function addData(cacheArr){
    const transaction = db.transaction(["form"], "readwrite");
    const objectStore = transaction.objectStore("form");
    const request = objectStore.clear();

    request.addEventListener("error", function(e) {
        throw e.target.error;
    });

    cacheArr.forEach(function(elem){
        const request = db.transaction(["form"], "readwrite").objectStore("form").add(elem);
        request.addEventListener("error", function(e) {
            throw e.target.error;
        });
    });
}