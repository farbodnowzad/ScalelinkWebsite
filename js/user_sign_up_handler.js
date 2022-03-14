class UserSignUp {
    constructor(document, fields) {
        this.document = document;
        this.fields = fields;
        this.optional_fields = ['line_2']
    }

    async signUpCall() {
        var event = "register_attempt";
        var eventProperties = {
            "app": "user",
        };
        amplitude.getInstance().logEvent(event, eventProperties);
        var formData = new FormData()
        var self = this;
        $.each(this.fields, function(key, value) {
            if (["profile_image"].includes(key)) {
                formData.append(key, value["path"])
            } else if (["address"].includes(key)) {
                var address = self.formatAddress(value)
                formData.append(key, JSON.stringify(address))
            } else {
                if (value.constructor == Object){
                    value = JSON.stringify(value)
                }
                formData.append(key, value)
            }
        });
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const referral_id = urlParams.get('referral_id')
        if (referral_id) {
            formData.append("referral_user_id", referral_id)
        }
        var sign_up_url = "https://sclnk.app/users/sign_up"
        // sign_up_url = "http://127.0.0.1:5000/users/sign_up"
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
            },
            error: function(data) {
                sign_up_response = data;
            }
        });
        return sign_up_response;
    }

    formatAddress(address) {
        if (address.constructor == Object) {
            return address;
        }
        var address_parsed = {}
        var necessary_types = ["street_number", "route", "locality", "administrative_area_level_1", "country", "postal_code"]
        for (let necessary_type of necessary_types) {
            for (let component of address) {
                var types = component.types
                if (types.includes(necessary_type)) {
                    address_parsed[necessary_type] = component.long_name
                }
            }
        }
        address = {}
        address['line_1'] = `${address_parsed["street_number"]} ${address_parsed["route"]}`
        address['city'] = address_parsed["locality"]
        address['state'] = address_parsed["administrative_area_level_1"]
        address['country'] = address_parsed["country"]
        address['zip'] = address_parsed["postal_code"]
        return address
    }

    validateonSubmit() {
        var error = 0;
        var self = this;
        // loop through the fields and check them against a function for validation
        $.each(self.fields, function(key, value) {
            if (self.optional_fields.includes(key)) {
                return true;
            }
            const input = self.document.querySelector(`input[name=${key}]`);
            if (input) {
                if (self.validateFields(input, value) == false) {
                    // if a field does not validate, auto-increment our error integer
                    error++;
                }
            }
        });
        return error;
    }

    validateFields(field, value) {
        // remove any whitespace and check to see if the field is blank, if so return false
        if (!value) {
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
                var password_fields = document.getElementsByClassName("login-sign-up-password")
                // if it is a password, check to see if it meets our minimum character requirement
                if (field.value.length < 8) {
                    // set the status based on the field, the field label, and if it is an error message
                    this.setStatus(
                        field,
                        `${field.previousElementSibling.innerText} must be at least 8 characters`,
                        "error"
                    );
                    return false;
                } else if (password_fields[0].value != password_fields[1].value) {
                    this.setStatus(
                        field,
                        `Passwords must match`,
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

export {UserSignUp}
