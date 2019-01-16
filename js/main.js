import { generateForm } from "./utils/generate.js";
import { cacheAll } from "./utils/cache.js";

const playground = document.querySelector("#playground");
const btn = playground.querySelector("#addInput");

btn.addEventListener("click", () => {
    playground.insertBefore(generateForm(), btn);
    cacheAll();
});