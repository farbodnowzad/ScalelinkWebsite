import {PageConstructor} from './page_constructor.js'
import {UserAuth} from './user_auth.js'
// import {FlashMessage} from 'flash.min.js'
const auth = new UserAuth();

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
function post(path, parameters) {
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        if (["profile_image"].includes(key)) {
            formData.append(key, value["path"])
        } else {
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
var user_id = auth.user_id;
var variables = await get(api_url, "_id", user_id);
var account_link = await stripe_account_link()
var wallet_button = document.getElementsByClassName("wallet-link")[0]
wallet_button.href = account_link;
parse_variables(variables);
var page_constructor = new PageConstructor(variables, pages, document)
page_constructor.show("Save");
page_constructor.create_listeners()
var next_button = document.getElementById("main-action-button")
next_button.onclick = function () {
    post(api_url, variables);
    window.FlashMessage.info('Saved!')
}