var categories = ["sports", "food", "movies", "games", "business"];
var current = 0;

$(document).ready(function () {
    $("#articles").empty();
    categories.forEach(function (category) {
        refresh(category);
        if ($(".news").length !== 5) {
            $("#articles").append("<hr id='hr-" + category + "'>");
        }
    });

    var refreshInterval;
    refreshInterval = setInterval(increment, 3000);
});

function increment() {
    current = (current + 1) % categories.length;
    autoRefresh(current);
}

function autoRefresh(categoryIndex) {
    refresh(categories[categoryIndex]);
}

function refresh(category) {
    var key = "e3fbe2a60f9d49f9b99072a164a33e71";
    var api_call =
        "https://newsapi.org/v2/everything?q=" +
        category +
        "&apiKey=" +
        key;

    var article = fetchData(api_call);

    if (!article) {
        key = "e3fbe2a60f9d49f9b99072a164a33e71";
        api_call =
            "https://api.newsapi.com/v1/news/all HTTP/2/api-token=" +
            key +
            "&categories=" +
            category;

        article = fetchData(api_call);
    }

    if (article) {
        displayArticle(article, category);
    }
}

function fetchData(api_call) {
    var result = 0;
    var article;

    $.ajax({
        type: "GET",
        dataType: "json",
        url: api_call,
        async: false,
        success: function (data) {
            result = Math.floor(Math.random() * data.articles.length);
            article = data.articles[result];
        },
        error: function () {
            key = "e3fbe2a60f9d49f9b99072a164a33e71";
            api_call =
                "https://api.newsapi.com/v1/news/all HTTP/2/api-token=" +
                key +
                "&categories=" +
                category;

            $.ajax({
                type: "GET",
                dataType: "json",
                url: api_call,
                async: false,
                success: function (data) {
                    result = Math.floor(Math.random() * data.data.length);
                    article = data.data[result];
                }
            });
        }
    });

    return article;
}



function displayArticle(article, category) {
    // Extract data from the article object
    var title = article.title;
    var link = article.url;
    var img = article.urlToImage;
    var desc = article.description;

    // Build HTML for the article
    img = "<img src='" + img + "' onerror=\"this.src='newspaper.png';\"/>";
    title = "<span class='title'><a href='" + link + "'>" + title + "</a></span>";
    desc = "<span class='desc'>" + desc + "</span>";

    // Display the article in the DOM
    if ($("#" + category).length) {
        $("#" + category).html(
            "<div class='big-article'>" +
            img +
            "<div class='text'><span class='top'>" + title + "</span>" + desc + "</div></div>"
        );
    } else {
        $("#articles").append(
            "<div id='" +
            category +
            "' class='news'>" +
            img +
            "<div class='text'><span class='top'>" + title + "</span>" + desc + "</div></div>"
        );
    }
}

// Function to toggle between light and dark mode
function toggleMode() {
    document.body.classList.toggle('dark-mode');
    updateButtonText();
}

// Function to update the text of the mode toggle button
function updateButtonText() {
    var modeToggle = document.getElementById('modeToggle');
    var currentMode = document.body.classList.contains('dark-mode') ? 'Dark Mode' : 'Light Mode';
    modeToggle.textContent = (currentMode === 'Dark Mode' ? 'Light Mode' : 'Dark Mode');
}


