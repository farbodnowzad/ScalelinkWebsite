import {PageConstructor} from './page_constructor.js'
import {UserSignUp} from './user_sign_up_handler.js'

var variables = {
    "email": "",
    "new_password":"",
    "confirm_password":""
}

var page_1 = [
    {
        "title": "Email",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "email",
        "placeholder": "jen@email.com",
        "value": variables["email"]
    },
    {
        "title": "New Password",
        "class": "login-sign-up-input login-sign-up-password",
        "type": "password",
        "name": "new_password",
        "placeholder": "&#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679;",
        "value": variables["new_password"]
    },
    {
        "title": "Confirm Password",
        "class": "login-sign-up-input login-sign-up-password",
        "type": "password",
        "name": "confirm_password",
        "placeholder": "&#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679;",
        "value": variables["confirm_password"]
    }
]

async function updatePassword(email, new_password, confirm_password) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token')

    var formData = new FormData()
    formData.append("email", email)
    formData.append('new_password', new_password)
    formData.append("confirm_password", confirm_password)
    formData.append("token", token)

    var update_url = "https://sclnk.app/users/update_password"
    // update_url = "http://127.0.0.1:5000/users/update_password"
    let update_response;
    $.ajax({
        url: update_url,
        data: formData,
        processData: false,
        contentType: false,
        async: false,
        type: 'POST',
        success: function(data){
            update_response = data;
        }
    });
    return update_response;
}

function setStatus(field, message, status) {
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

var pages = [page_1]
// var pages = [page_3, page_4]
var page_constructor = new PageConstructor(variables, pages, document)
page_constructor.finish_button = "Update Password"

page_constructor.show();
var next_button = document.getElementById("main-action-button")
var next_button_spinner = document.getElementById("main-action-button-spinner")
var next_button_text = document.getElementById("main-action-button-text")
next_button.onclick = function () {
    next_button_spinner.classList.remove("hidden");
    next_button_spinner.classList.add("visible-spinner");
    next_button_text.classList.add("hidden");
    var email = document.getElementById("email").value
    var new_password = document.getElementById("new_password").value
    var confirm_password = document.getElementById("confirm_password").value
    updatePassword(email, new_password, confirm_password).then(function(update_response) {
        if (update_response.modified_count) {
            window.location.replace(`index.html`)
        } else {
            setStatus(
                next_button,
                `Invalid inputs`,
                "error"
            );
            next_button_spinner.classList.add("hidden");
            next_button_spinner.classList.remove("visible-spinner");
            next_button_text.classList.remove("hidden");
        }
    })
}