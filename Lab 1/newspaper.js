var categories = ["sports", "food", "movies", "business", "technology"];
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
    var key = "WoGrTRBnXcBYRAkYFu7ShnqwdGAv53mh"; 
    var api_call =
        "https://api.nytimes.com/svc/topstories/v2/" + category + ".json?api-key=" + key;

    var article = fetchData(api_call);

    if (!article) {
        // Handle the case when the first API call fails
        console.log("Failed to fetch data for category: " + category);
        return;
    }

    displayArticle(article, category);
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
            result = Math.floor(Math.random() * data.results.length);
            article = data.results[result];
        },
        error: function () {
            console.log("Failed to fetch data from API: " + api_call);
        }
    });

    return article;
}

function displayArticle(article, category) {
    // Extract data from the article object
    var title = article.title;
    var link = article.url;
    var img = article.multimedia && article.multimedia.length > 0 ? article.multimedia[0].url : 'newspaper.png'; // Use a default image if not available
    var desc = article.abstract;

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
