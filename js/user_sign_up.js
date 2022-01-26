import {PageConstructor} from './page_constructor.js'
import {UserSignUp} from './user_sign_up_handler.js'

var variables = {
    "current_page": 0,
    "email": "",
    "password":"",
    "confirm_password":"",
    "full_name": "",
    "date_of_birth": "",
    "phone_number": "",
    "gender": "",
    "address": {},
    "categories": []
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
        "title": "Password",
        "class": "login-sign-up-input login-sign-up-password",
        "type": "password",
        "name": "password",
        "placeholder": "&#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679;",
        "value": variables["password"]
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

var page_2 = [
    {
        "title": "Full Name",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "full_name",
        "placeholder": "Jen Smith",
        "style": "text-transform: capitalize;",
        "value": variables["full_name"]
    },
    {
        "title": "Date of Birth",
        "class": "login-sign-up-input",
        "type": "date",
        "name": "date_of_birth",
        "placeholder": "MM/DD/YYYY",
        "value": variables["date_of_birth"]
    },
    {
        "title": "Gender",
        "class": "login-sign-up-input",
        "type": "select",
        "name": "gender",
        "options": ["Female", "Male", "Other"],
        "placeholder": "Select One...",
        "value": variables["gender"]
    },
]

var page_3 = [
    {
        "title": "Address",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "line_1",
        "placeholder": "Line 1"
    },
    {
        "title": "Address Line 2 (optional)",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "line_2",
        "placeholder": "Line 1"
    },
    {
        "title": "City",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "city",
        "placeholder": "Los Angeles"
    },
    {
        "title": "State",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "state",
        "placeholder": "CA"
    },
    {
        "title": "Zip Code",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "zip",
        "placeholder": "90210"
    },
    {
        "title": "Categories you create content about (choose up to 3)",
        "class": "login-sign-up-input",
        "type": "checkbox",
        "name": "categories",
        "options": ["Fashion", "Tech", "Lifestyle", "Food", "Wellness", "Fitness", "Business", "Sports", "Mindfulness", "Other"],
        "placeholder": "",
        "value": variables["categories"]
    },
]

var pages = [page_1, page_2, page_3]
var page_constructor = new PageConstructor(variables, pages, document)

page_constructor.show();
page_constructor.create_listeners()
var user_sign_up = new UserSignUp(document, variables);
var next_button = document.getElementById("main-action-button")
next_button.onclick = function () {
    if (page_constructor.current_page == pages.length-1) {
        user_sign_up.signUpCall(variables).then(function(sign_up_response) {
            if (sign_up_response.user_id) {
                localStorage.setItem("user_id", sign_up_response.user_id);
                window.location.replace("home.html")
            } else {
                user_sign_up.setStatus(
                    next_button,
                    `Invalid inputs`,
                    "error"
                );
            }
        })
    } else {
        var errors = user_sign_up.validateonSubmit()
        if (errors == 0) {
            page_constructor.next_page("Get Started")
        }
    }
}
var back_button = document.getElementById("back-button")
back_button.onclick = function () {
    page_constructor.previous_page()
}