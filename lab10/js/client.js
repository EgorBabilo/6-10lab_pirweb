document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('names-form');
    
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const namesText = document.getElementById('names-input').value;
            
            fetch('/process', {
                method: 'POST',
                body: namesText
            })
            .then(response => response.text())
            .then(() => window.location.href = 'results.html')
            .catch(err => console.error(err));
        });
    } 

    if (document.getElementById('processed-names')) {
        fetch('/resource/processed_names.txt')
            .then(response => response.text())
            .then(text => {
                const processedList = document.getElementById('processed-names');
                text.split('\n').forEach(name => {
                    if (name.trim()) {
                        const li = document.createElement('li');
                        li.textContent = name;
                        processedList.appendChild(li);
                    }
                });
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }
});

document.getElementById('back-btn').onclick = function() {
    window.location.href = '/';
  };