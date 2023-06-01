const dropdownButtonDiv = document.querySelector(".dropdownButtonDiv");
const dropdownMenu = document.querySelector(".dropdownMenu");

dropdownButtonDiv.addEventListener("click", () => {
    dropdownMenu.classList.toggle("visible");
})