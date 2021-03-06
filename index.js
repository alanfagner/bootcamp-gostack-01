const express = require('express');

const server = express();

server.use(express.json());

const users = ['Alan', 'Fagner', 'Goncalves']

server.use((req, res, next) => {
  console.time('Request');
  console.log(`método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd('Request');
})

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({error: 'User name is required' });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const { index } = req.params;
  const user = users[index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }
  req.user = user;
  return next();
}

server.get('/users/:index', checkUserInArray, (req, res) => {
  const { user } = req;
  return res.json(user);
});

server.get('/users', (req, res) => {
  return res.json(users);
})

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
})

server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
})

server.delete('/users/:index', checkUserExists, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
})

server.listen(3000);