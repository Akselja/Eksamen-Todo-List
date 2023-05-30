const form = document.querySelector("form");

form.addEventListener("submit", async e => {
    e.preventDefault();

    // store input fields
    const content = document.querySelector("#newEntry").value;
    
    // post
    try {
        const res = await fetch('/todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    })
    .then(result => {
        result.json().then(value => {
            console.log("value " + value);
        })
    });
    } catch(err) {
        console.log("err " + err);
    }
})
