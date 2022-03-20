class UserLogin {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.validateonSubmit();
    }

    async loginCall(email, password) {
        var formData = new FormData()
        formData.append("email", email);
        formData.append("password", password);

        var login_url = "https://sclnk.app/users/login"
        let login_response
        $.ajax({
            url: login_url,
            data: formData,
            processData: false,
            contentType: false,
            async: false,
            type: 'POST',
            success: function(data){
                login_response = data;
            }
        });
        return login_response;
    }

    validateonSubmit() {
        let self = this; // setup calls to the "this" values of the class described in the constructor
    
        // add a "submit" event listener to the form
        this.form.addEventListener("submit", (e) => {
            // remove default functionality 
            e.preventDefault();
            var error = 0;
            // loop through the fields and check them against a function for validation
            self.fields.forEach((field) => {
                const input = document.querySelector(`#${field}`);
                if (self.validateFields(input) == false) {
                    // if a field does not validate, auto-increment our error integer
                    error++;
                }
            });
            // if everything validates, error will be 0 and can continue
            if (error == 0) {
                //do login api here or in this case, just submit the form and set a localStorage item
                var email =  document.querySelector(`#login-email`);
                var password =  document.querySelector(`#login-password`);
                self.loginCall(email.value, password.value).then(function(login_response) {
                    if (login_response.login) {
                        localStorage.setItem("user_id", login_response.user_id);
                        localStorage.setItem("instagram_id", login_response.social_accounts.instagram_id);
                        localStorage.setItem("twitter_id", login_response.social_accounts.twitter_id);
                        self.form.submit();
                    } else {
                        self.setStatus(
                            password,
                            `Invalid login`,
                            "error"
                        );
                    }
                })
            }
        });
    }

    validateFields(field) {
        // remove any whitespace and check to see if the field is blank, if so return false
        if (field.value.trim() === "") {
            // set the status based on the field, the field label, and if it is an error message
            this.setStatus(
                field,
                `${field.previousElementSibling.innerText} Cannot be blank`,
                "error"
            );
            return false;
        } else {
            // if the field is not blank, check to see if it is password
            if (field.type == "password") {
                // if it is a password, check to see if it meets our minimum character requirement
                if (field.value.length < 8) {
                    // set the status based on the field, the field label, and if it is an error message
                    this.setStatus(
                        field,
                        `${field.previousElementSibling.innerText} must be at least 8 characters`,
                        "error"
                    );
                    return false;
                } else {
                    // set the status based on the field without text and return a success message
                    this.setStatus(field, null, "success");
                    return true;
                }
            } else {
                // set the status based on the field without text and return a success message
                this.setStatus(field, null, "success");
                return true;
            }
        }
    }

    setStatus(field, message, status) {
        // create variable to hold message
        const errorMessage = field.parentElement.querySelector(".error-message");

        // if success, remove messages and error classes
        if (status == "success") {
            if (errorMessage) {
                errorMessage.innerText = "";
            }
            field.classList.remove("input-error");
        }
        // if error, add messages and add error classes
        if (status == "error") {
            errorMessage.innerText = message;
            field.classList.add("input-error");
        }
    }
}

// create a variable for the login form
const form = document.querySelector(".loginForm");
// if the form exists, run the class
if (form) {
    // setup the fields we want to validate, we only have two but you can add others
    const fields = ["login-email", "login-password"];
    // run the class
    const validator = new UserLogin(form, fields);
}