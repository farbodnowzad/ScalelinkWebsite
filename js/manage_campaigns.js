import {Auth} from './auth.js'
const auth = new Auth();

var business_id = auth.business_id;

async function getapi(api_url, parameters) {
    var formData= new FormData();
    // append parameters to url
    $.each(parameters, function(key, value) {
        formData.append(key, JSON.stringify(value))
    });
    await $.ajax({
        url: api_url,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data){
            // Display the returned data in browser
            show(data);
        }
    });
}

let business;
async function get_business(business_id) {
    var api_url = "https://sclnk.app/businesses"
    var url = new URL(api_url)
    url.searchParams.append('_id', business_id)
    // Storing response
    $.get(url.href, function(data){
        business = data.businesses[0];
        if (!business.seen_onboarding) {
            modal.style.display = "block";
        }
    });
}

async function complete_onboarding() {
    var formData= new FormData();
    formData.append('_id', business_id)
    // append parameters to url
    await $.ajax({
        url: "https://sclnk.app/businesses/seen_onboarding",
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST'
    });
}

// var api_url = "https://sclnk.app/campaigns"
var api_url = "https://sclnk.app/campaigns/manage"

getapi(api_url, {"business_id": business_id, "status": {"$in": ["active", "expired", "pending", "test"]}, "sort": "last_updated"});
get_business(business_id);

var modal = document.getElementById("onboarding_modal");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
    complete_onboarding();
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
$(document).on("click", ".notifications-clickable", function() {
    modal.style.display = "block";
})

$(document).on("click", "#complete-onboarding-btn", function() {
    complete_onboarding();
})

function show(data) {
    var results = data.campaigns
    let row = ``;
    
    // Loop to access all rows 
    for (let campaign of results) {
        var status = campaign.status
        var redirect_to = status == "pending" ? `create_campaign.html?id=${campaign._id}` : `campaign.html?id=${campaign._id}`
        var subtitle = status == "pending" ? `<div class="manage-campaign-continue-editing">Continue Editing</div>` : ''
        row += `<a href="${redirect_to}">
                    <div class="campaign-result">
                        <div class="campaign-result-info">
                            <div class="campaign-result-title">${campaign.title}</div>
                            <div class="campaign-result-expires">${campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</div>
                            ${subtitle}
                        </div>
                        <div class="campaign-result-arrow"><div class="arrow-wrapper"><img src="../assets/img/right_arrow.svg"/></div></div>
                    </div>
                </a>`;
    }
    // Setting innerHTML as tab variable
    document.getElementsByClassName("campaign-results-feed")[0].innerHTML = row || "No campaigns";;
}