const cm = CodeMirror.fromTextArea(document.getElementById('editor'), {
  theme: '3024-night',
  lineNumbers: true,
});

function setCmSize() {
  cm.setSize(window.innerWidth, window.innerHeight / 2);
}

setCmSize();

window.onresize = function () {
  setCmSize();
};

cm.on('change', () => {
  if (typeof key === 'string') {
    fetch('/delete', {
      method: 'DELETE',
      body: key,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  fetch('/upload', {
    method: 'POST',
    body: cm.getValue(),
    headers: {
      'Content-Type': 'text/plain',
    },
  }).then(async (response) => {
    window.key = await response.text();
    document.getElementById('generator').src =
      'https://orteil.dashnet.org/randomgen/?gen=' +
      location.origin +
      '/valueFromKey/' +
      key +
      '.txt';
  });
});

window.onbeforeunload = function () {
  fetch('/delete', {
    method: 'DELETE',
    body: key,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
