import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './components/Menu';
import Articles from './components/Articles';
import AddArticleForm from './components/AddArticleForm';
import UpdateArticleForm from './components/UpdateArticleForm';
import DeleteArticleByIdForm from './components/DeleteArticleByIdForm';
import AddArticleByKeywordForm from './components/AddArticleByKeywordForm';
import UpdateArticleByKeywordForm from './components/UpdateArticleByKeywordForm';
import DeleteArticleByKeywordForm from './components/DeleteArticleByKeywordForm';
import DeleteArticleByCategoryForm from './components/DeleteArticleByCategoryForm';
import WeatherForm from './components/WeatherForm';
import projectData from './data/project.json';

function DatabaseManager() {
  const [number, setNumber] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');

  const handleNumberChange = (e) => {
    setNumber(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  const makeApiCall = async (method) => {
    const endpoint = number ? `http://localhost:4000/db/${number}` : 'http://localhost:4000/db';
    const config = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      data: method === 'POST' || method === 'PUT' ? JSON.parse(body) : {}
    };
  
    try {
      const response = await axios(endpoint, config);
  
      if (response.status === 200 || response.status === 201) {
        const successMessage = {
          'GET': 'Data fetched successfully.',
          'POST': 'Data added successfully.',
          'PUT': 'Data updated successfully.',
          'DELETE': 'Data deleted successfully.',
        }[method];
  
        const responseData = response.data ? JSON.stringify(response.data, null, 2) : 'No content';
        setResponse(`${successMessage}\n\nResponse:\n${responseData}`);
      } else {
        setResponse(`Received unexpected status code: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || JSON.stringify(error.response.data, null, 2);
        setResponse(`Error: ${error.response.status} - ${errorMessage}`);
      } else if (error.request) {
        setResponse("The request was made but no response was received.");
      } else {
        setResponse(`Error setting up request: ${error.message}`);
      }
    }
  };  

  return (
    <div className="database-manager">
      <br></br><h4>NewsAPI Articles</h4>
      <input
        type="text"
        placeholder="Enter number (for /db/:number) or leave empty (for /db)"
        value={number}
        onChange={handleNumberChange}
        style={{ width: '30%'}}
      />
      <br></br>
      <textarea
        placeholder="Enter JSON body for POST/PUT"
        value={body}
        onChange={handleBodyChange}
        style={{ width: '100%', height: '200px' }}
      />
      <div>
        <button onClick={() => makeApiCall('GET')}>GET</button>
        <button onClick={() => makeApiCall('POST')}>POST</button>
        <button onClick={() => makeApiCall('PUT')}>PUT</button>
        <button onClick={() => makeApiCall('DELETE')}>DELETE</button>
      </div>
      <pre>{response}</pre>
    </div>
  );
}

function ArticleAnalytics() {
  const [articleNumber1, setArticleNumber1] = useState('');
  const [articleNumber2, setArticleNumber2] = useState('');
  const [analyticsResult, setAnalyticsResult] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/db/analytics/${articleNumber1}/${articleNumber2}`);
      setAnalyticsResult(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsResult(null);
    }
  };

  return (
    <div className="article-analytics">
      <h4>Article Analytics</h4>
      <input
        type="text"
        placeholder="Enter first article number"
        value={articleNumber1}
        onChange={(e) => setArticleNumber1(e.target.value)}
        style={{ width: '15%'}}
      />
      <input
        type="text"
        placeholder="Enter second article number"
        value={articleNumber2}
        onChange={(e) => setArticleNumber2(e.target.value)}
        style={{ width: '15%'}}
      />
      <button onClick={fetchAnalytics}>Compare</button>
      {analyticsResult && (
        <div>
          <h5>Comparison Results:</h5>
          <pre>{JSON.stringify(analyticsResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const App = () => {
  const [category, setCategory] = useState('all');
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const filteredArticles = projectData.filter(article => 
      category === 'all' || (article.Category && article.Category.toLowerCase() === category.toLowerCase())
    );
    setArticles(filteredArticles);
  }, [category]);

  const onAddArticle = async (articleData) => {
    try {
      await axios.post('http://localhost:4000/news', articleData);
      alert('Article added successfully');
    } catch (error) {
      console.error('Failed to add article:', error);
      alert('Failed to add the article. Please check the console for more information.');
    }
  };

  const onUpdateArticle = async (articleData) => {
    const { id, ...updatedData } = articleData;
    try {
      await axios.put(`http://localhost:4000/news/${id}`, updatedData);
      alert('Article updated successfully');
    } catch (error) {
      console.error('Failed to update article:', error);
      alert('Failed to update the article. Please check the console for more information.');
    }
  };

  const onDeleteById = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/news/${id}`);
      alert('Article deleted successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete the article. Please check the console for more information.');
    }
  };

  const onAddByKeyword = async (keyword, index) => {
    try {
      const response = await axios.post(`http://localhost:4000/news/add/${keyword}/${index}`);
      alert('Article added successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Failed to add article:', error);
      alert('Failed to add the article. Please check the console for more information.');
    }
  };

  const onUpdateByKeyword = async (keyword, localIndex, apiIndex) => {
    try {
      const response = await axios.put(`http://localhost:4000/news/update/${localIndex}/${apiIndex}/${keyword}`);
      alert('Articles updated successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Failed to update articles:', error);
      alert('Failed to update the articles. Please check the console for more information.');
    }
  };

  const onDeleteByKeyword = async (keyword) => {
    try {
      const response = await axios.delete(`http://localhost:4000/news/deleteByKeyword/${keyword}`);
      alert('Articles deleted successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Failed to delete articles:', error);
      alert('Failed to delete the articles. Please check the console for more information.');
    }
  };

  const onDeleteByCategory = async (category) => {
    try {
      const response = await axios.delete(`http://localhost:4000/news/deleteByCategory/${category}`);
      alert('Articles deleted successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Failed to delete articles:', error);
      alert('Failed to delete the articles. Please check the console for more information.');
    }
  };

  return (
    <div id="news-ticker" className="container-fluid">
      <Menu onCategoryChange={setCategory} />
      <Articles articles={articles} currentCategory={category} />
      <div className="article-management-forms">
        <AddArticleForm onAdd={onAddArticle} />        
        <UpdateArticleForm onUpdate={onUpdateArticle} />
        <DeleteArticleByIdForm onDeleteById={onDeleteById} />
        <AddArticleByKeywordForm onAddByKeyword={onAddByKeyword} />
        <UpdateArticleByKeywordForm onUpdateByKeyword={onUpdateByKeyword} />
        <DeleteArticleByKeywordForm onDeleteByKeyword={onDeleteByKeyword} />
        <DeleteArticleByCategoryForm onDeleteByCategory={onDeleteByCategory} />
        <WeatherForm />
        <DatabaseManager />
        <ArticleAnalytics />
      </div>
    </div>
  );
};

export default App;
