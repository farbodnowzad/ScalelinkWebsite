import {PageConstructor} from './page_constructor.js'
import {Auth} from './auth.js'
import {pages} from './page_sections/create_campaign.js'
const auth = new Auth();
const stripe =  Stripe("pk_test_51K9hYrIyqcT6sVBoc69DHBEsM84eoNp2gv98T0x7pblMXCJnqU0tajuxs46XDYg1aCGue73A5pu8ftrSo95vfn3j00mENAsC2v");
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
    "region": "",
    "min_payout": "",
    "max_payout": "",
    "secondary_attachments": [],
}

function create_campaign_preview() {
    var internationalNumberFormat = new Intl.NumberFormat('en-US')
    var expiration = variables.expiration ? "Expires: " + variables.expiration : ""
    var budget = variables.budget ? "Budget: $" + internationalNumberFormat.format(variables.budget) : ""
    var about = variables.about ? variables.about.slice(0,100) + "..." : ""
    var requires_approval = variables.requires_approval == "yes" ? "Requires Approval" : ""
    var requires_product = variables.requires_product == "yes" ? "Requires Product" : ""
    var max_payout = parseInt(variables.max_payout) > 0 ? "Max Payout: $" + internationalNumberFormat.format(variables.max_payout) : ""
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
            <div class="preview-row">${max_payout}</div>
            <div class="preview-row">${gender}</div>
            <div class="preview-row">${age}</div>
            <div class="preview-row">${region}</div>
        </div>
    </div>`
    document.getElementsByClassName("feed-campaign-preview")[0].innerHTML = campaign_preview
}

function show_payment_modal() {
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    var modal = document.getElementById("payment-modal");
    modal.style.display = "block";
}

async function create_campaign(path, parameters) {
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        if (["primary_image"].includes(key)) {
            formData.append(key, variables["primary_image"]["path"])
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
        type: 'PUT',
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
    var parameters = {"budget": variables.budget, "campaign_id": campaign_id};
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        formData.append(key, value)
    });
    // var path = "https://sclnk.app/payments/create_payment_intent"
    var path = "http://127.0.0.1:5000/payments/create_payment_intent"
    const response = await $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST'
    });

    const clientSecret = response.clientSecret;
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
  
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "https://scalelink.xyz",
      },
    });
  
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      showMessage(error.message);
    } else {
      showMessage("An unexpected error occured.");
    }
    setLoading(false);
    update_campaign("https://sclnk.app/campaigns", {"_id": variables.campaign_id, "status": "active"})
}

var page_constructor = new PageConstructor(variables, pages, document)
page_constructor.show();
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

var next_button = document.getElementById("login-signup-action-button")
next_button.onclick = function () {
    if (page_constructor.current_page == pages.length-1) {
        var resp = create_campaign("https://sclnk.app/campaigns", variables)
        // variables["campaign_id"] = resp.campaign_id
        // initialize_payment_intent(resp.campaign_id);
        // checkStatus();
        // document.querySelector("#payment-modal").addEventListener("submit", handleSubmit);
        show_payment_modal()
    } else {
        page_constructor.next_page("Launch Campaign")
    }
}

// load the previous section on back button
var back_button = document.getElementById("back-button")
back_button.onclick = function () {
    page_constructor.previous_page()
}
