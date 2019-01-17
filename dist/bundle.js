/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./js/utils/cache.js
 // indexedDB variable

var db; // create IndexedDB element

window.addEventListener("load", function () {
  if (!window.indexedDB) return;
  var request = indexedDB.open("formBuilder", 1);
  request.addEventListener("error", function (e) {
    throw e.target.error;
  });
  request.addEventListener("success", function () {
    db = request.result;
    readData();
  });
  request.addEventListener("upgradeneeded", function (e) {
    var db = e.target.result;
    db.createObjectStore("form", {
      keyPath: "index"
    });
  });
}); // function that reads data from IndexedDB

var readData = function readData() {
  if (!window.indexedDB) return;
  var objectStore = db.transaction("form").objectStore("form");
  var allItems = objectStore.getAll();
  allItems.addEventListener("success", function () {
    cache_recoverFromIndexedDB(allItems.result);
  });
  allItems.addEventListener("error", function (e) {
    throw e.target.error;
  });
}; // function that recover data from IndexedDB


var cache_recoverFromIndexedDB = function recoverFromIndexedDB(items) {
  var fragment = document.createDocumentFragment();
  items.forEach(function (elem) {
    var form = generate_generateForm(elem);

    if (parseInt(elem.nest) === 0) {
      fragment.appendChild(form);
    } else {
      var elemParents = fragment.querySelectorAll("[data-nest=\"".concat(elem.nest - 1, "\"]"));
      elemParents[elemParents.length - 1].appendChild(form);
    }
  });
  playground.insertBefore(fragment, document.querySelector("#addInput"));
}; // caching function


var cacheAll = function cacheAll() {
  var index = 0; // create array to add forms settings

  var cacheArr = [];
  var forms = document.querySelectorAll("form");
  forms.forEach(function (form) {
    // create object with all form settings
    var obj = {
      index: index++,
      nest: form.parentNode.dataset.nest,
      typeValue: form.dataset.typeValue,
      questionInput: form.querySelector('[name="questionInput"]').value,
      selectValue: form.querySelector('[name="selectValue"]').value
    };
    if (form.querySelector('[name="conditionKey"]')) obj.conditionKey = form.querySelector('[name="conditionKey"]').value;
    if (form.querySelector('[name="conditionValue"]')) obj.conditionValue = form.querySelector('[name="conditionValue"]').value;
    cacheArr.push(obj);
  });
  addData(cacheArr);
}; // add data to IndexedDB

var addData = function addData(cacheArr) {
  var transaction = db.transaction(["form"], "readwrite");
  var objectStore = transaction.objectStore("form");
  var request = objectStore.clear();
  request.addEventListener("error", function (e) {
    throw e.target.error;
  });
  cacheArr.forEach(function (elem) {
    var request = db.transaction(["form"], "readwrite").objectStore("form").add(elem);
    request.addEventListener("error", function (e) {
      throw e.target.error;
    });
  });
};
// CONCATENATED MODULE: ./js/utils/delete.js
 // function that delete selected form and all them siblings

var delete_delInput = function delInput(e) {
  e.preventDefault();

  if (confirm("Are you sure?")) {
    e.target.parentNode.parentNode.parentNode.remove();
    cacheAll();
  } else return;
};
// CONCATENATED MODULE: ./js/utils/generate.js


