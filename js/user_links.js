const user_id = localStorage.getItem("user_id")
var internationalNumberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'})

async function get_links() {
    var api_url = "https://sclnk.app/links"
    const url = api_url + `?user_id=${user_id}`;
    await $.get(url, function(data){
        return show(data)
    });
}
get_links();

function show(data) {
    var links = data.links
    var businesses = data.businesses
    var campaigns = data.campaigns
    let row = ``;

    for (let link of links) {
        var campaign = campaigns.filter(campaign => campaign._id == [link.campaign_id])[0]
        var business = businesses.filter(business => business._id == [campaign.business_id])[0]
        var payout_formatted = internationalNumberFormat.format(link.payout / 100)
        row += `<div class="feed-campaign">
                    <div class="content-container">
                        <div class="banner-image">
                            <img src="${campaign.primary_image}"/>
                        </div>
                        <div class="text-content">
                            <div class="brand-name feed-h1">${business.name}</div>
                            <div class="link-campaign-description">
                                <div class="description"><span class="bold">${campaign.title}</span></div>
                                <a class="link-campaign-url" href="campaign.html?id=${campaign._id}">View Campaign &rarr;</a>
                            </div>
                            <div>Expires: ${campaign.expiration}</div>
                            <div class="link-metrics-row">
                                <div class="link-metrics-narrow">
                                    <div class="link-metrics-value">
                                        <span>${payout_formatted}</span>
                                    </div>
                                    <div class="link-metrics-title">
                                        Earnings
                                    </div>
                                </div>
                                <div class="link-metrics-narrow right-side">
                                    <div class="link-metrics-value">
                                        <span>${link.unique_visitors}</span>
                                    </div>
                                    <div class="link-metrics-title">
                                        Unique Visitors
                                    </div>
                                </div>
                            </div>
                            <div class="main-action-button" id="main-action-button" link_url="sclnk.me/${link._id}">
                                <img class="icon" src="../assets/img/copy_link_icon.png"/><span id="main-action-button-text" class="copy-link-text"> Copy Link</span>
                            </div>
                        </div>
                    </div>
                </div>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("links-feed").innerHTML = row || 'None yet. Discover campaigns on the home screen to get new links. Your unique links will be visible here.';
    $(document).on("click", ".main-action-button", function() {
        var link_url = this.getAttribute("link_url")
        var data = [new ClipboardItem({ "text/plain": new Blob([link_url], { type: "text/plain" }) })];
        navigator.clipboard.write(data).then(function() {
            window.FlashMessage.info('Copied to clipboard!')
        }, function() {
            console.error("Unable to write to clipboard. :-(");
        });
    })
}