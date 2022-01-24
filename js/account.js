import {PageConstructor} from './page_constructor.js'
import {Auth} from './auth.js'
const auth = new Auth();

var page_1 = [
    {
        "title": "Organization Name",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "name",
        "placeholder": "Acme",
    },
    {
        "title": "Email",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "email",
        "placeholder": "marketing@acme.com",
    },
    {
        "title": "Website",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "website",
        "placeholder": "marketing@acme.com",
    },
    {
        "title": "About",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "about",
        "placeholder": "Details about your organization",
    },
    {
        "title": "Phone Number",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "phone_number",
        "placeholder": "A contact number in case we need to reach you",
    },
    {
        "title": "Logo",
        "class": "login-sign-up-input",
        "type": "file",
        "name": "logo",
    },
    {
        "title": "Contact Email",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "contact",
        "placeholder": "contact@acme.com",
    },

]

async function get(api_url, key, value) {
    const url = api_url + `?${key}=${value}`;
    let business;
    await $.get(url, function(data){
        business = data.businesses[0];
        business["logo"] = {"filename": "", "path": business["logo"]}
        var page_header = document.getElementsByClassName("page-header")[0]
        var logo = document.getElementById("logo")
        page_header.innerHTML = business.name;
        logo.src = business.logo.path;
    });
    return business;
}

function post(path, parameters) {
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        if (["logo"].includes(key)) {
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
var pages = [page_1]
var api_url = "http://scalelink-api-env.eba-ncaemzfy.us-west-1.elasticbeanstalk.com/businesses"
var business_id = auth.business_id;
var variables = await get(api_url, "_id", business_id);
var page_constructor = new PageConstructor(variables, pages, document)
page_constructor.show("Save");
page_constructor.create_listeners()
var next_button = document.getElementById("login-signup-action-button")
next_button.onclick = function () {
    if (page_constructor.current_page == pages.length-1) {
        var response = post(api_url, variables)
    } else {
        page_constructor.next_page("Save")
    }
}