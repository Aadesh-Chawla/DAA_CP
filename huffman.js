document.getElementById('huffmanForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const sentence = document.getElementById('sentence').value.replace(/\s+/g, '');
    if (sentence.length === 0) {
        alert('Please enter a non-empty sentence.');
        return;
    }
    const frequency = calculateFrequency(sentence);
    const huffmanTree = buildHuffmanTree(frequency);
    const huffmanCodes = generateCodes(huffmanTree);
    const encodedString = encodeString(sentence, huffmanCodes);
    displayResults(sentence, frequency, huffmanCodes, encodedString);
});

function calculateFrequency(str) {
    const frequency = {};
    for (let char of str) {
        if (!frequency[char]) {
            frequency[char] = 0;
        }
        frequency[char]++;
    }
    return frequency;
}

function buildHuffmanTree(frequency) {
    const nodes = Object.entries(frequency).map(([char, freq]) => ({ char, freq }));
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        const newNode = { 
            char: null, 
            freq: left.freq + right.freq, 
            left, 
            right 
        };
        nodes.push(newNode);
    }
    return nodes[0];
}

function generateCodes(node, code = '', codes = {}) {
    if (node.char !== null) {
        codes[node.char] = code;
    } else {
        generateCodes(node.left, code + '0', codes);
        generateCodes(node.right, code + '1', codes);
    }
    return codes;
}

function encodeString(str, codes) {
    return str.split('').map(char => codes[char]).join('');
}

function displayResults(sentence, frequency, huffmanCodes, encodedString) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Results</h2>
        <p>Original Sentence: ${sentence}</p>
        <p>Encoded String: ${encodedString}</p>
        <h3>Character Frequencies</h3>
        <table>
            <tr><th>Character</th><th>Frequency</th><th>Huffman Code</th></tr>
            ${Object.entries(frequency).map(([char, freq]) => `
                <tr>
                    <td>${char}</td>
                    <td>${freq}</td>
                    <td>${huffmanCodes[char]}</td>
                </tr>`).join('')}
        </table>
        <h3>Compression Ratio</h3>
        <p>${calculateCompressionRatio(sentence, encodedString)}</p>
    `;
}

function calculateCompressionRatio(original, encoded) {
    const originalBits = original.length * 8; // 8 bits per character
    const encodedBits = encoded.length;
    return (encodedBits / originalBits).toFixed(2);
}
