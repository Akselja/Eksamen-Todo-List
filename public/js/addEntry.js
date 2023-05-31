const form = document.querySelector(".newEntry");
const listContainer = document.querySelector(".listContainer");

form.addEventListener("submit", async e => { // add new entry
    e.preventDefault();

    // store input fields
    const message = document.querySelector("#newEntryMessage").value;

    // clear input field while preserving message variable
    document.querySelector("#newEntryMessage").value = "";

    // post
    try {
        const resPost = await fetch('/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        await fetchTodoList();

    } catch(err) {
        console.log("err " + err);
    }
})


const fetchTodoList = async () => {
    const initialLoad = await fetch("/todo");

    await initialLoad.json()
        .then(result => {
            listContainer.innerHTML = ""; // empty todo-list
            result.todoList.reverse();
            result.todoList.forEach(element => { // fill todo-list with updated list
                const thisDiv = listContainer.appendChild(document.createElement("div"));
                thisDiv.classList.add("listEntry");
                thisDiv.textContent = element.message;
            });

            if(result.todoList.length === 0) {
                const thisDiv = listContainer.appendChild(document.createElement("div"));
                thisDiv.classList.add("listEntry");
                thisDiv.textContent = "What to add...";
            }

            // scrolls to bottom of list
            listContainer.scrollTop = listContainer.scrollHeight - listContainer.clientHeight;
        })


}

// initial loading of list
fetchTodoList();