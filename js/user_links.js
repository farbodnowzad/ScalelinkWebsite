const user_id = localStorage.getItem("user_id")
var internationalNumberFormat = new Intl.NumberFormat('en-US')

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
                                    <span>${link.payout}</span>
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
                        <div class="main-action-button" id="main-action-button">
                            <img class="icon" src="../assets/img/copy_link_icon.png"/><span id="main-action-button-text" class="copy-link-text"> Copy Link</span>
                        </div>
                    </div>
                </div>`;
        // row += `<div class="feed-campaign">
        //             <div class="content-container">
        //                 <div class="banner-image">
        //                     <img src="${campaign.primary_image}"/>
        //                 </div>
        //                 <div class="text-content">
        //                     <div class="brand-name feed-h1">${business.name}</div>
        //                     <div class="link-campaign-description">
        //                         <div class="description"><span class="bold">${campaign.title}</span></div>
        //                         <a class="link-campaign-url" href="campaign.html?id=${campaign._id}">View Campaign &rarr;</a>
        //                     </div>
        //                     <div class="timestamp">Expires: ${campaign.expiration}</div>
        //                 </div>
        //                 <div class="text-content">
        //                     <div class="description">Status: ${campaign.status}</div>
        //                 </div>
        //             </div>
        //         </div>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("links-feed").innerHTML = row;
    // $(document).on("click", ".feed-campaign", function() {
    //     window.location.href = `campaign.html?id=${this.getAttribute("campaign_id")}`
    // })
}