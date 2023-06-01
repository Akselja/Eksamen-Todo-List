// submit-form for new objects
const form = document.querySelector(".newEntry");
const listContainer = document.querySelector(".listContainer");

// add new entry -----------------------------------
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

// fetch entry list ------------------------------------
const fetchTodoList = async () => {

    // simple get request
    const resGet = await fetch("/todo");

    // response
    await resGet.json()
        .then(result => {
            // empty todo-list pre-refilling
            listContainer.innerHTML = ""; 
            result.todoList.reverse();

            // fill todo-list
            result.todoList.forEach(element => { 

                // entry div
                const thisDiv = listContainer.appendChild(document.createElement("div"));
                thisDiv.classList.add("listEntry");

                // entry text
                const thisParagraph = thisDiv.appendChild(document.createElement("p"));
                thisParagraph.classList.add("entryText");
                thisParagraph.innerText = element.message;

                // delete icon
                const thisIcon = thisDiv.appendChild(document.createElement("i"));
                thisIcon.classList.add("fa-solid", "fa-trash", "fa-lg", "deleteIcon");
                thisIcon.setAttribute("id", element._id);
                thisIcon.style.color = "#ffffff";
            });

            if(result.todoList.length === 0) {
                // entry div
                const thisDiv = listContainer.appendChild(document.createElement("div"));
                thisDiv.classList.add("listEntry");

                // entry text
                const thisParagraph = thisDiv.appendChild(document.createElement("p"));
                thisParagraph.classList.add("entryText");
                thisParagraph.innerText = "What to do...";
            }

            // scrolls to bottom of list
            listContainer.scrollTop = listContainer.scrollHeight - listContainer.clientHeight;
        })


}

// initial loading of list
fetchTodoList();

// adding delete entry functionality ----------------------------------
console.log(listContainer);
listContainer.addEventListener("click", async e => {
    console.log(e.target);
    if(e.target.classList[0] === "listEntry") {
        e.target.children[0].classList.toggle("finishedTodo");

    } else if (e.target.classList[0] === "entryText") {
        e.target.classList.toggle("finishedTodo");
        
    } else if (e.target.viewportElement.localName === "svg") { // checks if adjacent element is and svg element

        // assigns ObjectId stored as a custom attribute to the id variable
        const id = e.target.viewportElement.attributes.id.value; 

        await fetch('/delete', {
           method: 'POST',
           headers: {
              'Content-Type': 'application/json'
           },
           body: JSON.stringify({ id })
        }).then(() => fetchTodoList());
        
    } else {
        console.log(e.target);
    }
});