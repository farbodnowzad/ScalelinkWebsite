import {Auth} from './auth.js'
const auth = new Auth();

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
// var api_url = "https://sclnk.app/campaigns"
var api_url = "https://sclnk.app/campaigns/manage"
var business_id = auth.business_id;;

getapi(api_url, {"business_id": business_id, "status": {"$in": ["active", "expired", "pending", "test"]}, "sort": "last_updated"});

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