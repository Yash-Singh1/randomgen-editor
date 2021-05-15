const express = require('express');
const app = express();
const { join } = require('path');
const fs = require('fs');
const { v4 } = require('uuid');

generatorUploads = [];

app.use(express.text());

app.get('/valueFromKey/*', (req, res) => {
  res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*'
  });
  let key = req.path.split('&')[0].slice(14, -4);
  try {
    res.send(generatorUploads.find((upload) => upload.key === key).value);
    generatorUploads = generatorUploads.filter((upload) => upload.key !== key);
  } catch {
    res.status(404);
  }
});

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204);
});

app.get('/*', (req, res) => {
  if (req.path !== '/' && !fs.existsSync(join(req.path.startsWith('/node_modules/') ? '.' : 'dist', req.path.substring(1)))) {
    return res.status(404);
  }

  if (req.path === '/') {
    res.sendFile('./dist/index.html', { root: './' });
  } else if (req.path === '/index.html') {
    res.redirect('/');
  } else {
    res.sendFile(req.path.substring(1), { root: req.path.startsWith('/node_modules/') ? '.' : './dist/' });
  }
});

app.post('/upload', (req, res) => {
  let key = v4();
  generatorUploads.push({
    value: req.body,
    key
  });
  res.send(key);
});

const port = process.env.PORT || 1579;
app.listen(port);
