async function fetchBoredActivity(type, participants) {
    try {
      let apiUrl = `/api/activity`;
      // Include type and optional participants in the query string
      if (type) {
        apiUrl += `?type=${type}`;
        if (participants) {
          apiUrl += `&participants=${participants}`;
        }
      }
  
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      // Handle the fetched data, update UI, etc.
      console.log('Fetched Activity:', data);
    } catch (error) {
      console.error('Error fetching activity:', error);
      // Handle error, display message to the user, etc.
    }
  }
  
 