import {UserAuth} from './user_auth.js'
var user_auth = new UserAuth()
const user_id = user_auth.user_id

async function get_campaign() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const campaign_id = urlParams.get('id')
    var campaign_api_url = "https://sclnk.app/campaigns"
    var links_api_url = "https://sclnk.app/links"
    // api url
    const campaign_url = campaign_api_url + `?_id=${campaign_id}`;
    const links_url = links_api_url + `?user_id=${user_id}`;
    // Storing response
    let campaign_data;
    let links;
    await $.get(campaign_url, function(data){
        // Display the returned data in browser
        campaign_data = data
    });
    await $.get(links_url, function(data){
        // Display the returned data in browser
        links = data
    });
    show(campaign_data, links)
}

get_campaign();

function show(campaign_data, links_data) {
    var campaign = campaign_data.campaigns[0]
    var business = campaign_data.businesses[0]
    var links = links_data.links
    var existing_links = links.filter(link => campaign._id == link.campaign_id)
    let existing_link;
    if (existing_links.length == 0) {
        existing_link = null;
    } else {
        existing_link = existing_link[0];
    }
    let row = ``;
    var requires_approval = campaign.requires_approval ? "<div class='requires-approval'><img class = 'requirement-icon' src='../assets/img/requires_approval_icon.png'/> Requires Approval</div>" : ""
    var sends_product = campaign.requires_product ? "<div class='sends-product'><img class = 'requirement-icon' src='../assets/img/sends_product_icon.png'/> Sends Product</div>" : ""
    row += `<div class="content-container">
                <div class="banner-image">
                    <img src="${campaign.primary_image}"/>
                </div>
                <div class="text-content">
                    <div class="brand-name feed-h1">${business.name}</div>
                    <div class="description">${business.about}</div>
                    <div class="description"><span class="bold">${campaign.title}</span></div>
                    <div class="description">${campaign.about} everybody know its going to be an epic summer so come have fun with it</div>
                    <div class="url">
                        <span class="campaign-field-header">Campaign URL</span><br>
                        <a href="http://${campaign.url}" target="_blank">${campaign.url}</a>
                    </div>
                </div>
                <div class="requirements">
                    ${requires_approval}
                    ${sends_product}
                </div>
                <div class="expirations">
                    <div class="timestamp">Expires <span class="bold">${campaign.expiration}</span></div>
                    <div class="budget">Remaining $<span class="bold">100,000</span></div>
                </div>
                <div class="do-talk-about text-content">
                    <span class="campaign-field-header">Do Talk About</span><br>
                    ${campaign.do_mention}
                </div>
                <div class="do-not-talk-about text-content">
                    <span class="campaign-field-header">Do Not Talk About</span><br>
                    ${campaign.do_not_mention}
                </div>
                <div class="text-content url">
                    <span class="campaign-field-header">Business Website</span><br>
                    <a href="http://${business.website}" target="_blank">${business.website}</a>
                </div>
                <div class="contact text-content">
                    <span class="campaign-field-header">Contact</span><br>
                    ${business.contact}
                </div>
            </div>`;
    // Setting innerHTML as tab variable
    document.getElementsByClassName("feed-campaign")[0].innerHTML = row;
    if (existing_link) {
        document.getElementsByClassName("get-link")[0].innerHTML = `<img class="icon" src="../assets/img/copy_link_icon.png"/><span id="main-action-button-text" class="copy-link-text"> Copy Link</span>`
        $(document).on("click", ".main-action-button", function() {
            var link_url = existing_link.url;
            var data = [new ClipboardItem({ "text/plain": new Blob([link_url], { type: "text/plain" }) })];
            navigator.clipboard.write(data).then(function() {
                window.FlashMessage.info('Copied to clipboard!')
            }, function() {
                console.error("Unable to write to clipboard. :-(");
            });
        })
    } else if (campaign.requires_product || campaign.requires_approval) {
        document.getElementsByClassName("get-link")[0].innerHTML = `<span id="main-action-button-text" class="copy-link-text">Request Link</span>`
        $(document).on("click", ".main-action-button", function() {
            var link_url = ""
        })
    } else {
        document.getElementsByClassName("get-link")[0].innerHTML = `<span id="main-action-button-text" class="copy-link-text">Get Link</span>`
        $(document).on("click", ".main-action-button", function() {
            var link_url = existing_link.url;
            var data = [new ClipboardItem({ "text/plain": new Blob([link_url], { type: "text/plain" }) })];
            navigator.clipboard.write(data).then(function() {
                window.FlashMessage.info('Copied to clipboard!')
            }, function() {
                console.error("Unable to write to clipboard. :-(");
            });
        })
    }
}