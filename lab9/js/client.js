function showNames(apiUrl, elementId) {
    fetch(apiUrl).then(res => res.json()).then(names => {
        const container = document.getElementById(elementId);
        container.innerHTML = '';
        names.forEach(name => {
          const div = document.createElement('div');
          div.className = 'name-item';
          div.textContent = name;
          container.appendChild(div);
        });
      });
}

if (document.getElementById('originalNames')) {
  showNames('/api/names', 'originalNames');
  document.getElementById('processBtn').onclick = function() {
    window.location.href = '/result';
  };
}
  
if (document.getElementById('processedNames')) {
  showNames('/api/process', 'processedNames');
  document.getElementById('backBtn').onclick = function() {
    window.location.href = '/';
  };
}