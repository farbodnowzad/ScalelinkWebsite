function get_campaign() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const campaign_id = urlParams.get('id')
    var api_url = "https://sclnk.app/campaigns"
    // api url
    const url = api_url + `?_id=${campaign_id}`;
    // Storing response
    $.get(url, function(data){
        // Display the returned data in browser
        show(data);
    });
}

get_campaign();

function show(data) {
    var campaign = data.campaigns[0]
    var business = data.businesses[0]
    let row = ``;
    console.log(data.businesses)
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
}