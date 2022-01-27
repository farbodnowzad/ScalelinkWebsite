const user_id = localStorage.getItem("user_id")
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
get_feed();
// $('.feed-campaign').click(function(e){
//     if(e.target.nodeName == 'A') return;
//     window.location = $(this).find("a").attr("href");
//     return false;
// });
function show(data) {
    var results = data.campaigns
    let row = ``;
    // Loop to access all rows 
    for (let campaign of results) {
        var budget_formatted = internationalNumberFormat.format(campaign.budget / 100)
        var requires_approval = campaign.requires_approval ? "<div class='requires-approval'><img class = 'requirement-icon' src='../assets/img/requires_approval_icon.png'/> Requires Approval</div>" : ""
        var sends_product = campaign.requires_product ? "<div class='sends-product'><img class = 'requirement-icon' src='../assets/img/sends_product_icon.png'/> Sends Product</div>" : ""
        row += `<div class="feed-campaign" campaign_id=${campaign._id}>
                    <div class="content-container">
                        <div class="banner-image">
                            <img src="${campaign.primary_image}"/>
                        </div>
                        <div class="text-content">
                            <div class="brand-name feed-h1">${campaign.title}</div>
                            <div class="description"><span class="bold">Scalelink Summer Launch</span></div>
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
                            <div class="budget">Budget <span class="bold">$${budget_formatted} Remaining</span></div>
                        </div>
                    </div>
                </div>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("campaign-feed").innerHTML = row;
    $(document).on("click", ".feed-campaign", function() {
        window.location.href = `campaign.html?id=${this.getAttribute("campaign_id")}`
    })
}