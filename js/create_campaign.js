import {PageConstructor} from './page_constructor.js'
import {Auth} from './auth.js'
const auth = new Auth();

var variables = {
    "business_id": auth.business_id,
    "title": "",
    "url":"",
    "about": "",
    "budget": "",
    "expiration": "",
    "primary_image": {"filename":"", "path": ""},
    "do_mention": "",
    "do_not_mention": "",
    "requires_approval": false,
    "requires_product": false,
    "gender": [],
    "age": [],
    "region": "",
    "min_payout": "",
    "max_payout": "",
    "secondary_attachments": [],
}

var page_1 = [
    {
        "title": "Title",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "title",
        "placeholder": "The campaign title that users will see",
    },
    {
        "title": "URL",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "url",
        "placeholder": "Where should people go when they engage?",
    },
    {
        "title": "Banner Image",
        "class": "login-sign-up-input",
        "type": "file",
        "name": "primary_image",
    },
    {
        "title": "What should potential influencers know about this campaign?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "text",
        "name": "about",
        "placeholder": "Give details about the campaign such as what the product or service is. Please metition if you want influencers to use any of the additional images below. Use this space to provide more context.",
    },
    {
        "title": "Add any additional images here",
        "class": "login-sign-up-input",
        "type": "file",
        "name": "secondary_attachments",
        "meta": "multiple"
    },
]

var page_2 = [
    {
        "title": "What should influencers mention in their posts?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "text",
        "name": "do_mention",
        "placeholder": "Discuss talking points or things to emphasize",
    },
    {
        "title": "What should influencers NOT mention in their posts?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "text",
        "name": "do_not_mention",
        "placeholder": "Discuss topics or names to avoid",
    },
    {
        "title": "Do you want to approve influencers before they can start sharing?",
        "class": "login-sign-up-input",
        "type": "select",
        "name": "requires_approval",
        "options": ["Yes", "No"],
        "placeholder": "Select One...",
    },
    {
        "title": "Will you send a product to influencers before they can start sharing?",
        "class": "login-sign-up-input",
        "type": "select",
        "name": "requires_product",
        "options": ["Yes", "No"],
        "placeholder": "Select One...",
    },
]

var page_3 = [
    {
        "title": "Set an expiration date",
        "class": "login-sign-up-input",
        "type": "date",
        "name": "expiration",
    },
    {
        "title": "How much do you want to spend on this campaign?",
        "class": "login-sign-up-input",
        "type": "budget",
        "name": "budget",
        "placeholder": "$10,000"
    },
    {
        "title": "What is the maximum amount that one person can make?",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "max_payout",
        "placeholder": "No maximum"
    }
]

var page_4 = [
    {
        "title": "Do you want to target influencers of a specific gender?",
        "class": "login-sign-up-input",
        "type": "checkbox",
        "name": "gender",
        "options": ["Male", "Female", "Other"],
    },
    {
        "title": "Do you want to target influencers in a specific age range?",
        "class": "login-sign-up-input",
        "type": "checkbox",
        "name": "age",
        "options": ["< 18", "18-24", "25-34", "35-44", "45-64", "65+"],
    },
    {
        "title": "Do you want to target influencers in a specific region?",
        "class": "login-sign-up-input",
        "type": "text",
        "name": "region",
        "placeholder": "Los Angeles"
    }
]

var page_5 = [
    {
        "title": "Title",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "title",
        "placeholder": "The campaign title that users will see",
    },
    {
        "title": "URL",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "url",
        "placeholder": "Where should people go when they engage?",
    },
    {
        "title": "Banner Image",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "primary_image",
        "sub_type": "file"
    },
    {
        "title": "What shoudld potential influencers know about this campaign?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "review",
        "name": "about",
        "placeholder": "Give details about the campaign such as what the product or service is. Please metition if you want creators to use any of the additional images. Use this space to provide more context.",
    },
    {
        "title": "Add any additional images here",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "secondary_attachments",
        "meta": "multiple"
    },
    {
        "title": "What should influencers mention in their posts?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "review",
        "name": "do_mention",
        "placeholder": "Discuss talking points or things to emphasize",
    },
    {
        "title": "What should influencers NOT mention in their posts?",
        "class": "login-sign-up-input",
        "class_style": "long_text",
        "type": "review",
        "name": "do_not_mention",
        "placeholder": "Discuss topics or names to avoid",
    },
    {
        "title": "Do you want to approve influencers before they can start sharing?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "requires_approval",
        "options": ["Yes", "No"],
        "placeholder": "Select One...",
    },
    {
        "title": "Will you send a product to influencers before they can start sharing?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "requires_product",
        "options": ["Yes", "No"],
        "placeholder": "Select One...",
    },
    {
        "title": "Set an expiration date",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "expiration",
    },
    {
        "title": "How much do you want to spend on this campaign?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "budget",
        "placeholder": "$10,000"
    },
    {
        "title": "What is the maximum amount that one person can make?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "max_payout",
        "placeholder": "No maximum"
    },
    {
        "title": "Do you want to target influencers of a specific gender?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "gender",
        "options": ["Male", "Female", "Other"],
    },
    {
        "title": "Do you want to target influencers in a specific age range?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "age",
        "options": ["< 18", "18-24", "25-34", "35-44", "45-64", "65+"],
    },
    {
        "title": "Do you want to target influencers in a specific region?",
        "class": "login-sign-up-input",
        "type": "review",
        "name": "region",
        "placeholder": "Los Angeles"
    }
]

