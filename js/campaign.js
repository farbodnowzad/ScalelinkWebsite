import {Auth} from './auth.js'
const auth = new Auth();

async function getapi(api_url, key, value) {
    // api url
    const url = api_url + `?${key}=${value}`;
    // Storing response
    $.get(url, function(data){
        // Display the returned data in browser
        show(data);
    });
}

async function user_address_csv(api_url, parameters) {
    // api url
    var url = new URL(api_url)
    // append parameters to url
    for (const [key, value] of Object.entries(parameters)) {
        url.searchParams.append(key, value)
    }
    console.log(url.href)
    // Storing response
    $.get(url.href, function(data){
        var user_info = data.user_info
        let csvContent = "data:text/csv;charset=utf-8,";

        user_info.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    });
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const campaign_id = urlParams.get('id')
const business_id = auth.business_id;
var api_url = "http://scalelink-api-env.eba-ncaemzfy.us-west-1.elasticbeanstalk.com/campaigns"
getapi(api_url, "_id", campaign_id);

function create_campaign_overview(campaign) {
    obj = `<div class="banner-image">
                <img src="${campaign.primary_image}"/>
            </div>
            <div class="brand-name feed-h1">${campaign.title}</div>
            <div class="description campaign-field">
                ${campaign.about}
            </div>
            <div class="url campaign-field">
                <span class="campaign-field-title">URL</span><br>
                <a href="#">${campaign.url}</a>
            </div>
            <div class="expiration campaign-field">
                <span class="campaign-field-title">Expires</span><br>
                ${campaign.expiration}
            </div>
            <div class="do-mention campaign-field">
                <span class="campaign-field-title">Influencers should mention</span><br>
                ${campaign.do_mention}
            </div>
            <div class="do-not-mention campaign-field">
                <span class="campaign-field-title">Influencers should not mention</span><br>
                ${campaign.do_not_mention}
            </div>
            <div class="requires-approval campaign-field">
                <span class="campaign-field-title">Requires Approval</span><br>
                ${campaign.requires_approval}
            </div>
            <div class="requires-product campaign-field">
                <span class="campaign-field-title">Requires Product</span><br>
                ${campaign.requires_product}
            </div>
            <div class="gender campaign-field">
                <span class="campaign-field-title">Gender</span><br>
                ${campaign.gender}
            </div>
            <div class="age campaign-field">
                <span class="campaign-field-title">Age</span><br>
                ${campaign.age}
            </div>
            <div class="regions campaign-field">
                <span class="campaign-field-title">Regions</span><br>
                ${campaign.region}
            </div>
            <div id="expire-campaign">
                Expire Campaign
            </div>`
    return obj
}

function show(data) {
    results = data.campaigns
    campaign = results[0]
    campaign_overview = create_campaign_overview(campaign)
    // Setting innerHTML as tab variable
    document.getElementsByClassName("campaign-overview")[0].innerHTML = campaign_overview;
}

$(document).on("click", ".campaign-product-users", function() {
    var url = "http://scalelink-api-env.eba-ncaemzfy.us-west-1.elasticbeanstalk.com/link_requests/product_request_users"
    user_address_csv(url, {"campaign_id": campaign_id, "business_id": business_id})
})