function Car() {
    this.carModels = new Map([
        [1, "Camry"],
        [2, "Yaris"],
        [3, "Supra"]
    ]);
    
    this.manufacturers = new Set(["Toyota"]);
    this.descriptions = new Set([
        "Комфортный седан",
        "Надежный автомобиль",
        "Премиальный кроссовер"
    ]);
    
    this.container = document.getElementById('car');
    this.createCarBlock();
}

Car.prototype.createCarBlock = function() {
    const block = document.createElement('div');
    block.className = 'car-block';
    
    const manufacturer = this.manufacturers.values().next().value;
    this.createHeader(block, manufacturer);
    
    this.createCarList(block);
    
    const descArray = Array.from(this.descriptions);
    this.createParagraph(block, descArray[0], 'first-paragraph');
    this.createParagraph(block, descArray[1], 'second-paragraph');
    
    this.container.appendChild(block);
};

Car.prototype.createHeader = function(container, text) {
    const header = document.createElement('h1');
    header.textContent = text;
    container.appendChild(header);
    return header;
};

Car.prototype.createCarList = function(container) {
    const ol = document.createElement('ol');
    
    this.carModels.forEach((model, key) => {
        const li = document.createElement('li');
        li.textContent = model;
        ol.appendChild(li);
    });
    
    container.appendChild(ol);
    return ol;
};

Car.prototype.createParagraph = function(container, text, className = '') {
    const p = document.createElement('p');
    p.textContent = text;
    if (className) p.className = className;
    container.appendChild(p);
    return p;
};

function CarFunc() {
    Car.call(this);
    this.createControls();
    this.updatePositionSelect();
}

CarFunc.prototype = Object.create(Car.prototype);
CarFunc.prototype.constructor = CarFunc;

const o = {a: 10, b: 5};

CarFunc.prototype.createControls = function() {
    const controls = document.createElement('div');
    controls.className = 'controls';
 
    const addCarGroup = document.createElement('div');
    addCarGroup.className = 'control-group';
    
    const newCarInput = document.createElement('input');
    newCarInput.type = 'text';
    newCarInput.id = 'newCar';
    newCarInput.placeholder = 'Новая модель';

    this.positionSelect = document.createElement('select');
    this.positionSelect.id = 'carPosition';
    
    const addCarBtn = document.createElement('button');
    addCarBtn.textContent = 'Добавить автомобиль';
    addCarBtn.addEventListener('click', () => this.addNewCar());
    
    addCarGroup.appendChild(newCarInput);
    addCarGroup.appendChild(this.positionSelect);
    addCarGroup.appendChild(addCarBtn);

    const changeHeaderGroup = document.createElement('div');
    changeHeaderGroup.className = 'control-group';
    
    const newHeaderInput = document.createElement('input');
    newHeaderInput.type = 'text';
    newHeaderInput.id = 'newHeader';
    newHeaderInput.placeholder = 'Новый производитель';
    
    const changeHeaderBtn = document.createElement('button');
    changeHeaderBtn.textContent = 'Изменить заголовок';
    changeHeaderBtn.addEventListener('click', () => this.changeHeader());
    
    changeHeaderGroup.appendChild(newHeaderInput);
    changeHeaderGroup.appendChild(changeHeaderBtn);
    
    const addParagraphGroup = document.createElement('div');
    addParagraphGroup.className = 'control-group';
    
    const newParagraphInput = document.createElement('input');
    newParagraphInput.type = 'text';
    newParagraphInput.id = 'newParagraph';
    newParagraphInput.placeholder = 'Новое описание';

    const paragraphPositionSelect = document.createElement('select');
    paragraphPositionSelect.id = 'paragraphPosition';

    const paragraphPositions = [
        {value: 'before', text: 'Перед существующими'},
        {value: 'after', text: 'После существующих'}
    ];
    
    paragraphPositions.forEach(pos => {
        const option = document.createElement('option');
        option.value = pos.value;
        option.textContent = pos.text;
        paragraphPositionSelect.appendChild(option);
    });
    
    const addParagraphBtn = document.createElement('button');
    addParagraphBtn.textContent = 'Добавить описание';
    addParagraphBtn.addEventListener('click', () => this.addNewParagraph());
    
    addParagraphGroup.appendChild(newParagraphInput);
    addParagraphGroup.appendChild(paragraphPositionSelect);
    addParagraphGroup.appendChild(addParagraphBtn);
    
    controls.appendChild(addCarGroup);
    controls.appendChild(changeHeaderGroup);
    controls.appendChild(addParagraphGroup);
    
    this.container.appendChild(controls);
};

CarFunc.prototype.updatePositionSelect = function() {
    this.positionSelect.innerHTML = '';
    
    for (let i = 1; i <= this.carModels.size + 1; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i === this.carModels.size + 1 ? 'В конец списка' : `На позицию ${i}`;
        this.positionSelect.appendChild(option);
    }
};

CarFunc.prototype.addNewCar = function() {
    const newCarInput = document.getElementById('newCar');
    const position = parseInt(this.positionSelect.value) || this.carModels.size + 1;
    const newCar = newCarInput.value.trim();
    
    if (newCar) {
        const newModels = new Map();
        let inserted = false;
        
        const targetPos = Math.min(position, this.carModels.size + 1);
        
        this.carModels.forEach((value, key) => {
            if (!inserted && newModels.size + 1 === targetPos) {
                newModels.set(newModels.size + 1, newCar);
                inserted = true;
            }
            newModels.set(newModels.size + 1, value);
        });
        
        if (!inserted) {
            newModels.set(newModels.size + 1, newCar);
        }
        
        this.carModels = newModels;
        this.updateCarList();
        this.updatePositionSelect();
        
        newCarInput.value = '';
    }
};

CarFunc.prototype.updateCarList = function() {
    const ol = document.querySelector('.car-block ol');
    ol.innerHTML = '';
    
    this.carModels.forEach((model, key) => {
        const li = document.createElement('li');
        li.textContent = model;
        ol.appendChild(li);
    });
};

CarFunc.prototype.changeHeader = function() {
    const newHeaderInput = document.getElementById('newHeader');
    const newHeader = newHeaderInput.value.trim();
    
    if (newHeader) {
        const header = document.querySelector('.car-block h1');
        header.textContent = newHeader;
        this.manufacturers.add(newHeader);
        newHeaderInput.value = '';
    }
};

CarFunc.prototype.addNewParagraph = function() {
    const newParagraphInput = document.getElementById('newParagraph');
    const positionSelect = document.getElementById('paragraphPosition');
    const newParagraph = newParagraphInput.value.trim();
    const position = positionSelect.value;
    
    if (newParagraph) {
        this.descriptions.add(newParagraph);
        const p = document.createElement('p');
        p.textContent = newParagraph;
        
        const carBlock = document.querySelector('.car-block');
        const existingParagraphs = carBlock.querySelectorAll('p');
        
        if (position === 'before') {
            if (existingParagraphs.length > 0) {
                carBlock.insertBefore(p, existingParagraphs[0]);
            } else {
                carBlock.appendChild(p);
            }
        } else {
            carBlock.appendChild(p);
        }
        
        newParagraphInput.value = '';
    }
};

document.addEventListener('DOMContentLoaded', function() {
    new CarFunc();
});