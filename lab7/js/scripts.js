const blocksData = new Map();
const availableBlocks = new Set(['block1', 'block2', 'block3', 'block4', 'block5']);

const logAction = (action, blockId = 'none') => console.log(`Action: ${action}, Block: ${blockId}`);
const validateBlock = blockId => availableBlocks.has(blockId);
const onBlockCreated = (blockId, params) => console.log(`Блок ${blockId} создан/обновлен:`, params);
const onError = message => { console.error(message); alert(message); };

const createBlockManager = () => {
    let currentBlockId = null;
    
    const updateBlockUI = function(block, params) {
        const [width, height] = params.size.split('x');
        block.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            left: ${params.x}px;
            top: ${params.y}px;
        `;
        block.innerHTML = `<img src="${params.image}" alt="Блок ${block.id}"><p>${params.text}</p>`;
    };
    
    return {
        setCurrentBlock: function(blockId) {
            if (!validateBlock(blockId)) return false;
            currentBlockId = blockId;
            logAction('setCurrentBlock', blockId);
            return true;
        },
        
        updateBlock: function(params, callback, errorCallback) {
            if (!currentBlockId) {
                errorCallback('Сначала выберите тип блока!');
                return false;
            }
            
            logAction('updateBlock', currentBlockId);
            blocksData.set(currentBlockId, params);
            
            let block = document.getElementById(currentBlockId) || (function() {
                const newBlock = document.createElement('div');
                newBlock.id = currentBlockId;
                newBlock.className = 'dynamic-block';
                document.getElementById('blockContainer').appendChild(newBlock);
                return newBlock;
            }).call(this);
            
            updateBlockUI.call(this, block, params);
            callback(currentBlockId, params);
            return true;
        },
        
        clearAllBlocks: function() {
            document.getElementById('blockContainer').innerHTML = '';
            blocksData.clear();
            currentBlockId = null;
            console.log('Все блоки очищены');
        }
    };
};

const blockManager = createBlockManager();

document.getElementById('createBtn').addEventListener('click', function() {
    const getValue = id => document.getElementById(id).value;
    const params = {
        size: getValue('blockSize'),
        image: getValue('blockImage'),
        text: getValue('blockText'),
        x: getValue('blockX'),
        y: getValue('blockY')
    };
    
    const updateHandler = blockManager.updateBlock.bind(blockManager, params, onBlockCreated.bind(null, getValue('blockType')),onError);
    
    if (blockManager.setCurrentBlock(getValue('blockType'))) {
        updateHandler();
    } else {
        onError('Неверный тип блока!');
    }
});

document.getElementById('clearBtn').addEventListener('click', () => {
    blockManager.clearAllBlocks();
});