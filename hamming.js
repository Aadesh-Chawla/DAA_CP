// Define HammingCode class
class HammingCode {
    constructor(message) {
        this.message = message;
        this.encodedMessage = "";
    }

    encode() {
        // Hamming code encoding logic
        // For simplicity, we'll assume a fixed length message and use a basic Hamming(7,4) code

        // // Ensure the message length is a multiple of 4
        let paddedMessage = this.message.padEnd(Math.ceil(this.message.length / 4) * 4, '0');
        // let encodedMessage = "";

        // // Split the message into groups of 4 bits
        // for (let i = 0; i < paddedMessage.length; i += 4) {
        //     let group = paddedMessage.substr(i, 4);
        //     let parityBits = "";

        //     // Calculate parity bits
        //     parityBits += (parseInt(group[0]) ^ parseInt(group[1]) ^ parseInt(group[3])).toString();
        //     parityBits += (parseInt(group[0]) ^ parseInt(group[2]) ^ parseInt(group[3])).toString();
        //     parityBits += group[0];
        //     parityBits += (parseInt(group[1]) ^ parseInt(group[2]) ^ parseInt(group[3])).toString();

        //     // Add parity bits to the encoded message
        //     encodedMessage += parityBits + group;
        // }


        let encodedValue = btoa(paddedMessage);
        this.encodedMessage = encodedValue;
        // console.log(encodedMessage);

        // let myString = "Welcome to freeCodeCamp!";
       
        console.log("Encode : ",encodedValue); // Welcome to freeCodeCamp!
        let decodedValue = atob(encodedValue);
        console.log(decodedValue); // Welcome to freeCodeCamp!

        return encodedMessage;
    }

    decode(encodedMessage) {
        let decodedMessage = "";
        let i = 0;
        while (i < encodedMessage.length) {
            let group = encodedMessage.substr(i, 7);
            let errorBit = parseInt(group[6]); // Error bit position
    
            if (errorBit !== 0) {
                // Correct the error
                group = group.substr(0, errorBit - 1) + (parseInt(group[errorBit - 1]) ^ 1) + group.substr(errorBit);
            }
    
            decodedMessage += group[2] + group[4] + group[5] + group[6]; // Extract original bits
    
            i += 7;
        }
    
        return decodedMessage;
    }
    

}

// Mere changes 
function encodingChanges(inputString) {
    // Perform some processing on the input string
    let encodedValue = btoa(inputString);

    return encodedValue;
}

function decodingChanges(inputString) {
    // Perform some processing on the input string
    let decodedValue = atob(inputString);

    return decodedValue;
}

// ENd changes 



// Export HammingCode class for use in other files
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = HammingCode;
}


class Visualizer {
    constructor(w, h, ctx, distance) {
        this.points = [
            { x: 100, y: 100, id: 0, distance: Infinity, parent: null },
            { x: 200, y: 150, id: 1, distance: Infinity, parent: null },
            { x: 300, y: 200, id: 2, distance: Infinity, parent: null },
            { x: 400, y: 250, id: 3, distance: Infinity, parent: null },
            { x: 500, y: 300, id: 4, distance: Infinity, parent: null },
            { x: 600, y: 350, id: 5, distance: Infinity, parent: null },
            { x: 700, y: 400, id: 6, distance: Infinity, parent: null },
            { x: 800, y: 450, id: 7, distance: Infinity, parent: null },
            { x: 900, y: 500, id: 8, distance: Infinity, parent: null },
            { x: 100, y: 150, id: 9, distance: Infinity, parent: null },
            { x: 200, y: 250, id: 10, distance: Infinity, parent: null },
            { x: 300, y: 350, id: 11, distance: Infinity, parent: null },
            { x: 400, y: 450, id: 12, distance: Infinity, parent: null },
            { x: 500, y: 550, id: 13, distance: Infinity, parent: null },
            { x: 600, y: 150, id: 14, distance: Infinity, parent: null },
            { x: 700, y: 250, id: 15, distance: Infinity, parent: null },
            { x: 800, y: 350, id: 16, distance: Infinity, parent: null },
            { x: 900, y: 450, id: 17, distance: Infinity, parent: null },
            { x: 1000, y: 100, id: 18, distance: Infinity, parent: null },
            { x: 1100, y: 200, id: 19, distance: Infinity, parent: null }
        ];

        this.edges = {
            0: [1, 9],
            1: [0, 2, 10],
            2: [1, 3, 11],
            3: [2, 4, 12],
            4: [3, 5, 13],
            5: [4, 6, 14],
            6: [5, 7, 15],
            7: [6, 8, 16],
            8: [7, 17],
            9: [0, 10, 14],
            10: [1, 9, 11, 15],
            11: [2, 10, 12, 16],
            12: [3, 11, 13, 17],
            13: [4, 12, 18],
            14: [5, 9, 15, 19],
            15: [6, 10, 14, 16],
            16: [7, 11, 15, 17],
            17: [8, 12, 16, 18],
            18: [13, 17, 19],
            19: [14, 18]
        };

        this.int = 0;
        this.width = w;
        this.height = h;
        this.ctx = ctx;
        this.distance = distance;
    }

