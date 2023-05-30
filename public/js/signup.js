const form = document.querySelector("form");

const emailErr = document.querySelector(".emailErr");
const passwordErr = document.querySelector(".passwordErr");

form.addEventListener("submit", async e => {
    e.preventDefault();

    // reset form errors
    emailErr.textContent = "";
    passwordErr.textContent = "";

    // store form data
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // post request
    try {
    const res = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(result => {
        // this code gets the response, then gets the promise and waits for it to resolve, to then get the error message.
        result.json().then(value => {
            const errors = value.error.errors;
            if (errors.email) {
                console.log(errors.email.message);
                emailErr.innerText = errors.email.message;
            }
            if (errors.password) {
                console.log(errors.password.message);
                passwordErr.innerText = errors.password.message;
            }
        })
    });
    } catch (err) {
        console.log(err);
    }
    
    
})