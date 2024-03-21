document.addEventListener('DOMContentLoaded', function() {
    setupMenuButtons();
    changeCategory('all');
    cycleArticles();
});

function setupMenuButtons() {
    const categories = ['all', 'health', 'finance', 'food', 'sports', 'tech'];
    const menu = document.getElementById('category-buttons');
    categories.forEach(cat => {
        let button = document.createElement('div');
        button.className = `button ${cat}`;
        button.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        button.addEventListener('click', () => changeCategory(cat));
        menu.appendChild(button);
    });
    menu.children[0].classList.add('active');
}

function fetchArticles(category) {
    fetch(`/news`)
        .then(response => response.json())
        .then(articleNumbers => {
            const fetches = articleNumbers.map(number => fetch(`/news/${number}`).then(resp => resp.json()));
            return Promise.all(fetches);
        })
        .then(articles => {
            displayArticles(articles, category);
        })
        .catch(error => console.error('Error fetching articles:', error));
}

function displayArticles(data, category) {
    const container = document.getElementById('articles-container');
    container.innerHTML = '';
    const filteredData = data.filter(article => category === 'all' || article.Category.toLowerCase() === category);
    filteredData.forEach(article => appendArticle(article, container));
}

function appendArticle(article, container) {
    let articleDiv = document.createElement('div');
    articleDiv.className = `article ${article.Category.toLowerCase()}`;
    articleDiv.innerHTML = `
        <h3>${article.Title}</h3>
        <p><small>Published on: ${article.Date}</small></p>
        <p>${article.Description}</p>
        <a href="${article.Link}" target="_blank">View</a>`;
    container.appendChild(articleDiv);
}

function changeCategory(category) {
    let buttons = document.querySelectorAll('#category-buttons .button');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#category-buttons .${category}`).classList.add('active');
    fetchArticles(category);
}

function cycleArticles() {
    let container = document.getElementById('articles-container');
    let refreshRate = 4000;
    function moveFirstToLast() {
        let firstArticle = container.children[0];
        container.appendChild(firstArticle);
    }
    setInterval(moveFirstToLast, refreshRate);
}

function addArticle() {
    const title = document.getElementById('article-title').value;
    const link = document.getElementById('article-link').value;
    const description = document.getElementById('article-description').value;
    const date = document.getElementById('article-date').value;
    const category = document.getElementById('article-category').value;

    fetch('/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: title, Link: link, Description: description, Date: date, Category: category })
    }).then(response => response.json())
      .then(data => alert('Article added successfully'))
      .catch(error => console.error('Error:', error));
}

function updateArticles() {
    const articles = document.getElementById('update-articles').value;

    fetch('/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: articles
    }).then(response => response.json())
      .then(data => alert('Articles updated successfully'))
      .catch(error => console.error('Error:', error));
}

function updateArticleById() {
    const articleId = document.getElementById('update-article-id').value;
    const title = document.getElementById('update-article-title').value;
    const link = document.getElementById('update-article-link').value;
    const description = document.getElementById('update-article-description').value;
    const date = document.getElementById('update-article-date').value;
    const category = document.getElementById('update-article-category').value;

    const updatedArticle = {
        Title: title,
        Link: link,
        Description: description,
        Date: date,
        Category: category
    };

    fetch(`/news/${articleId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedArticle)
    })
    .then(response => response.json())
    .then(data => {
        alert('Article updated successfully');
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating article.');
    });
}

function deleteArticleById() {
    const articleId = document.getElementById('delete-article-id').value;

    fetch(`/news/${articleId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert('Article deleted successfully');
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error deleting article.');
    });
}

function addArticleByKeyword() {
    const keyword = document.getElementById('keyword').value;
    const index = document.getElementById('index').value;

    fetch(`/news/add/${keyword}/${index}`, {
        method: 'POST'
    }).then(response => response.json())
      .then(data => alert(JSON.stringify(data)))
      .catch(error => console.error('Error:', error));
}

function updateArticleByKeyword() {
    const localIndex = document.getElementById('local-index').value;
    const apiIndex = document.getElementById('api-index').value;
    const keyword = document.getElementById('update-keyword').value;

    fetch(`/news/update/${localIndex}/${apiIndex}/${keyword}`, {
        method: 'PUT'
    }).then(response => response.json())
      .then(data => alert(JSON.stringify(data)))
      .catch(error => console.error('Error:', error));
}

function deleteArticleByKeyword() {
    const keyword = document.getElementById('delete-keyword').value;

    fetch(`/news/deleteByKeyword/${keyword}`, {
        method: 'DELETE'
    }).then(response => response.json())
      .then(data => alert(JSON.stringify(data)))
      .catch(error => console.error('Error:', error));
}

function deleteArticleByCategory() {
    const category = document.getElementById('delete-category').value;

    fetch(`/news/deleteByCategory/${category}`, {
        method: 'DELETE'
    }).then(response => response.json())
      .then(data => alert(JSON.stringify(data)))
      .catch(error => console.error('Error:', error));
}