    drawPoints(startNode, endNode) {
        this.points.forEach((point, idx) => {
            let r = 4;
            this.ctx.fillStyle = 'green';
            if (idx === startNode) {
                r = 7;
                this.ctx.fillStyle = "blue";
            } else if (idx === endNode) {
                r = 7;
                this.ctx.fillStyle = 'red';
            }

            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, r, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#003300';
            this.ctx.stroke();

            // Print node number next to the node
            this.ctx.fillStyle = 'black';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(point.id, point.x, point.y - 10); // Adjust the position of the text
        });
    }


    drawEdges() {
        Object.keys(this.edges).forEach(
            node => {
                this.edges[node].forEach(node2 => {
                    this.drawPath(this.points[node], this.points[node2]);
                });
            }
        );
    }

    drawPath(pointA, pointB, color = 'lightgrey') {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(pointA.x, pointA.y);
        this.ctx.lineTo(pointB.x, pointB.y);
        this.ctx.stroke();
        if (color === 'black') {
            this.distance.innerText = "Total travel distance to last point: " + Math.floor(pointB.distance);
        }
    }

    clearCanvas() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    getDistance(A, B) {
        let a = this.points[A].x - this.points[B].x;
        let b = this.points[A].y - this.points[B].y;
        let dist = Math.sqrt(a * a + b * b);
        return dist;
    }

    sortEdges() {
        Object.keys(this.edges).forEach(node => {
            this.edges[node].sort((a, b) => this.getDistance(node, a) - this.getDistance(node, b));
            this.edges[node] = [...new Set(this.edges[node])];
        });
    }

    dijkstra(startNode, endNode, message) {
        if (this.points.length === 0) {
            this.ctx.font = '48px serif';
            this.ctx.fillText("Generate points first!", 10, 50);
            return;
        }

        this.points[startNode].distance = 0;
        let visited = new Set();
        let queue = [...this.points];
        let node;
        let lines = [];
        let solved = false;
        while (queue.length > 0) {
            let distances = queue.map(el => el.distance);
            let min = Math.min(...distances);
            let idx = distances.indexOf(min);
            let lastNode = node;
            node = queue[idx];

            if (node.parent !== null) {
                lines.push([this.points[node.parent], node, 'black'].slice());
            }

            queue.splice(idx, 1);
            visited.add(node);

            if (node.id === endNode) {
                if (node.distance !== Infinity) {
                    solved = true;
                }
                break;
            }

            this.edges[node.id].forEach(node2 => {
                if (visited[node2]) { return; }

                let newdist = node.distance + this.getDistance(node.id, node2);

                if (newdist < this.points[node2].distance) {
                    this.points[node2].distance = newdist;
                    this.points[node2].parent = node.id;
                }
            });
        }
        if (!solved) {
            this.ctx.font = '48px serif';
            this.ctx.fillText("No connection to target", 10, 50);
        } else {
            while (node.parent !== null) {
                lines.push([node, this.points[node.parent], 'red'].slice());
                node = this.points[node.parent];
            }
        }

        this.int = this.drawLinesSlowly(lines, message);

        // Update the encodedMessage textarea with the encoded message
        let encodedMessageTextarea = document.getElementById('encodedMessage');
        encodedMessageTextarea.value = message;

        return node.distance;
    }


    drawLinesSlowly(lines, message) {
        if (this.int) {
            clearInterval(this.int);
            this.clearCanvas();
            this.drawEdges();
            this.drawPoints();
        }

        if (lines.length === 0) {
            return;
        }

        const drawPath = this.drawPath.bind(this);

        let int = setInterval(handleThing, 800);
        let i = 0;

        function handleThing() {
            let next = lines[i];
            drawPath(...next);
            i += 1;
            if (i >= lines.length) {
                clearInterval(int);
                // alert("Message encoded with Hamming code: " + message);
            }
        }

        return int;
    }

    loadMap(imagePath) {
        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, this.width, this.height);
            this.drawPoints();
        };
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("canvas");
    const width = canvas.width;
    const height = canvas.height;
    let ctx = canvas.getContext("2d");

    let distance = document.getElementById('distance');
    let startNodeSelect = document.getElementById('startNode');
    let endNodeSelect = document.getElementById('endNode');
    let messageInput = document.getElementById('message');
    let encodeAndVisualizeBtn = document.getElementById('encodeAndVisualizeBtn');
    let decodeBtn = document.getElementById('decodeBtn');

    const vis = new Visualizer(width, height, ctx, distance);
    vis.loadMap('map.jpeg');

    encodeAndVisualizeBtn.addEventListener('click', () => {
        let startNode = parseInt(startNodeSelect.value);
        let endNode = parseInt(endNodeSelect.value);
        let message = messageInput.value;
        // console.log("Message Val : ",message);

        if (!isNaN(startNode) && !isNaN(endNode)) {
            // Encode the message using Hamming code
            const hamming = new HammingCode(message);
            // let encodedMessage = hamming.encode();
            let encodedMessage = encodingChanges(message);

            // Visualize using Dijkstra's algorithm with the encoded message
            vis.drawEdges();
            vis.drawPoints(startNode, endNode);
            vis.dijkstra(startNode, endNode, encodedMessage);
            // let encodedMessage = document.getElementById('encodedMessage').value;
            const hamming1 = new HammingCode("");
            // let decodedMessage = hamming1.decode(encodedMessage);
            let decodedMessage = decodingChanges(encodedMessage);
            document.getElementById('decodedMessage').value = decodedMessage;
            document.getElementById('decodedMessageDiv').style.display = 'block'; // Show the decoded message div
        } else {
            alert("Please select valid start and end nodes.");
        }
    });


});