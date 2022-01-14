function create_section(section) {
    if (section.type == "select") {
        select = `
        <div class="login-sign-up-input-row">
        <span class='login-sign-up-input-row-name'>${section.title}</span><br>
        <select name="${section.name}" class="${section.class}">
            <option value="" disabled selected>${section.placeholder}</option>
        `
        for (let val of section.options) {
            select += `<option value="${val.toLowerCase()}">${val}</option>`
        }
        select += '</select></div>'
        return select
    }
    if (section.type == "checkbox") {
        checkbox = `<div class="login-sign-up-input-row">
        <span class='login-sign-up-input-row-name'>${section.title}</span><br>`
        for (let val of section.options) {
            checkbox += `<div class="sign-up-checkbox">
            <input class="single-checkbox" type="checkbox" id="" name="${section.title.toLowerCase()}" value="${val.toLowerCase()}">
            <label for="${val.toLowerCase()}"> ${val}</label><br>
            </div>
            `
        }
        checkbox += '</div>'
        var limit = 3;
        $(`input[name=${section.title.toLowerCase()}:checked]`).on('change', function(evt) {
        if($(this).siblings(':checked').length >= limit) {
            this.checked = false;
        }
        });
        return checkbox
    }
    return `
    <div class="login-sign-up-input-row">
        <span class='login-sign-up-input-row-name'>${section.title}</span><br>
        <input class="${section.class}" type="${section.type}" name="${section.name}" placeholder="${section.placeholder}"/>
    </div>
    `
}

function show(current_page) {
    page = pages[current_page]
    sections = document.getElementById("login-sign-up-inputs-wrapper")
    sections.innerHTML = ``
    for (let section of page) {
        filled_section = create_section(section);
        sections.innerHTML += filled_section;
    }
    if (current_page == 0) {
        document.getElementById("back-button").hidden = true;
    } else {
        document.getElementById("back-button").hidden = false;
    }
    if (current_page == pages.length-1) {
        document.getElementById("login-signup-action-button").innerHTML = "Sign Up";
    } else {
        document.getElementById("login-signup-action-button").innerHTML = `Step ${(current_page+1).toString() + " of " + pages.length.toString()} - Next`;
    }
}

next_button = document.getElementById("login-signup-action-button")
next_button.onclick = function () {
    if (current_page < pages.length-1) {
        current_page += 1
        show(current_page)
    }
}
back_button = document.getElementById("back-button")
back_button.onclick = function () {
    if (current_page > 0) {
        current_page -= 1
        show(current_page)
    }
}

page_1 = [
    {
        "title": "Email",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "email",
        "placeholder": "jen@email.com"
    },
    {
        "title": "Password",
        "class": "login-sign-up-input login-sign-up-password",
        "type": "password",
        "name": "password",
        "placeholder": "&#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679;"
    },
    {
        "title": "Confirm Password",
        "class": "login-sign-up-input login-sign-up-password",
        "type": "password",
        "name": "confirm_password",
        "placeholder": "&#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679; &#9679;"
    }
]

page_2 = [
    {
        "title": "Full Name",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "full_name",
        "placeholder": "Jen Smith"
    },
    {
        "title": "Date of Birth",
        "class": "login-sign-up-input",
        "type": "date",
        "name": "date_of_birth",
        "placeholder": "MM/DD/YYYY"
    },
    {
        "title": "Gender",
        "class": "login-sign-up-input",
        "type": "select",
        "name": "gender",
        "options": ["Female", "Male", "Other"],
        "placeholder": "Select One..."
    },
]

page_3 = [
    {
        "title": "What city are you primarily located in?",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "city",
        "placeholder": "City"
    },
    {
        "title": "Categories you create content about (choose up to 3)",
        "class": "login-sign-up-input",
        "type": "checkbox",
        "name": "categories",
        "options": ["Fashion", "Tech", "Lifestyle", "Food", "Wellness", "Fitness", "Business", "Sports", "Mindfulness", "Other"],
        "placeholder": ""
    },
]

var pages = [page_1, page_2, page_3]
var current_page = 0;
let email;
let password;
let confirm_password;
let date_of_birth;
let gender;
let city;
let categories;

show(current_page);