Angular + D3
============
Follow me if you want to try reproducing this project from scratch.

Steps
-----
1. npm init -y
2. npm install express --save
3. ng new d3
4. cd d3
5. npm install d3 --save
6. npm install @types/d3 --save
(Yes, this means we are installing new node modules into Angular!)
7. ng g component bar
8. ng g component pie
9. ng g component scatter
10. Add all components to src/app/app.component.html
11. Add some nice global CSS to src/index.html (see lines 9 and 10)
12. Create a basic Node server.js file to serve the files Angular will build
13. Edit src/app/bar/bar.component.html
14. Add data+logic to bar.component.ts
15. Repeat steps 13+14 for pie
16. Repeat steps 13+14 for scatter
17. ng build
18. npm start
19. See the visualization!

But what if...
--------------
What if we could just get data from a REST API endpoint instead of hardcoding?
Check the bar component again to see one way to do that.

Credits
-------
https://blog.logrocket.com/data-visualization-angular-d3/
