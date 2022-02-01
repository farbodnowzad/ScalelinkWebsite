const user_id = localStorage.getItem("user_id")
const instagram_id = localStorage.getItem("instagram_id")
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
async function post_instagram_code(instagram_code) {
    var formData = new FormData()
    formData.append("code", instagram_code)
    formData.append("user_id", user_id)
        var instagram_url = "https://sclnk.app/users/instagram"
        let instagram_response;
        $.ajax({
            url: sign_up_url,
            data: formData,
            processData: false,
            contentType: false,
            async: false,
            type: 'POST',
            success: function(data){
                instagram_response = data.response;
            }
        });
        return instagram_response;
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const instagram_code = urlParams.get('code')
if (instagram_code) {
    var instagram_response = post_instagram_code(instagram_code)
    localStorage.setItem("instagram_id", instagram_response.id);
    get_feed();
} else {
    get_feed();
}
if (!instagram_id) {
    document.getElementsByClassName("connect-instagram")[0].classList.remove("hidden")
}
function show(data) {
    var results = data.campaigns
    var businesses = data.businesses
    let row = ``;
    // Loop to access all rows 
    for (let campaign of results) {
        var budget_formatted = internationalNumberFormat.format(campaign.budget / 100)
        var business = businesses.filter(business => business._id == campaign.business_id)[0]
        var requires_approval = campaign.requires_approval ? "<div class='requires-approval'><img class = 'requirement-icon' src='../assets/img/requires_approval_icon.png'/> Requires Approval</div>" : ""
        var sends_product = campaign.requires_product ? "<div class='sends-product'><img class = 'requirement-icon' src='../assets/img/sends_product_icon.png'/> Sends Product</div>" : ""
        row += `<div class="feed-campaign" campaign_id=${campaign._id}>
                    <div class="content-container">
                        <div class="banner-image">
                            <img src="${campaign.primary_image}"/>
                        </div>
                        <div class="text-content">
                            <div class="brand-name feed-h1">${business.name}</div>
                            <div class="description"><span class="bold">${campaign.title}</span></div>
                            <div class="description">${campaign.about}</div>
                            <div class="url">
                                <a href="http://${campaign.url}" target="_blank">${campaign.url}</a>
                            </div>
                        </div>
                        <div class="requirements">
                            ${requires_approval}
                            ${sends_product}
                        </div>
                        <div class="expirations">
                            <div class="timestamp">Expires: <span class="bold">${campaign.expiration}</span></div>
                            <div class="budget">Available: <span class="bold">$${budget_formatted}</span></div>
                        </div>
                        <div class="text-content">
                            <div class="description">Status: ${campaign.status}</div>
                        </div>
                    </div>
                </div>`;
    }
    // Setting innerHTML as tab variable
    document.getElementById("campaign-feed").innerHTML = row;
    $(document).on("click", ".feed-campaign", function() {
        window.location.href = `campaign.html?id=${this.getAttribute("campaign_id")}`
    })
    $(document).on("click", ".connect-instagram", function() {
        var url = `https://api.instagram.com/oauth/authorize?client_id=1130340001160455&redirect_uri=https://www.scalelink.xyz/app/home.html&scope=user_profile,user_media&response_type=code`
        window.open(url, '_blank');
    })
}