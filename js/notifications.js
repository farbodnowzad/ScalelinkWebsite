import {Auth} from './auth.js'
const auth = new Auth();

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
var api_url = "http://scalelink-api-env.eba-ncaemzfy.us-west-1.elasticbeanstalk.com/link_requests"
var business_id = auth.business_id;;

getapi(api_url, {"business_id": business_id, "status": "open"});

function notification_action(parameters) {
    var path = "http://scalelink-api-env.eba-ncaemzfy.us-west-1.elasticbeanstalk.com/link_requests/action"
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
        var date_of_birth = '24';
        row += `<div class="notifications-row">
                    <div class="notifications-clickable">
                        <div class="notifications-image-wrapper">
                            <img class="notifications-image" src="${user.profile_image}"/>
                        </div> 
                        <div class="notifications-description" full_name="${user.full_name}" gender="${user.gender}" age="${date_of_birth}" location="${user.city}" social="${user.social}">
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
    document.getElementsByClassName("notifications-feed")[0].innerHTML = row;

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
        // var profile_image = this.getElementById("notifications-image")[0].src;
        var att = this.querySelectorAll(".notifications-description")[0].attributes;
        var full_name = att["full_name"].value;
        var gender = att["gender"].value;
        var age = att["age"].value;
        var location = att["location"].value;
        document.getElementsByClassName("modal-info-name")[0].innerHTML = full_name;
        document.getElementsByClassName("modal-info-gender")[0].innerHTML = gender;
        document.getElementsByClassName("modal-info-age")[0].innerHTML = age;
        document.getElementsByClassName("modal-info-location")[0].innerHTML = location;
        document.getElementsByClassName("modal-info-social-link")[0].href = "https://instagram.com/farbodnowzad";
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