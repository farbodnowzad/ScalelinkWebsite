const user_id = localStorage.getItem("user_id")
let instagram_id;
var internationalNumberFormat = new Intl.NumberFormat('en-US')

async function get_feed() {
    var api_url = "https://sclnk.app/feed/home"
    // api url
    const url = api_url + `?user_id=${user_id}`;
    // Storing response
    await $.get(url, function(data){
        // Display the returned data in browser
        return show(data)
    });
}
async function get_user() {
    var api_url = "https://sclnk.app/users"
    // api url
    const url = api_url + `?_id=${user_id}`;
    // Storing response
    await $.get(url, function(data){
        // Display the returned data in browser
        var ig_id = data.users[0]['social_accounts']['instagram_id']
        localStorage.setItem("instagram_id", ig_id);

        var twitter_id = data.users[0]['social_accounts']['twitter_id']
        localStorage.setItem("twitter_id", twitter_id);
        
        if (ig_id || twitter_id) {
            document.getElementsByClassName("connect-social-media-wrapper")[0].classList.add("hidden")
        }
    });
}

get_feed();
get_user();
function show(data) {
    var results = data.campaigns
    var businesses = data.businesses
    var campaign_metrics = data.campaign_metrics
    let row = ``;
    // Loop to access all rows 
    for (let campaign of results) {
        var business = businesses.filter(business => business._id == campaign.business_id)[0]
        var campaign_metric = campaign_metrics.filter(campaign_metric => campaign_metric.campaign_id == campaign._id)[0]
        var requires_approval = campaign.requires_approval ? "<div class='requires-approval'><img class = 'requirement-icon' src='../assets/img/requires_approval_icon.png'/> Requires Approval</div>" : ""
        var sends_product = campaign.requires_product ? "<div class='sends-product'><img class = 'requirement-icon' src='../assets/img/sends_product_icon.png'/> Sends Product</div>" : ""
        var categories_row = category_indicators(business.categories)
        var max_payout = campaign.max_payout || Number.MAX_VALUE
        var budget_remaining = Math.min((campaign.budget - campaign_metric.budget_spent) * 0.85, max_payout)
        var budget_formatted = internationalNumberFormat.format(parseInt(budget_remaining / 100))
        var about_formatted = campaign.about.length > 250 ? campaign.about.slice(0,250) + '...' : campaign.about
        row += `<div class="feed-campaign" campaign_id=${campaign._id}>
                    <div class="content-container">
                        <div class="banner-image">
                            <img src="${campaign.primary_image}"/>
                        </div>
                        <div class="text-content">
                            <div class="brand-name feed-h1">${business.name}</div>
                            <div class="description"><span class="heavy">${campaign.title}</span></div>
                            ${categories_row}
                            <div class="description">${about_formatted}</div>
                            <div class="requirements">
                                ${requires_approval}
                                ${sends_product}
                            </div>
                            <div class="campaign-tags-row">
                                <div class="campaign-tag-dark">Exp. ${campaign.expiration}</div>
                                <div class="campaign-tag-dark">Avail. $${budget_formatted}</div>
                                <div class="campaign-tag-dark">$1.70/click</div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("campaign-feed").innerHTML = row || 'No campaigns right now. Check back soon.';
    $(document).on("click", ".feed-campaign", function() {
        window.location.href = `campaign.html?id=${this.getAttribute("campaign_id")}`
    })
    $(document).on("click", ".referral-link", function() {
        var referral_link = `https://scalelink.xyz/app/referral.html?referral_id=${user_id}`
        var data = [new ClipboardItem({ "text/plain": new Blob([referral_link], { type: "text/plain" }) })];
        navigator.clipboard.write(data).then(function() {
            window.FlashMessage.info('Referral link copied to clipboard!')
        }, function() {
            console.error("Unable to write to clipboard. :-(");
        });
    })
}

function category_indicators(categories) {
    var categories_items = ``
    for (let category of categories) {
        categories_items += `<div class="campaign-tag">${category}</div>`
    }
    return `<div class="campaign-tags-row">${categories_items}</div>`
}