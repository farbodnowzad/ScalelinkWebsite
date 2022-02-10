const user_id = localStorage.getItem("user_id")
let instagram_id;
var internationalNumberFormat = new Intl.NumberFormat('en-US')

async function get_feed(category) {
    
    var api_url = "https://sclnk.app/feed/home"
    // api url
    const url = api_url + `?user_id=${user_id}&category=${category}`;
    // Storing response
    await $.get(url, function(data){
        // Display the returned data in browser
        return show(data)
    });
}

function format_section_header(category) {
    var cateogry_name_parts = category.split("_")
    var category_parts_formatted = []
    for (let part of cateogry_name_parts) {
        category_parts_formatted.push(part.charAt(0).toUpperCase() + part.slice(1))
    }
    return category_parts_formatted.join(" & ")
}
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category')
var section_header = document.getElementsByClassName('section-header')[0]
section_header.innerHTML = format_section_header(category)

get_feed(category);

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
    document.getElementById("campaign-feed").innerHTML = row || 'No campaigns right now in this caetgory. Check back soon.';
    $(document).on("click", ".feed-campaign", function() {
        window.location.href = `campaign.html?id=${this.getAttribute("campaign_id")}`
    })
}

function category_indicators(categories) {
    var categories_items = ``
    for (let category of categories) {
        categories_items += `<div class="campaign-tag">${category}</div>`
    }
    return `<div class="campaign-tags-row">${categories_items}</div>`
}