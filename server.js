const express = require('express');
const app = express();
const fs = require('fs');
const uuid = require('uuid');

generatorUploads = [];

function ensureNoDuplicates() {
  value = uuid.v4();
  while (generatorUploads.find((upload) => upload.key === value)) {
    value = uuid.v4();
  }
  return value;
}

app.use(express.text());

app.get('/valueFromKey/*', (req, res) => {
  res.header({
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
  });
  try {
    res.send(
      generatorUploads.find(
        (upload) => upload.key === req.path.split('&')[0].slice(14, -4)
      ).value
    );
  } catch {
    res.status(404);
  }
});

app.get('/*', (req, res) => {
  if (req.path !== '/' && !fs.existsSync(req.path.substring(1))) {
    return res.status(204);
  }

  if (req.path === '/') {
    res.sendFile('index.html', { root: './' });
  } else if (req.path === '/index.html') {
    res.redirect('/');
  } else {
    res.sendFile(req.path.substring(1), { root: './' });
  }
});

app.post('/upload', (req, res) => {
  let key = ensureNoDuplicates();
  generatorUploads.push({
    value: req.body,
    key,
    ip: req.ip,
  });
  res.send(key);
});

app.delete('/delete', (req, res) => {
  generatorUploads = generatorUploads.filter(
    (upload) => upload.key === req.body
  );
  res.status(200);
});

app.listen(process.env.PORT || 1579);
