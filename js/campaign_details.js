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

async function request_link() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const campaign_id = urlParams.get('id')
    var api_url = "https://sclnk.app/link_requests"

    var parameters = {"campaign_id": campaign_id, "user_id": user_id}
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        formData.append(key, value)
    });
    const response = await $.ajax({
        url: api_url,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST'
    });
    return response;
}

async function create_link() {
    document.querySelectorAll(".get-link")[0].disabled = true;
    document.querySelector("#main-action-button-spinner").classList.remove("hidden");
    document.querySelector("#main-action-button-text").classList.add("hidden");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const campaign_id = urlParams.get('id')
    var api_url = "https://sclnk.app/links"

    var parameters = {"campaign_id": campaign_id, "user_id": user_id}
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        formData.append(key, value)
    });
    const response = await $.ajax({
        url: api_url,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST'
    });
    return response;
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
        existing_link = existing_links[0];
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
                ${campaign.do_mention ? '<div class="do-talk-about text-content"><span class="campaign-field-header">Do Talk About</span><br>'+campaign.do_mention+'</div>' : ''}
                ${campaign.do_not_mention ? '<div class="do-talk-about text-content"><span class="campaign-field-header">Do Not Talk About</span><br>'+campaign.do_not_mention+'</div>' : ''}
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
        $(document).on("click", ".get-link", function() {
            var link_url = 'sclnk.me/' + existing_link._id
            var data = [new ClipboardItem({ "text/plain": new Blob([link_url], { type: "text/plain" }) })];
            navigator.clipboard.write(data).then(function() {
                window.FlashMessage.info('Copied to clipboard!')
            }, function() {
                console.error("Unable to write to clipboard. :-(");
            });
        })
    } else if (campaign.requires_product || campaign.requires_approval) {
        document.getElementsByClassName("get-link")[0].innerHTML = `<span id="main-action-button-text" class="copy-link-text">Request Link</span>`
        $(document).on("click", ".get-link", function() {
            request_link().then((response) => {
                if (response.link_request_id) {
                    window.FlashMessage.info('<b>Request sent!</b><br>Approved requests will show up in the My Links tab. You will receive a text message once the request is approved.')
                }
                else {
                    window.FlashMessage.info('Request already sent.')
                }
            })
        })
    } else {
        document.getElementsByClassName("get-link")[0].innerHTML = `<div class="spinner hidden" id="main-action-button-spinner"></div><span id="main-action-button-text" class="copy-link-text">Get Link</span>`
        $(document).on("click", ".get-link", function() {
            create_link().then((response) => {
                var link_id = response.link_id;
                var link_url = 'sclnk.me/' + link_id
                var data = [new ClipboardItem({ "text/plain": new Blob([link_url], { type: "text/plain" }) })];
                navigator.clipboard.write(data).then(function() {
                    window.FlashMessage.info('Link copied to clipboard! You can find all your links in the My Links tab.')
                }, function() {
                    console.error("Unable to write to clipboard. :-(");
                });
                document.querySelectorAll(".get-link")[0].disabled = false;
                document.querySelector("#main-action-button-spinner").classList.add("hidden");
                document.querySelector("#main-action-button-text").classList.remove("hidden");
            })
        })
    }
}