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
        if (ig_id) {
            localStorage.setItem("instagram_id", ig_id)
            document.getElementsByClassName("connect-instagram-wrapper")[0].classList.add("hidden")
            document.getElementsByClassName("connect-instagram")[0].classList.add("hidden")
            document.getElementsByClassName("connect-instagram-text")[0].classList.add("hidden")
        }
    });
}
function check_instagram_id() {
    instagram_id = localStorage.getItem("instagram_id")
    if (instagram_id == "null" || instagram_id == null) {
        document.getElementsByClassName("connect-instagram-wrapper")[0].classList.remove("hidden")
        document.getElementsByClassName("connect-instagram")[0].classList.remove("hidden")
        document.getElementsByClassName("connect-instagram-text")[0].classList.remove("hidden")
    }
}
get_feed();
get_user();
check_instagram_id()
function show(data) {
    var results = data.campaigns
    var businesses = data.businesses
    let row = ``;
    // Loop to access all rows 
    for (let campaign of results) {
        var budget_formatted = internationalNumberFormat.format(campaign.budget * 0.8 / 100)
        var business = businesses.filter(business => business._id == campaign.business_id)[0]
        var requires_approval = campaign.requires_approval ? "<div class='requires-approval'><img class = 'requirement-icon' src='../assets/img/requires_approval_icon.png'/> Requires Approval</div>" : ""
        var sends_product = campaign.requires_product ? "<div class='sends-product'><img class = 'requirement-icon' src='../assets/img/sends_product_icon.png'/> Sends Product</div>" : ""
        var categories_row = category_indicators(business.categories)
        row += `<div class="feed-campaign" campaign_id=${campaign._id}>
                    <div class="content-container">
                        <div class="banner-image">
                            <img src="${campaign.primary_image}"/>
                        </div>
                        <div class="text-content">
                            <div class="brand-name feed-h1">${business.name}</div>
                            <div class="description"><span class="heavy">${campaign.title}</span></div>
                            ${categories_row}
                            
                            <div class="description">${campaign.about}</div>
                            <div class="url">
                                <a class="url" href="http://${campaign.url}" target="_blank">${campaign.url}</a>
                            </div>
                            <div class="requirements">
                                ${requires_approval}
                                ${sends_product}
                            </div>
                            <div class="campaign-tags-row">
                                <div class="campaign-tag-dark">Expires ${campaign.expiration}</div>
                                <div class="campaign-tag-dark">Available $${budget_formatted}</div>
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
    $(document).on("click", ".connect-instagram", function() {
        var url = `https://api.instagram.com/oauth/authorize?client_id=1130340001160455&redirect_uri=https://scalelink.xyz/app/auth.html&state=${user_id}&scope=user_profile&response_type=code`
        window.open(url, '_blank');
    })
}

function category_indicators(categories) {
    var categories_items = ``
    for (let category of categories) {
        categories_items += `<div class="campaign-tag">${category}</div>`
    }
    return `<div class="campaign-tags-row">${categories_items}</div>`
}