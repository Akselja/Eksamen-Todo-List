const form = document.querySelector("form");

// stores error fields
const emailErr = document.querySelector(".emailErr");
const passwordErr = document.querySelector(".passwordErr");

form.addEventListener("submit", async e => {
    e.preventDefault();

    // reset error fields on submit
    emailErr.textContent = "";
    passwordErr.textContent = "";

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
        });

        await res.json()
            .then(errors => {
                if(errors.errors === "Error: Incorrect email") {
                    emailErr.textContent = "Incorrect email";
                }
                if(errors.errors === "Error: Incorrect password") {
                    passwordErr.textContent = "Incorrect password";
                }
            })

    } catch(err) {
        console.log(err);
    }


})
