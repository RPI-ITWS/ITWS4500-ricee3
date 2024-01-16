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
    var key = "6218fdfcabf142998e26775aa79ca7b7";
    var api_call =
        "https://newsapi.org/v2/everything?q=" +
        category +
        "&apiKey=" +
        key;

    var article = fetchData(api_call);

    if (!article) {
        key = "ClWgHs8tPfnVTp57qn7ew03GvroGwUHzZrQSbYiZ";
        api_call =
            "https://api.thenewsapi.com/v1/news/all HTTP/2/api-token=" +
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
            key = "ClWgHs8tPfnVTp57qn7ew03GvroGwUHzZrQSbYiZ";
            api_call =
                "https://api.thenewsapi.com/v1/news/all HTTP/2/api-token=" +
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


// Function to fetch live updates
function fetchLiveUpdates() {
  // Use AJAX or Fetch API to get live updates
  // Update the ticker with the retrieved data
  // Example:
  var liveUpdates = ["Breaking News: [Your Update 1]", "Important Update: [Your Update 2]"];
  updateTicker(liveUpdates);
}

// Function to update the ticker with live updates
function updateTicker(updates) {
  var ticker = document.getElementById("ticker");
  ticker.innerHTML = ""; // Clear existing updates

  updates.forEach(function (update) {
      var li = document.createElement("li");
      li.textContent = update;
      ticker.appendChild(li);
  });
}

// Call fetchLiveUpdates on page load or at regular intervals
fetchLiveUpdates();
setInterval(fetchLiveUpdates, 60000); // Update every 1 minute (adjust as needed)
