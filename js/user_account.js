import {PageConstructor} from './page_constructor.js'
import {UserAuth} from './user_auth.js'
// import {FlashMessage} from 'flash.min.js'
const auth = new UserAuth();
var user_id = auth.user_id;

var page_1 = [
    {
        "title": "Full Name",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "full_name",
        "placeholder": "Jen Smith",
    },
    {
        "title": "Email",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "email",
        "placeholder": "marketing@acme.com",
    },
    {
        "title": "Phone Number",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "phone_number",
        "placeholder": "(650) 555-5555"
    },
    {
        "title": "Date of Birth",
        "class": "login-sign-up-input",
        "type": "date",
        "name": "date_of_birth",
        "placeholder": "mm/dd/yyyy",
    },
    {
        "title": "Gender",
        "class": "login-sign-up-input",
        "type": "select",
        "name": "gender",
        "options": ["Female", "Male", "Other"],
        "placeholder": "Select One..."
    },
    {
        "title": "Profile Image",
        "class": "login-sign-up-input",
        "type": "file",
        "name": "profile_image",
    },
    {
        "title": "Address Line 1",
        "placeholder": "Street Address",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "line_1",
        "class_style": "address"
    },
    {
        "title": "Address Line 2",
        "placeholder": "Apt. or unit number",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "line_2",
        "class_style": "address"
    },
    {
        "title": "City",
        "placeholder": "City",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "city",
        "class_style": "address"
    },
    {
        "title": "State",
        "placeholder": "State",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "state",
        "class_style": "address"
    },
    {
        "title": "Zip Code",
        "placeholder": "Zip Code",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "zip",
        "class_style": "address"
    },
]

async function get(api_url, key, value) {
    const url = api_url + `?${key}=${value}`;
    let user;
    await $.get(url, function(data){
        user = data.users[0];
        user["profile_image"] = {"filename": "", "path": user["profile_image"]}
        var page_header = document.getElementsByClassName("page-header")[0]
        var logo = document.getElementById("logo")
        page_header.innerHTML = user.full_name;
    });
    return user;
}
async function stripe_account_link() {
    const url = "https://sclnk.app/users/account_link?user_id=" + `${auth.user_id}`;
    let account_link;
    await $.get(url, function(data){
        account_link = data.account_link;
    });
    return account_link;
}
async function stripe_account_status() {
    const url = "https://sclnk.app/users/stripe_account_status?user_id=" + `${auth.user_id}`;
    let response;
    await $.get(url, function(data){
        response = data;
    });
    return response;
}
function post(path, parameters) {
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        if (["profile_image"].includes(key)) {
            formData.append(key, value["path"])
        } else {
            if (value.constructor == Object){
                value = JSON.stringify(value)
            }
            formData.append(key, value)
        }
    });
    $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: async function(data){}
    });
}
function cash_out() {
    var path = "https://sclnk.app/payments"
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        formData.append("user_id", user_id)
    });
    $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: async function(data){}
    });
}
function parse_variables(vals) {
    if (vals.date_of_birth) {
        var dob = vals.date_of_birth.split("/")
        var month = dob[0]
        var day = dob[1]
        var year = dob[2]
        vals.date_of_birth = [year, month, day].join("-")
    }
}
var pages = [page_1]
var api_url = "https://sclnk.app/users"
// var api_url = "http://127.0.0.1:5000/users"

var variables = await get(api_url, "_id", user_id);

var account_link = await stripe_account_link();
var account_status = await stripe_account_status();

var balance = account_status.balance || 0
var complete_onboarding = account_status.status;

var earnings_amount = document.getElementsByClassName("earnings-amount")[0]
var cash_out_btn = document.getElementsByClassName("cash-out")[0]
var payment_settings_btn = document.getElementsByClassName("payment-settings")[0]
payment_settings_btn.addEventListener("click", function() {
    window.location.href = account_link;
});

earnings_amount.innerHTML = `$${balance / 100}`

if (complete_onboarding) {
    payment_settings_btn.innerHTML = "<img class='btn-icon' style='height: 15px;' src='../assets/img/settings_icon.png' /> Payment Settings";
    if (balance > 0) {
        cash_out_btn.classList.remove("hidden")
        cash_out_btn.addEventListener("click", function() {
            cash_out();
        });
    }
} else {
    payment_settings_btn.innerHTML = "Complete Account to Get Paid &rarr;";
}

parse_variables(variables);
console.log(variables);
var page_constructor = new PageConstructor(variables, pages, document)
page_constructor.show("Save");
page_constructor.create_listeners()
var next_button = document.getElementById("main-action-button")
next_button.onclick = function () {
    post(api_url, variables);
    window.FlashMessage.info('Saved!')
}