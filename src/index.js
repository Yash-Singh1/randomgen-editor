import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple.js';
import 'codemirror/addon/mode/overlay.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror-mode-randomgen';
import './index.css';

window.onload = () => {
  const cm = CodeMirror.fromTextArea(document.getElementById('editor'), {
    theme: 'midnight',
    lineNumbers: true,
    mode: 'randomgen'
  });

  if (localStorage.getItem('code')) {
    cm.setValue(localStorage.getItem('code'));
  }

  function setCmSize() {
    cm.setSize(window.innerWidth, window.innerHeight * 0.485);
  }

  setCmSize();

  window.onresize = function () {
    setCmSize();
  };

  cm.on('change', () => {
    localStorage.setItem('code', cm.getValue());
  });

  document.getElementById('run').onclick = () => {
    fetch('/upload', {
      method: 'POST',
      body: cm.getValue(),
      headers: {
        'Content-Type': 'text/plain'
      }
    }).then(async (response) => {
      document.getElementById('generator').src =
        'https://orteil.dashnet.org/randomgen/?gen=' + location.origin + '/valueFromKey/' + (await response.text()) + '.txt';
    });
  };
};
