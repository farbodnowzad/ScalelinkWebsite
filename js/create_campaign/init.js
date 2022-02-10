import {FormConstructor} from './form_constructor.js'
import {Auth} from '../auth.js'
import {pages} from './pages.js'
import { PreviewConstructor } from './preview_constructor.js';
import { format_usd } from '../helpers.js';
const auth = new Auth();
const stripe =  window.Stripe("pk_live_51K9hYrIyqcT6sVBoototWSd1xaTCcTy4jBKT6LAGpLEipd940Ch1YK58YqaZD85aUyr8aWmGrjwxleZLdAKDRgmO004vetOjhY");
let elements;

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
    "regions": [],
    "min_payout": "",
    "max_payout": "",
    "secondary_attachments": [],
}

function show_payment_modal() {
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
    var modal = document.getElementById("payment-modal");
    modal.querySelectorAll(".payment-total-amount")[0].innerHTML = "Deposit " + format_usd(variables.budget)
    modal.style.display = "block";
}

async function create_campaign(parameters) {
    var path = "https://sclnk.app/campaigns";
    if (variables.campaign_id) {
        return {"campaign_id": variables.campaign_id}
    }
    document.querySelector("#main-action-button").disabled = true;
    document.querySelector("#main-action-button-spinner").classList.remove("hidden");
    document.querySelector("#main-action-button-text").classList.add("hidden");

    var formData = new FormData()
    $.each(parameters, function(key, value) {
        if (["primary_image"].includes(key)) {
            if (variables[key]["path"]) {
                formData.append(key, variables[key]["path"])
            }
        } else {
            formData.append(key, value)
        }
    });
    console.log(parameters)
    const response = await $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST'
    });
    document.querySelector("#main-action-button").disabled = false;
    document.querySelector("#main-action-button-spinner").classList.add("hidden");
    document.querySelector("#main-action-button-text").classList.remove("hidden");
    return response;
}

async function save_campaign(parameters) {
    var path = "https://sclnk.app/campaigns/save";
    if (variables.campaign_id) {
        return {"campaign_id": variables.campaign_id}
    }

    var formData = new FormData()
    $.each(parameters, function(key, value) {
        if (["primary_image"].includes(key)) {
            if (variables[key]["path"]) {
                formData.append(key, variables[key]["path"])
            }
        } else {
            formData.append(key, value)
        }
    });
    const response = await $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST'
    });
    return response;
}

function activate_campaign(path, parameters) {
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        formData.append(key, value)
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

async function initialize_payment_intent(campaign_id) {
    var parameters = {"budget": variables.budget, "campaign_id": campaign_id, "business_id": variables.business_id};
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        formData.append(key, value)
    });
    var path = "https://sclnk.app/payments/create_payment_intent"
    const response = await $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST'
    });

    const clientSecret = response.clientSecret;
    variables["client_secret"] = clientSecret
    const appearance = {
        theme: 'stripe',
        variables: {
          colorPrimary: '#0a47e4',
        },
    };
    elements = stripe.elements({ appearance, clientSecret });
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: "https://scalelink.xyz",
        },
    }).then(function(result) {
        setLoading(false);
        if (result.error) {
            if (result.error.type === "card_error" || result.error.type === "validation_error") {
                showMessage(error.message);
            } else {
                showMessage("An unexpected error occured.");
            }
        } else {
            activate_campaign("https://sclnk.app/campaigns/activate", {"_id": variables.campaign_id, "status": "active"})
        }
    });
}

async function get_campaign(campaign_id) {
    var campaign_api_url = "https://sclnk.app/campaigns"
    // api url
    const campaign_url = campaign_api_url + `?_id=${campaign_id}`;
    // Storing response
    let campaign_data;
    await $.get(campaign_url, function(data){
        // Display the returned data in browser
        campaign_data = data
    });
    variables = campaign_data.campaigns[0]
    variables.budget = variables.budget / 100
    variables.max_payout = variables.max_payout / 100
    variables.primary_image = {"filename": variables.primary_image || "", "path": variables.primary_image || ""}
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const campaign_id = urlParams.get('id')
if (campaign_id) {
    await get_campaign(campaign_id);
}
var form_constructor = new FormConstructor(variables, pages, document)
form_constructor.show();
form_constructor.create_listeners();

var preview_constructor = new PreviewConstructor(variables, document)
preview_constructor.create_campaign_preview();
preview_constructor.create_listeners()

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("#submit").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("#submit").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  }

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageText.textContent = "";
    }, 4000);
}

var next_button = document.getElementById("main-action-button")
next_button.onclick = function () {
    if (form_constructor.current_page == pages.length-1) {
        create_campaign(variables).then((resp) => {
            variables["campaign_id"] = resp.campaign_id;
            initialize_payment_intent(variables["campaign_id"]);
            document.querySelector("#submit").addEventListener("click", handleSubmit);
            show_payment_modal();
            var event = "new_campaign";
            var eventProperties = {
                "app": "business",
            };
            amplitude.getInstance().logEvent(event, eventProperties);
        })
    } else {
        var page = pages[form_constructor.current_page]
        let current_keys = page.filter(function (currentElement) {
            return currentElement["required"]
        });
        var error = 0;
        current_keys.forEach(key_obj => {
            if (!variables[key_obj.name]) {
                console.log(key_obj.name)
                error++;
            }
        });
        if (error) {
            document.getElementById("blank-fields-message").style.display = "inline-block";
        } else {
            document.getElementById("blank-fields-message").style.display = "none";
            form_constructor.next_page("Deposit Funds")
        }
    }
}

// load the previous section on back button
var back_button = document.getElementById("back-button")
back_button.onclick = function () {
    form_constructor.previous_page()
}

// save the current campaign
var save_button = document.getElementById("save-button")
save_button.onclick = function () {
    save_campaign(variables);
    save_button.innerHTML = "Saved &#x2714;"
    save_button.style.backgroundColor = "#CDCCCC"
}
