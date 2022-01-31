import {Auth} from './auth.js'
const auth = new Auth();
var internationalNumberFormat = new Intl.NumberFormat('en-US')

async function getapi(api_url, parameters) {
    // api url
    var url = new URL(api_url)
    // append parameters to url
    for (const [key, value] of Object.entries(parameters)) {
        url.searchParams.append(key, value)
    }
    // Storing response
    $.get(url.href, function(data){
        show(data);
    });
}
var api_url = "https://sclnk.app/payments"
var business_id = auth.business_id;;

getapi(api_url, {"business_id": business_id});

function show(data) {
    let row = ``;
    var payments = data.payments;
    var campaigns = data.campaigns;
    
    // Loop to access all rows 
    for (let payment of payments) {
        var payment_type = payment.type;
        var payment_prefix = payment_type == "deposit" ? "&uarr; Deposited" : "&darr; Refunded"
        var amount_formatted = internationalNumberFormat.format(payment.amount / 100)
        var text_color = payment_type == "deposit" ? "#18A037" : "#CF3A3A"
        var campaign = campaigns.filter(campaign => campaign._id == payment.campaign_id)[0]
        row += `<div class="transactions-row">
                    <div class="transactions-description">
                        <div class="transactions-text"><span style="color: ${text_color}"> ${payment_prefix} $${amount_formatted}</span><span style="color: grey;"> on ${payment.timestamp}</span></div><br>
                        <div class="transactions-text"><span style="color: grey">Campaign: </span><a class="notificaiton-campaign-link" href="campaign.html?id=${campaign._id}"><span class="notifications-campaign-name">${campaign.title}</span></a></div>
                    </div>
                </div>`;
    }
    // Setting innerHTML as tab variable
    document.getElementsByClassName("transactions-feed")[0].innerHTML = row || "No transactions";;
}