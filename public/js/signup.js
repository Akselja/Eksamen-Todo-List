const form = document.querySelector("form");

// stores error fields
const emailErr = document.querySelector(".emailErr");
const passwordErr = document.querySelector(".passwordErr");
const retryErr = document.querySelector(".retryErr");

form.addEventListener("submit", async e => {
    e.preventDefault();

    // reset form errors
    emailErr.textContent = "";
    passwordErr.textContent = "";
    retryErr.textContent = "";



    // store form data
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const retry = document.querySelector("#retry").value;

    // post request
    try {
    const res = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, retry })
    });

    await res.json()
        .then(result => {
            if(result.result === "Success") { // success, redirecting
                window.location.replace("/");
            } else if (result.error === "Passwords must match") { // password comparison error
                retryErr.textContent = result.error;
            } else if (result.error.errors !== undefined) { // email or password errors
                const errorList = result.error.errors;
                if(errorList.email !== undefined) { // email error
                    emailErr.textContent = errorList.email.message;
                }
                if(errorList.password !== undefined) { // password error
                    passwordErr.textContent = errorList.password.message;
                }
            }
        })

    } catch (err) {

    }
    
    
})