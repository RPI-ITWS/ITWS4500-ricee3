
'use strict'

//header HTML
const header = React.createElement('p', {style:{background: "lavenderblush"}}, 'Lab 5 - MongoDB Stuff!')
const head = ReactDOM.createRoot(document.getElementById('head'))
head.render(header)

//footer HTML
const footer = React.createElement('p', {style:{background: "lavender"}}, '')
const foot = ReactDOM.createRoot(document.getElementById('foot'))
foot.render(footer)

//get button
function getButton() {
  const [clicked, setClicked] = React.useState(false);

  if (clicked) {
    setClicked(false);
  }

  return React.createElement(
    'button',
    {
      onClick: () => setClicked(true),
    },
    'GET'
  );
}

const Node0 = document.getElementById('get-button');
const root0 = ReactDOM.createRoot(Node0);
root0.render(React.createElement(getButton));

//post button
function postButton() {
  const [clicked, setClicked] = React.useState(false);

  if (clicked) {
    setClicked(false);
  }

  return React.createElement(
    'button',
    {
      onClick: () => setClicked(true),
    },
    'POST'
  );
}

const Node1 = document.getElementById('post-button');
const root1 = ReactDOM.createRoot(Node1);
root1.render(React.createElement(postButton));

//put button
function putButton() {
  const [clicked, setClicked] = React.useState(false);

  if (clicked) {
    setClicked(false);
  }

  return React.createElement(
    'button',
    {
      onClick: () => setClicked(true),
    },
    'PUT'
  );
}

const Node2 = document.getElementById('put-button');
const root2 = ReactDOM.createRoot(Node2);
root2.render(React.createElement(putButton));

//delete button
function deleteButton() {
  const [clicked, setClicked] = React.useState(false);

  if (clicked) {
    setClicked(false);
  }

  return React.createElement(
    'button',
    {
      onClick: () => setClicked(true),
    },
    'DELETE'
  );
}

const Node3 = document.getElementById('delete-button');
const root3 = ReactDOM.createRoot(Node3);
root3.render(React.createElement(deleteButton));