var generate_addInput = function addInput(e) {
  e.preventDefault();
  var isFilled = e.target.parentNode.parentNode.querySelector(".question input");

  if (!isFilled.value) {
    isFilled.classList.add("error");
    return;
  } else isFilled.classList.remove("error");

  var settings = {}; // container of the clicked form

  var clickedForm = e.target.parentNode.parentNode.parentNode; // add data-nest attribute to new element

  settings.nest = parseInt(clickedForm.dataset.nest) + 1; // add data-type-value attribute (text, number, radio) to new element

  settings.typeValue = clickedForm.querySelector(".type select").value; // add new element to container

  clickedForm.appendChild(generate_generateForm(settings)); // trigger caching function

  cacheAll();
};
var generate_generateForm = function generateForm(settings) {
  // add form container and form
  var container = document.createElement("div");
  var form = document.createElement("form"); // add nest and margin

  if (settings && settings.nest) {
    container.dataset.nest = settings.nest;
    form.style.marginLeft = settings.nest * 30 + "px";
  } else {
    container.dataset.nest = 0;
    form.style.marginLeft = 0;
  } // add data-type-value attribute (text, number, radio)


  if (settings && settings.typeValue) form.dataset.typeValue = settings.typeValue; // if new form has no parent form:

  if (settings && settings.nest > 0) {
    // add the Condition row
    var condition = document.createElement("div");
    condition.classList.add("row", "condition");
    var conditionParagraph = document.createElement("p");
    conditionParagraph.textContent = "Condition";
    condition.appendChild(conditionParagraph); // add condition select

    var conditionKey = document.createElement("select");
    conditionKey.name = "conditionKey"; // add Equals option

    var conditionOptionEquals = document.createElement("option");
    conditionOptionEquals.value = "Equals";
    conditionOptionEquals.textContent = "Equals";
    conditionKey.appendChild(conditionOptionEquals); // if it's number form, add aditional options

    if (settings.typeValue === "number") {
      var conditionOptionGreater = document.createElement("option");
      conditionOptionGreater.value = "Greater than";
      conditionOptionGreater.textContent = "Greater than";
      conditionKey.appendChild(conditionOptionGreater);
      var conditionOptionLess = document.createElement("option");
      conditionOptionLess.value = "Less than";
      conditionOptionLess.textContent = "Less than";
      conditionKey.appendChild(conditionOptionLess);
    } // add data from settings (if exist)


    if (settings && settings.conditionKey) conditionKey.value = settings.conditionKey; // add caching event

    conditionKey.addEventListener("change", cacheAll);
    condition.appendChild(conditionKey); // if it's radio form, add select

    if (settings.typeValue === "radio") {
      var conditionValue = document.createElement("select");
      conditionValue.name = "conditionValue";
      var valueYes = document.createElement("option");
      valueYes.value = "Yes";
      valueYes.textContent = "Yes";
      conditionValue.appendChild(valueYes);
      var valueNo = document.createElement("option");
      valueNo.value = "No";
      valueNo.textContent = "No";
      conditionValue.appendChild(valueNo); // add data from settings (if exist)

      if (settings && settings.conditionValue) conditionValue.value = settings.conditionValue; // add caching event

      conditionValue.addEventListener("change", cacheAll);
      condition.appendChild(conditionValue);
    } else {
      // if it isn't radio form, add text or number input
      var _conditionValue = document.createElement("input");

      _conditionValue.name = "conditionValue";

      if (settings.typeValue === "number") {
        _conditionValue.type = "number";
      } else _conditionValue.type = "text"; // add data from settings (if exist)


      if (settings.conditionValue) _conditionValue.value = settings.conditionValue; // add caching event 

      _conditionValue.addEventListener("change", cacheAll);

      condition.appendChild(_conditionValue);
    }

    form.appendChild(condition);
  } // add the Question row


  var question = document.createElement("div");
  question.classList.add("row", "question");
  var questionParagraph = document.createElement("p");
  questionParagraph.textContent = "Question";
  question.appendChild(questionParagraph); // add Question input

  var questionInput = document.createElement("input");
  questionInput.name = "questionInput";
  questionInput.type = "text"; // add data from settings (if exist)

  if (settings && settings.questionInput) questionInput.value = settings.questionInput; // add caching event 

  questionInput.addEventListener("change", cacheAll);
  question.appendChild(questionInput);
  form.appendChild(question); // add the Type row

  var type = document.createElement("div");
  type.classList.add("row", "type");
  var typeParagraph = document.createElement("p");
  typeParagraph.textContent = "Type";
  type.appendChild(typeParagraph); // add select and options

  var selectValue = document.createElement("select");
  selectValue.name = "selectValue";
  var optionText = document.createElement("option");
  optionText.value = "text";
  optionText.textContent = "Text";
  selectValue.appendChild(optionText);
  var optionNumber = document.createElement("option");
  optionNumber.value = "number";
  optionNumber.textContent = "Number";
  selectValue.appendChild(optionNumber);
  var optionRadio = document.createElement("option");
  optionRadio.value = "radio";
  optionRadio.textContent = "Yes / No";
  selectValue.appendChild(optionRadio); // add data from settings (if exist)

  if (settings && settings.selectValue) selectValue.value = settings.selectValue; // add caching event 

  selectValue.addEventListener("change", cacheAll);
  type.append(selectValue);
  form.appendChild(type); // creating row with buttons

  var buttons = document.createElement("div");
  buttons.classList.add("row", "submit");
  var addNewInput = document.createElement("input");
  addNewInput.type = "submit";
  addNewInput.value = "Add Sub-input";
  addNewInput.addEventListener("click", generate_addInput);
  buttons.appendChild(addNewInput);
  var deleteInput = document.createElement("input");
  deleteInput.type = "submit";
  deleteInput.value = "Delete";
  deleteInput.addEventListener("click", delete_delInput);
  buttons.appendChild(deleteInput);
  form.appendChild(buttons); // add all form to container

  container.appendChild(form);
  return container;
};
// CONCATENATED MODULE: ./js/main.js


var main_playground = document.querySelector("#playground");
var btn = main_playground.querySelector("#addInput");
btn.addEventListener("click", function () {
  main_playground.insertBefore(generate_generateForm(), btn);
  cacheAll();
});

/***/ })
/******/ ]);