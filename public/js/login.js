const form = document.querySelector("form");

form.addEventListener("submit", async e => {
    e.preventDefault();

    // store input fields
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // post
    try {
        const res = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(result => {
        result.json().then(value => {
            console.log(value);
        })
    });
    } catch(err) {
        console.log(err);
    }
})
