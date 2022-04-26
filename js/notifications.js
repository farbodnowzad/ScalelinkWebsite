import {Auth} from './auth.js'
const auth = new Auth();
import {capitalize} from './helpers.js'

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
var api_url = "https://sclnk.app/link_requests"
var business_id = auth.business_id;;

getapi(api_url, {"business_id": business_id, "status": "open"});

function notification_action(parameters) {
    var path = "https://sclnk.app/link_requests/action"
    var formData = new FormData()
    $.each(parameters, function(key, value) {
        formData.append(key, value)
    });
    $.ajax({
        url: path,
        data: formData,
        processData: false,
        contentType: false,
        type: 'POST',
        success: async function(data){
            window.location.reload();
        }
    });
}

function show(data) {
    var link_requests = data.link_requests;
    var campaigns = data.campaigns;
    var users = data.users;
    let row = ``;
    
    // Loop to access all rows 
    for (let link_request of link_requests) {
        var user = users.filter(user => user._id == [link_request.user_id])[0]
        var campaign = campaigns.filter(campaign => campaign._id == [link_request.campaign_id])[0]
        var notification_text = link_request.product == "false" ? " is requesting a link" : " is requesting a product"
        var date_of_birth = user.date_of_birth;
        var dob_split = date_of_birth.split("/") 
        const get_age = dob_split => Math.floor((new Date() - new Date(`${dob_split[2]}/${dob_split[0]}/${dob_split[1]}`).getTime()) / 3.15576e+10)
        var age = get_age(dob_split)
        var ig_username = user.social_accounts.instagram_username || ""
        ig_username = ig_username.slice()
        var twitter_username = user.social_accounts.twitter_username || ""
        twitter_username = twitter_username.slice()
        row += `<div class="notifications-row">
                    <div class="notifications-clickable">
                        <div class="notifications-image-wrapper">
                            <img class="notifications-image" src="${user.profile_image}"/>
                        </div> 
                        <div class="notifications-description" full_name="${user.full_name}" gender="${user.gender}" age="${age}" city="${user.address.city}" \
                            state="${user.address.state}" country="${user.address.country}" instagram="${ig_username}" twitter="${twitter_username}">
                            <div class="notifications-user-text">${user.full_name}${notification_text}</div><br>
                            <a class="notificaiton-campaign-link" href="campaign.html?id=${campaign._id}"><div class="notifications-campaign-name">${campaign.title}</div></a>
                        </div>
                    </div>
                    <div class="notifications-actions">
                        <div class="notifications-deny" link_request_id="${link_request._id}">Deny</div>
                        <div class="notifications-accept" link_request_id="${link_request._id}">Accept</div>
                    </div>
                </div>`;
    }
    // Setting innerHTML as tab variable
    document.getElementsByClassName("notifications-feed")[0].innerHTML = row || "No notifications";

    // Get the modal
    var modal = document.getElementById("user_modal");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    $(document).on("click", ".notifications-clickable", function() {
        var profile_image = this.querySelectorAll(".notifications-image")[0].src;
        var att = this.querySelectorAll(".notifications-description")[0].attributes;
        var full_name = att["full_name"].value;
        var gender = capitalize(att["gender"].value)
        var age = att["age"].value;
        var location = `${capitalize(att["city"].value)}, ${capitalize(att["state"].value)}`
        var country = capitalize(att["country"].value)
        var instagram_username = att["instagram"].value
        var twitter_username = att["twitter"].value
        document.getElementsByClassName("modal-image")[0].src = profile_image;
        document.getElementsByClassName("modal-info-name")[0].innerHTML = full_name;
        document.getElementsByClassName("modal-info-gender")[0].innerHTML = gender;
        document.getElementsByClassName("modal-info-age")[0].innerHTML = age;
        document.getElementsByClassName("modal-info-location")[0].innerHTML = location;
        document.getElementsByClassName("modal-info-country")[0].innerHTML = country;
        document.getElementById("ig-image").innerHTML = `<img src="../assets/img/ig_logo.png"/> ${instagram_username}`
        document.getElementById("twitter-image").innerHTML = `<img src="../assets/img/twitter_logo.png"/> ${twitter_username}`
        if (instagram_username != 'null' &&  instagram_username != 'undefined' && instagram_username) {
            document.getElementsByClassName("modal-info-instagram")[0].style.visibility = 'visible';
            document.getElementsByClassName("modal-info-instagram-link")[0].href = `https://instagram.com/${instagram_username}`;
        } else {
            document.getElementsByClassName("modal-info-instagram")[0].style.visibility = 'hidden';
        }
        if (twitter_username != 'null' && twitter_username != 'undefined' && twitter_username) {
            document.getElementsByClassName("modal-info-twitter")[0].style.visibility = 'visible';
            document.getElementsByClassName("modal-info-twitter-link")[0].href = `https://twitter.com/${twitter_username}`;
        } else {
            document.getElementsByClassName("modal-info-twitter")[0].style.visibility = 'hidden';
        }
        modal.style.display = "block";
    })
    $(document).on("click", ".notifications-deny", function() {
        var link_request_id = this.attributes["link_request_id"].value
        notification_action({"_id": link_request_id, "business_id": business_id, "status": "denied"})
    })
    $(document).on("click", ".notifications-accept", function() {
        var link_request_id = this.attributes["link_request_id"].value
        notification_action({"_id": link_request_id, "business_id": business_id, "status": "accepted"})
    })
}