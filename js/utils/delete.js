import { cacheAll } from "./cache.js";

// function that delete selected form and all them siblings
export function delInput(e){
    e.preventDefault();
    if(confirm("Are you sure?")) {
        e.target.parentNode.parentNode.parentNode.remove();
        cacheAll();
    } else return;
}