const user_id = localStorage.getItem("user_id")

async function get_feed() {
    var api_url = "https://sclnk.app/feed"
    // api url
    const url = api_url + `?user_id=${user_id}`;
    // Storing response
    let feed;
    await $.get(url, function(data){
        // Display the returned data in browser
        return data
    });
}

console.log(get_feed())
console.log("hello")