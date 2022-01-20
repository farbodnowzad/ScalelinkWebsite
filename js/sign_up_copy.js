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

function create_section(section) {
    if (section.type == "select") {
        select = `
        <div class="login-sign-up-input-row">
        <span class='login-sign-up-input-row-name'>${section.title}</span><br>
        <select name="${section.name}" class="${section.class}" onchange="save_select('${section.name}', this)">
            <option value="" disabled selected>${section.placeholder}</option>
        `
        for (let val of section.options) {
            select_toggled = variables[section.name] == val.toLowerCase() ? "selected" : "!selected"
            select += `<option value="${val.toLowerCase()}" ${select_toggled}>${val}</option>`
        }
        select += '</select></div>'
        return select
    }
    else if (section.type == "checkbox") {
        checkbox = `<div class="login-sign-up-input-row">
        <span class='login-sign-up-input-row-name'>${section.title}</span><br>`
        for (let val of section.options) {
            check_toggled = variables[section.name].includes(val.toLowerCase()) ? "checked" : "!checked"
            checkbox += `<div class="sign-up-checkbox">
            <input class="single-checkbox" type="checkbox" name="${section.title.toLowerCase()}" value="${val.toLowerCase()}" ${check_toggled} onchange="save_checkbox('${section.name}', this)">
            <label for="${val.toLowerCase()}"> ${val}</label><br>
            </div>
            `
        }
        checkbox += '</div>'
        return checkbox
    } else {
        return `
        <div class="login-sign-up-input-row">
            <span class='login-sign-up-input-row-name'>${section.title}</span><br>
            <input class="${section.class}" style="${section.style}" type="${section.type}" name="${section.name}" placeholder="${section.placeholder}" value="${variables[section.name]}" onchange="save_text('${section.name}', this)"/>
        </div>
        `
    }
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
        document.getElementById("login-signup-action-button").innerHTML = "Next";
    }
}

function save_text(variable_name, self) {
    variables[variable_name] = self.value
}

function save_checkbox(variable_name, self) {
    if (self.checked) {
        variables[variable_name].push(self.value)
    } else {
        index = variables[variable_name].indexOf(self.value)
        variables[variable_name].splice(index, 1)
    }
}

function save_select(variable_name, self) {
    console.log(self.value.toLowerCase())
    variables[variable_name] = self.value.toLowerCase()
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

page_2 = [
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

page_3 = [
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
current_page = 0

show(current_page);