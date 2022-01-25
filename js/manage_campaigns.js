import {Auth} from './auth.js'
const auth = new Auth();

async function getapi(api_url, key, value) {
    // api url
    const url = api_url + `?${key}=${value}`;
    // Storing response
    $.get(url, function(data){
        // Display the returned data in browser
        show(data);
    });
}
var api_url = "http://scalelink-api-env.eba-ncaemzfy.us-west-1.elasticbeanstalk.com/campaigns"
var business_id = auth.business_id;;

getapi(api_url, "business_id", business_id);

function show(data) {
    var results = data.campaigns
    let row = ``;
    
    // Loop to access all rows 
    for (let campaign of results) {
        row += `<a href="campaign.html?id=${campaign._id}">
                    <div class="campaign-result">
                        <div class="campaign-result-info">
                            <div class="campaign-result-title">${campaign.title}</div>
                            <div class="campaign-result-timestamps">
                                <div class="campaign-result-expires">Expires: ${campaign.expiration}</div>
                            </div>
                        </div>
                        <div class="campaign-result-arrow"><div class="arrow-wrapper"><img src="../assets/img/right_arrow.svg"/></div></div>
                    </div>
                </a>`;
    }
    // Setting innerHTML as tab variable
    document.getElementsByClassName("campaign-results-feed")[0].innerHTML = row;
}