function create_campaign_preview() {
    var internationalNumberFormat = new Intl.NumberFormat('en-US')
    var expiration = variables.expiration ? "Expires: " + variables.expiration : ""
    var budget = variables.budget ? "Budget: $" + internationalNumberFormat.format(variables.budget) : ""
    var about = variables.about ? variables.about.slice(0,100) + "..." : ""
    var requires_approval = variables.requires_approval == "yes" ? "Requires Approval" : ""
    var requires_product = variables.requires_product == "yes" ? "Requires Product" : ""
    var max_payout = parseInt(variables.max_payout) > 0 ? "Max Payout: $" + internationalNumberFormat.format(parseInt(variables.max_payout)) : ""
    var gender = variables.gender.length > 0 ? "Gender: " + variables.gender : ""
    var age = variables.age.length > 0 ? "Age: " + variables.age : ""
    var region = variables.region ? "Regions: " + variables.region : ""
    var campaign_preview = `
    <div class="content-container-preview">
        <div class="banner-image-preview">
            <img src="${variables.primary_image.filename}"/>
        </div>
        <div class="text-content-preview">
            <div class="brand-name-preview feed-h1-preview">${variables.title}</div>
            <div class="description-preview">${about}</div>
            <div class="url-preview">
                <a href="#">${variables.url}</a>
            </div>
            <div class="expirations-preview">
                <div class="timestamp-preview">${expiration}</div>
                <div class="budget-preview">
                    <div class="remaining_amount-preview">${budget}</div>
                </div>
            </div>
            <div class="preview-row">
                <div>${requires_approval}</div>
                <div>${requires_product}</div>
            </div>
            <div class="preview-row">${internationalNumberFormat.format(max_payout) == 0 ? "" : internationalNumberFormat.format(max_payout)}</div>
            <div class="preview-row">${gender}</div>
            <div class="preview-row">${age}</div>
            <div class="preview-row">${region}</div>
        </div>
    </div>`
    document.getElementsByClassName("feed-campaign-preview")[0].innerHTML = campaign_preview
}

function post(path, parameters) {
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        if (["primary_image"].includes(key)) {
            formData.append(key, variables["primary_image"]["path"])
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
        success: async function(data){
            Swal.fire({
                title: 'Success!',
                text: 'Your campaign is now live ',
                icon: 'success',
                iconColor: "#0A47E4",
                confirmButtonColor: "#0A47E4", 
                }).then(function() {
                window.location = "manage_campaigns.html";
            });
        }
    });
}
var api_url = "https://sclnk.app/campaigns"
var pages = [page_1, page_2, page_3, page_4, page_5]
var page_constructor = new PageConstructor(variables, pages, document)
page_constructor.show();
page_constructor.create_listeners()
create_campaign_preview()
var next_button = document.getElementById("login-signup-action-button")
next_button.onclick = function () {
    if (page_constructor.current_page == pages.length-1) {
        var response = post(api_url, variables)
    } else {
        page_constructor.next_page("Launch Campaign")
    }
}
var back_button = document.getElementById("back-button")
back_button.onclick = function () {
    page_constructor.previous_page()
}
$(document).on("change", "input", function(){
    create_campaign_preview()
})
$(document).on("change", "select", function(){
    create_campaign_preview()
})
$(document).on("change", "textarea", function(){
    create_campaign_preview()
})