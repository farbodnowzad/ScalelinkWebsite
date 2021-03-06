import {PageConstructor} from './page_constructor.js'
import {UserAuth} from './user_auth.js'
// import {FlashMessage} from 'flash.min.js'
const auth = new UserAuth();
var user_id = auth.user_id;
var internationalNumberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'})

var page_1 = [
    {
        "title": "Full Name",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "full_name",
        "placeholder": "Jen Smith",
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
        "title": "Address",
        "placeholder": "Street Address",
        "class": "login-sign-up-input",
        "type": "address",
        "name": "line_1",
        "class_style": "address"
    },
    {
        "title": "Apt. or unit number",
        "placeholder": "Optional",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "line_2",
        "class_style": "text"
    },
    {
        "title": "Receive important notifications through email",
        "class": "login-sign-up-input",
        "type": "checkbox",
        "name": "email_notifications",
        "options": ["Yes"],
        "placeholder": ""
    }
]

async function getUser(api_url, key, value) {
    const url = api_url + `?${key}=${value}`;
    let user;
    await $.get(url, function(data){
        user = data.users[0];
        user["profile_image"] = {"filename": "", "path": user["profile_image"]}
        var page_header = document.getElementsByClassName("page-header")[0]
        var profile_image = document.getElementById("profile_image")
        page_header.innerHTML = user.full_name;
        profile_image.src = user.profile_image.path;
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
        } else if (["address"].includes(key)) {
            var address = formatAddress(value)
            formData.append(key, JSON.stringify(address))
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
function formatAddress(address) {
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
function cash_out() {
    var path = "https://sclnk.app/payments/cash_out"
    // path = "http://127.0.0.1:5000/payments/cash_out"
    var formData = new FormData()
    formData.append("user_id", user_id)
    $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: async function(data){
            window.FlashMessage.info('Cash out successful. Money is on the way!')
            setTimeout(()=>{window.location.reload()}, 1500)
        }
    });
}
function disconnect_instagram() {
    var path = "https://sclnk.app/users/instagram/disconnect"
    var formData = new FormData()
    formData.append("user_id", user_id)
    $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: async function(data){
            localStorage.removeItem("instagram_id");
        }
    });
}
function disconnect_twitter() {
    var path = "https://sclnk.app/users/twitter/disconnect"
    var formData = new FormData()
    formData.append("user_id", user_id)
    $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: async function(data){
            localStorage.removeItem("twitter_id");
        }
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
function check_instagram_id(social_accounts, disconnect_instagram_button) {
    var instagram_id = social_accounts.instagram_id;
    if (instagram_id == "null" || instagram_id == null) {
        document.getElementsByClassName("connect-instagram")[0].classList.remove("hidden")
        disconnect_instagram_button.classList.add("hidden")
    }
}
function check_twitter_id(social_accounts, disconnect_twitter_button) {
    var twitter_id = social_accounts.twitter_id;
    if (twitter_id == "null" || twitter_id == null) {
        document.getElementsByClassName("connect-twitter")[0].classList.remove("hidden")
        disconnect_twitter_button.classList.add("hidden")
    }
}

var pages = [page_1]
var api_url = "https://sclnk.app/users"

let variables;
getUser(api_url, "_id", user_id).then((res) => {
    variables = res;
    parse_variables(variables);

    var page_constructor = new PageConstructor(variables, pages, document)
    page_constructor.show("Save");
    if (variables.address) {
        var address_input = document.getElementById("line_1")
        address_input.value = [variables.address["line_1"], variables.address["city"], variables.address['state'] + " " + variables.address["zip"]].join(", ")
    }
    page_constructor.create_listeners()
    var next_button = document.getElementById("main-action-button")
    next_button.onclick = function () {
        post(api_url, variables);
        window.FlashMessage.info('Saved!')
    }

    var social_accounts = variables.social_accounts;
    var disconnect_instagram_button = document.getElementById("disconnect-instagram")
    var disconnect_twitter_button = document.getElementById("disconnect-twitter")
    check_instagram_id(social_accounts, disconnect_instagram_button);
    check_twitter_id(social_accounts, disconnect_twitter_button);

    disconnect_instagram_button.onclick = function () {
        disconnect_instagram();
        disconnect_instagram_button.classList.add("hidden");
        document.getElementsByClassName("connect-instagram")[0].classList.remove("hidden")
        localStorage.removeItem("instagram_id");
        auth.instagram_id = null;
    }
    disconnect_twitter_button.onclick = function () {
        disconnect_twitter();
        disconnect_twitter_button.classList.add("hidden");
        document.getElementsByClassName("connect-twitter")[0].classList.remove("hidden")
        localStorage.removeItem("twitter_id");
        auth.twitter_id = null;
    }
});

var payment_settings_btn = document.getElementsByClassName("payment-settings")[0];

stripe_account_link().then((res) => {
    var account_link = res;
    payment_settings_btn.addEventListener("click", function() {
        window.location.href = account_link;
    });
});

stripe_account_status().then((res) => {
    var account_status = res;
    var balance = account_status.balance || 0
    var complete_onboarding = account_status.status;

    var earnings_amount = document.getElementsByClassName("earnings-amount")[0]
    var cash_out_btn = document.getElementsByClassName("cash-out")[0]

    earnings_amount.innerHTML = internationalNumberFormat.format(balance / 100)

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
});



$(document).on("click", ".connect-instagram", function() {
    var url = `https://api.instagram.com/oauth/authorize?client_id=1130340001160455&redirect_uri=https://scalelink.xyz/app/auth.html&state=${user_id}&scope=user_profile&response_type=code`
    window.open(url, '_blank');
})
$(document).on("click", ".connect-twitter", function() {
    var path = "https://sclnk.app/users/twitter_auth/request_token"
    var formData = new FormData()
    $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
            console.log(data.redirect_uri)
            var url = data.redirect_uri;
            window.open(url);
        }
    });
})