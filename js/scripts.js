$('.feed-campaign').click(function(e){
    if(e.target.nodeName == 'A') return;
    window.location = $(this).find("a").attr("href");
    return false;
});
