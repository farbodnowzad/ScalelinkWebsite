import {Auth} from './auth.js'
const auth = new Auth();
var internationalNumberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'})

async function get_overview(key, value) {
    var api_url = "https://sclnk.app/campaigns"
    // api url
    const url = api_url + `?${key}=${value}`;
    // Storing response
    let campaign;
    await $.get(url, async function(data){
        // Display the returned data in browser
        show_campaign_overview(data);
        var results = data.campaigns
        campaign = results[0]
    });
    return campaign;
}

export async function get_metrics(key, value, campaign) {
    var api_url = "https://sclnk.app/campaign_metrics"
    // api url
    const url = api_url + `?${key}=${value}`;
    // Storing response
    $.get(url, function(data){
        // Display the returned data in browser
        show_campaign_metrics(data, campaign);
    });
}

async function user_address_csv(api_url, parameters) {
    // api url
    var url = new URL(api_url)
    // append parameters to url
    for (const [key, value] of Object.entries(parameters)) {
        url.searchParams.append(key, value)
    }
    // Storing response
    $.get(url.href, function(data){
        var user_info = data.user_info
        let csvContent = "data:text/csv;charset=utf-8,";

        user_info.forEach(function(rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        var encodedUri = encodeURI(csvContent);
        encodedUri = encodedUri.replace("#", "%23")
        var hiddenElement = document.createElement('a');  
        hiddenElement.href = encodedUri
        hiddenElement.target = '_blank';  
        
        hiddenElement.download = 'Campaign_Addresses.csv';
        hiddenElement.click(); 
    });
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const campaign_id = urlParams.get('id')
const business_id = auth.business_id;
get_overview("_id", campaign_id).then(campaign => {get_metrics("campaign_id", campaign_id, campaign);});

function create_campaign_overview(campaign) {
    var expire_campaign = campaign.status == 'active'? `<div id="expire-campaign">Expire Campaign</div>` : ``
    const regex = /(?:\r\n|\r|\n)/g;
    var obj = `<div class="banner-image">
                <img src="${campaign.primary_image}"/>
            </div>
            <div class="brand-name feed-h1">${campaign.title}</div>
            <div class="description campaign-field">
                ${campaign.about.replace(regex, '<br>')}
            </div>
            <div class="url campaign-field">
                <span class="campaign-field-title">URL</span><br>
                <a href="https://${campaign.url}" class='url-text'>${campaign.url}</a>
            </div>
            <div class="expiration campaign-field">
                <span class="campaign-field-title">Expires</span><br>
                ${campaign.expiration}
            </div>
            <div class="do-mention campaign-field">
                <span class="campaign-field-title">Influencers should mention</span><br>
                ${campaign.do_mention.replace(regex, '<br>')}
            </div>
            <div class="do-not-mention campaign-field">
                <span class="campaign-field-title">Influencers should not mention</span><br>
                ${campaign.do_not_mention.replace(regex, '<br>')}
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
                ${campaign.region_names}
            </div>
            ${expire_campaign}`
    return obj
}

function create_campaign_metrics_top(campaign_metrics, campaign) {
    var obj = `<div class="campaign-metrics-row campaign-status">
                    Status: ${campaign.status}
                </div><br>
                <div class="campaign-metrics-row campaign-product-users">
                    <a href="#" class='url-text'>Download Addresses (${campaign_metrics.product_requests_accepted})</a>
                </div>
                <div class="campaign-metrics-row">
                    <div class="campaign-metrics-narrow">
                        <div class="campaign-metrics-value">
                            ${campaign_metrics.links_created}
                        </div>
                        <div class="campaign-metrics-title">
                            Links Created
                        </div>
                    </div>
                    <div class="campaign-metrics-narrow right-side">
                        <div class="campaign-metrics-value">
                            ${campaign_metrics.extended_unique_visitors}
                        </div>
                        <div class="campaign-metrics-title">
                            Total Unique Visitors
                        </div>
                    </div>
                </div>`
    return obj
}

function create_campaign_metrics_bottom(campaign_metrics, campaign, users) {
    var top_performers_section = ``
    var top_links = campaign_metrics.top_links
    for (let top_link of top_links) {
        var user = users.filter(user => user._id == top_link.user_id)[0]
        top_performers_section += `<div class="top-performers-row">
                <img class="top-performers-image" src="${user.profile_image}"/>
                <div class="top-performers-full-name">${user.full_name}</div>
                <div class="top-performers-value">${top_link.unique_visitors}</div>
            </div>`
    }
    var obj = `<div class="campaign-metrics-row">
                    <div class="campaign-metrics-narrow">
                        <div class="campaign-metrics-value">
                            ${internationalNumberFormat.format((campaign.budget - campaign_metrics.budget_spent) / 100)}
                        </div>
                        <div class="campaign-metrics-title">
                            Budget Remaining
                        </div>
                    </div>
                    <div class="campaign-metrics-narrow right-side">
                        <div class="campaign-metrics-value">
                            ${internationalNumberFormat.format((campaign_metrics.budget_spent) / 100)}
                        </div>
                        <div class="campaign-metrics-title">
                            Budget Spent
                        </div>
                    </div>
                </div>
                <div class="campaign-metrics-row">
                    <div class="campaign-metrics-wide">
                        <div class="top-performers-headers">
                            <div class="top-performers-title">Top Influencers</div>
                            <div class="top-performers-subtitle">Paid Unique Visitors</div>
                        </div>
                        ${top_performers_section}
                    </div>
                </div>
            <div>`
    return obj
}

function show_campaign_overview(data) {
    var results = data.campaigns
    var campaign = results[0]
    var campaign_overview = create_campaign_overview(campaign)
    // Setting innerHTML as tab variable
    document.getElementsByClassName("campaign-overview")[0].innerHTML = campaign_overview;
}

function show_campaign_metrics(data, campaign) {
    var campaign_metrics = data.campaign_metrics
    var users = data.users
    var campaign_metrics_top = create_campaign_metrics_top(campaign_metrics, campaign)
    var campaign_metrics_bottom = create_campaign_metrics_bottom(campaign_metrics, campaign, users)
    document.getElementsByClassName("campaign-metrics")[0].insertAdjacentHTML("afterBegin", campaign_metrics_top)
    document.getElementsByClassName("campaign-metrics")[0].insertAdjacentHTML("beforeend", campaign_metrics_bottom)
}

$(document).on("click", ".campaign-product-users", function() {
    var url = "https://sclnk.app/link_requests/product_request_users"
    user_address_csv(url, {"campaign_id": campaign_id, "business_id": business_id})
})

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
                text: 'Your campaign is now inactive. Any remaining budget has been refunded. ',
                icon: 'success',
                iconColor: "#0A47E4",
                confirmButtonColor: "#0A47E4", 
                }).then(function() {
                window.location = "manage_campaigns.html";
            });
        }
    });
}

$(document).on("click", "#expire-campaign", function() {
    update_campaign("https://sclnk.app/campaigns/expire", {"_id": campaign_id, "status": "expired"})
})
