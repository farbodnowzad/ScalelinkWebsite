import {PageConstructor} from './page_constructor.js'
import {Auth} from './auth.js'
import {pages} from './page_sections/create_campaign.js'
const auth = new Auth();
const stripe =  window.Stripe("pk_test_51K9hYrIyqcT6sVBoc69DHBEsM84eoNp2gv98T0x7pblMXCJnqU0tajuxs46XDYg1aCGue73A5pu8ftrSo95vfn3j00mENAsC2v");
let elements;

var internationalNumberFormat = new Intl.NumberFormat('en-US')
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

function create_campaign_preview() {
    var expiration = variables.expiration ? "Expires: " + variables.expiration : ""
    var budget = variables.budget ? "Budget: $" + internationalNumberFormat.format(variables.budget) : ""
    var about = variables.about ? variables.about.slice(0,100) + "..." : ""
    var requires_approval = variables.requires_approval == 'yes' ? "<div class='requires-approval'><img class = 'requirement-icon' src='../assets/img/requires_approval_icon.png'/> Requires Approval</div>" : ""
    var sends_product = variables.requires_product == 'yes' ? "<div class='sends-product'><img class = 'requirement-icon' src='../assets/img/sends_product_icon.png'/> Sends Product</div>" : ""
    var max_payout = parseInt(variables.max_payout) > 0 ? "<div class='preview-row'>Max Payout: $" + internationalNumberFormat.format(variables.max_payout)+"</div>" : ""
    var gender = variables.gender.length > 0 ? "Gender: " + variables.gender : ""
    var age = variables.age.length > 0 ? "Age: " + variables.age : ""
    var regions = variables.regions.length > 0 ? "Regions: " + variables.regions : ""
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
                ${requires_approval}
                ${sends_product}
            </div>
            ${max_payout}
        </div>
    </div>`
    document.getElementsByClassName("feed-campaign-preview")[0].innerHTML = campaign_preview
}

function show_payment_modal() {
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
        document.querySelector("#main-action-button").disabled = false;
        document.querySelector("#main-action-button-spinner").classList.add("hidden");
        document.querySelector("#main-action-button-text").classList.remove("hidden");
    }
    var modal = document.getElementById("payment-modal");
    modal.querySelectorAll(".payment-total-amount")[0].innerHTML = "Deposit $" + internationalNumberFormat.format(variables.budget)
    modal.style.display = "block";
}

async function create_campaign(path, parameters) {
    if (variables.campaign_id) {
        return {"campaign_id": variables.campaign_id}
    }
    document.querySelector("#main-action-button").disabled = true;
    document.querySelector("#main-action-button-spinner").classList.remove("hidden");
    document.querySelector("#main-action-button-text").classList.add("hidden");

    var formData = new FormData()
    $.each(parameters, function(key, value) {
        if (["primary_image"].includes(key)) {
            formData.append(key, variables[key]["path"])
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

function update_campaign(path, parameters) {
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
            update_campaign("https://sclnk.app/campaigns/activate", {"_id": variables.campaign_id, "status": "active"})
        }
    });
}

var page_constructor = new PageConstructor(variables, pages, document)
page_constructor.show(create_campaign=true);
page_constructor.create_listeners()

// generate preview based on updates to the variables
create_campaign_preview()
$(document).on("change", "input", function(){
    create_campaign_preview()
})
$(document).on("change", "select", function(){
    create_campaign_preview()
})
$(document).on("change", "textarea", function(){
    create_campaign_preview()
})

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
    if (page_constructor.current_page == pages.length-1) {
        create_campaign("https://sclnk.app/campaigns", variables).then((resp) => {
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
        var page = pages[page_constructor.current_page]
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
            page_constructor.next_page("Deposit Funds")
        }
    }
}

// load the previous section on back button
var back_button = document.getElementById("back-button")
back_button.onclick = function () {
    page_constructor.previous_page()
}
