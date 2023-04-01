const URL = `http://${window.location.hostname}:5050`;
let socket = io(URL, { path: '/real-time' });

let snake = {
    x: 0,
    y: 0
};
let whiteMouse = {
    x: 50,
    y: 50
};
let speed = 50;
let score = 0;

function setup() {
    frameRate(60);
    createCanvas(0, 0);
    snake.x = windowWidth / 2;
    snake.y = windowHeight / 2;
    socket.emit('orderForArduino','I');
}

function draw() {

}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function eatsMouse() {
    if (dist(snake.x, snake.y, whiteMouse.x, whiteMouse.y) < 50) {
        putMouseRandomPosition();
        score++;
        sendScore();
        console.log('Score: ' + score);
    }
}

function putMouseRandomPosition() {
    whiteMouse.x = random(50, windowWidth - 50);
    whiteMouse.y = random(50, windowHeight - 50);
}

function keyPressed() {

    switch (keyCode) {
        case LEFT_ARROW:
            console.log('LEFT');
            character.x -= speed;
            break;
        case RIGHT_ARROW:
            console.log('RIGHT');
            character.x += speed;
            break;
        case DOWN_ARROW:
            console.log('DOWN');
            character.y += speed;
            break;
        case UP_ARROW:
            console.log('UP');
            character.y -= speed;
            break;
        default:
            break;
    }
}


function moveSnakeY(direction) {
    if (direction[0] == 'W') {
        console.log('UP');
        snake.y -= speed;

    } else if (direction[1] == 'S') {
        console.log('DOWN');
        snake.y += speed;
    }
}
function moveSnakeX(position) {

    let mapXValue = (position * windowWidth) / 1023;
    snake.x = mapXValue;

}
/*___________________________________________

1) Include the socket method to listen to events and change the character position.
You may want to use a Switch structure to listen for up, down, right and left cases.
_____________________________________________ */

socket.on('arduinoMessage', (arduinoMessage) => {
    console.log(arduinoMessage);
    let { actionA, actionB, signal } = arduinoMessage;
    moveSnakeY([actionA, actionB]);
    moveSnakeX(signal);
})

function mouseClicked(){
    socket.emit('orderForArduino','N');
}
/*___________________________________________

2) Include the fetch method to post each time the snake eats a mouse
_____________________________________________ */

async function sendScore() {
    console.log(':D POST');
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score })
    }
    await fetch('/score', request);
}