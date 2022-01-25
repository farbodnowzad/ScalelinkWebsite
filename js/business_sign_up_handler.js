class BusinessSignUp {
    constructor(document, fields) {
        this.document = document;
        this.fields = fields;
    }

    async signUpCall() {
        var formData = new FormData()
        $.each(this.fields, function(key, value) {
            if (["logo"].includes(key)) {
                formData.append(key, value["path"])
            } else {
                formData.append(key, value)
            }
        });

        var sign_up_url = "https://sclnk.app/businesses/sign_up"
        let sign_up_response;
        $.ajax({
            url: sign_up_url,
            data: formData,
            processData: false,
            contentType: false,
            async: false,
            type: 'POST',
            success: function(data){
                sign_up_response = data;
            }
        });
        return sign_up_response;
    }

    validateonSubmit() {
        var error = 0;
        var self = this;
        // loop through the fields and check them against a function for validation
        $.each(self.fields, function(key, value) {
            const input = self.document.querySelector(`input[name=${key}]`);
            if (input) {
                if (self.validateFields(input) == false) {
                    // if a field does not validate, auto-increment our error integer
                    error++;
                }
            }
        });
        return error;
    }

    validateFields(field) {
        // remove any whitespace and check to see if the field is blank, if so return false
        if (field.value.trim() === "") {
            // set the status based on the field, the field label, and if it is an error message
            this.setStatus(
                field,
                `${field.previousElementSibling.innerText} cannot be blank`,
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

export {BusinessSignUp}
