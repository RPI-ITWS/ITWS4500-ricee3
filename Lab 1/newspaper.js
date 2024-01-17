var categories = ["politics", "science", "sports", "food", "business"];
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
    var key = "e3fbe2a60f9d49f9b99072a164a33e71"; // Replace with your actual API key
    var api_call =
        "https://newsapi.org/v2/everything?q=" +
        category +
        "&apiKey=" +
        key;

    fetchData(api_call, category);
}

function fetchData(api_call, category) {
    var result = 0;
    var article;

    $.ajax({
        type: "GET",
        dataType: "jsonp", // Use JSONP for cross-origin requests
        url: api_call,
        success: function (data) {
            result = Math.floor(Math.random() * data.articles.length);
            article = data.articles[result];
            displayArticle(article, category);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
        }
    });
}

function displayArticle(article, category) {
    var title = article.title;
    var link = article.url;
    var img = article.urlToImage;
    var desc = article.description;

    img = "<img src='" + img + "' onerror=\"this.src='newspaper.png';\"/>";
    title = "<span class='title'><a href='" + link + "'>" + title + "</a></span>";
    desc = "<span class='desc'>" + desc + "</span>";

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


