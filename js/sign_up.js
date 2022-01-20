import {PageConstructor} from './page_constructor.js'

var variables = {
    "current_page": 0,
    "email": "",
    "password":"",
    "confirm_password":"",
    "full_name": "",
    "date_of_birth": "",
    "gender": "",
    "city": "",
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
        "title": "What city are you primarily located in?",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "city",
        "placeholder": "City",
        "value": variables["city"]
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
var next_button = document.getElementById("login-signup-action-button")
next_button.onclick = function () {
    page_constructor.next_page()
}
var back_button = document.getElementById("back-button")
back_button.onclick = function () {
    page_constructor.previous_page()
}