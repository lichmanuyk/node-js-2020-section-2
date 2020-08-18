import express from 'express';
import { v4 as uuid } from 'uuid';

const app = express();
const router = express.Router();
const port = 8080;

type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
};
const users: User[] = [];

function getAutoSuggestUsers(loginSubstring: string, limit: number): User[] {
  const userItems = users
    .filter((user) => user.login.includes(loginSubstring))
    .sort((a, b) => a.login > b.login ? -1 : 1)
    .slice(limit - 1);

  return userItems;
}

app.use(express.json());

// Get autoSuggestion
router.get('/users', (req, res) => {
  const userItems = getAutoSuggestUsers('et', 5);

  if (!userItems) {
    res.status(404);
    return res.send('There is no user with such id or it was deleted');
  }

  res.send(userItems);
});

// Get by id
router.get('/user/:id', (req, res) => {
  const userItems = users.find(
    (user) => user.id === req.params.id && !user.isDeleted
  );

  if (!userItems) {
    res.status(404);
    return res.send('There is no user with such id or it was deleted');
  }

  res.send(userItems);
});

// Create
router.post('/user', (req, res) => {
  const id = uuid();
  users.push({
    login: req.body.login,
    password: req.body.password,
    age: req.body.age,
    isDeleted: false,
    id,
  });
  res.send(id);
});

// Update
router.post('/user/:id', (req, res) => {
  const userIndex = users.findIndex(
    (user) => user.id === req.params.id && !user.isDeleted
  );

  if (userIndex === -1) {
    res.status(404);
    return res.send('There is no user with such id or it was deleted');
  }

  users[userIndex] = {
    ...users[userIndex],
    login: req.body.login,
    password: req.body.password,
    age: req.body.age,
  };
  res.send(users[userIndex]);
});

// Delete
router.delete('/user/:id', (req, res) => {
  const userIndex = users.findIndex((user) => user.id === req.params.id);

  if (userIndex === -1) {
    res.status(404);
    return res.send('No user with such id');
  }

  users[userIndex].isDeleted = true;
  res.sendStatus(200);
});

app.use('/', router);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
