function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ',' + cityStr;

    $greeting.text('So you want to live at ' + address + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': "62cb20aad25a467ea68f5dcbac63bd81",
        'q': cityStr
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function(result) {

    }).fail(function(err) {
        throw err;
    });


    $.getJSON(url, function(data) {
        console.log(data.response.docs);
        myArticles = data.response.docs;

        for (var i = 0; i < myArticles.length; i++){
            var singleArticle = myArticles[i];
            console.log(singleArticle.snippet);

            $nytElem.append('<li class="article">'+
                '<a href="'+singleArticle.web_url+'">'+singleArticle.headline.main+'</a>'+
                '<p>' + singleArticle.snippet + '</p>'+
            '</li>');

        }
    }).fail(function(e){ $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
});


//wiki work
 var wikiUrl = 'http://en.wikiddspedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });


    return false;
};

$('#form-container').submit(loadData);
