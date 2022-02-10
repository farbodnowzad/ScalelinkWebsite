import {PageConstructor} from './page_constructor.js'
import {BusinessSignUp} from './business_sign_up_handler.js'

var variables = {
    "current_page": 0,
    "name": "",
    "email": "",
    "password":"",
    "confirm_password":"",
    "about": "",
    "contact": "",
    "website": "",
    "phone_number": "",
    "logo": {},
    "categories": []
}

var page_1 = [
    {
        "title": "Organization Name",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "name",
        "placeholder": "Acme Inc.",
    },
    {
        "title": "Email",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "email",
        "placeholder": "jen@email.com",
    },
    {
        "title": "Password",
        "class": "login-sign-up-input login-sign-up-password",
        "type": "password",
        "name": "password",
        "placeholder": "&#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679;",
    },
    {
        "title": "Confirm Password",
        "class": "login-sign-up-input login-sign-up-password",
        "type": "password",
        "name": "confirm_password",
        "placeholder": "&#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679;",
    }
]

var page_2 = [
    {
        "title": "Website",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "website",
        "placeholder": "acme.com"
    },
    {
        "title": "About your organization",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "text",
        "name": "about",
        "placeholder": "What does your organization do? What is it's purpose?",
    },
    {
        "title": "Company Logo",
        "class": "login-sign-up-input",
        "type": "file",
        "name": "logo",
    },
    {
        "title": "Which categories apply to your organization(choose up to 3)",
        "class": "login-sign-up-input",
        "type": "checkbox",
        "name": "categories",
        "options": ["Beauty", "Fashion", "Tech", "Lifestyle", "Food/Beverage", "Wellness", "Fitness", "Business", "Sports", "Music", "Entertainment"],
        "placeholder": "",
        "value": variables["categories"]
    },
]
var page_3 = [
    {
        "title": "Contact Email",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "contact",
        "placeholder": "contact@acme.com"
    },
    {
        "title": "Phone Number",
        "class": "login-sign-up-input",
        "type": "number",
        "name": "phone_number",
        "placeholder": "(650) 555-5555"
    }
]

var pages = [page_1, page_2, page_3]
var page_constructor = new PageConstructor(variables, pages, document)

page_constructor.show();
page_constructor.create_listeners()
var business_sign_up = new BusinessSignUp(document, variables);
var next_button = document.getElementById("main-action-button")
next_button.onclick = function () {
    if (page_constructor.current_page == pages.length-1) {
        business_sign_up.signUpCall(variables).then(function(sign_up_response) {
            if (sign_up_response.business_id) {
                localStorage.setItem("business_id", sign_up_response.business_id);
                var event = "register";
                var eventProperties = {
                    "app": "business",
                };
                amplitude.getInstance().logEvent(event, eventProperties);
                window.location.replace("manage_campaigns.html")
            } else {
                business_sign_up.setStatus(
                    next_button,
                    `Invalid inputs`,
                    "error"
                );
            }
        })
    } else {
        var errors = business_sign_up.validateonSubmit()
        if (errors == 0) {
            page_constructor.next_page("Get Started")
        }
    }
}
var back_button = document.getElementById("back-button")
back_button.onclick = function () {
    page_constructor.previous_page()
}