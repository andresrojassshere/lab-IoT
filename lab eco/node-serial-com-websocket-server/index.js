import { express, Server, cors, SerialPort, ReadlineParser } from './dependencies.js'

const PORT = 5050;

//⚙️ HTTP COMMUNICATION SETUP _________________________________________________
const app = express();
app.use(cors({ origin: "*" })); // Esta linea de codigo es para seguridad
const STATIC_MUPI_DISPLAY = express.static('public-display');
app.use('/mupi-display', STATIC_MUPI_DISPLAY);
app.use(express.json());
//============================================ END

//⚙️ SERIAL COMMUNICATION SETUP -------------------------------------------------
//cuando modifiquemos algo del serial print en ARDUINO IDE tenemos que para el npm start, mandarlo y ya ahi se volver a hacer aqui el npm start
/*pasos 
    1. cd no tab 
    2. upload en arduino IDE 
    3. npm i 
    4. npm start*/

const protocolConfiguration = { // *New: Defining Serial configurations
    path: 'COM7', //*Change this COM# or usbmodem#####
    baudRate: 9600
};

const port = new SerialPort(protocolConfiguration);
//si hacemos el console log aqui de lo que llamamos de arduino se va a ver solamente codigo que no entendemos, para entenderlo utilizamos el parser.
/*port.on('data', (arduinoData) =>{
    console.log(arduinoData);
})*/

const parser = port.pipe(new ReadlineParser);
//nos pasa a palabras humanas codigos   que los humanos no entienden :)
parser.on('data', (arduinoData) =>{
    console.log(arduinoData);
    //aqui separamos todos los valores que llamamos
    let dataArray = arduinoData.split(' ');
    console.log(dataArray);
    //ya tenemos el 100 como entero, ya lo podemos usar
    let newValue = parseInt(dataArray[0]);
    console.log(newValue);
})
//============================================ END

//⚙️ WEBSOCKET COMMUNICATION SETUP -------------------------------------------------
const httpServer = app.listen(PORT, () => {
    console.table(
        {
            'Mupi display:' : 'http://localhost:5050/mupi-display',
        }
    )
});
const ioServer = new Server(httpServer, { path: '/real-time' });
//============================================ END

/* 🔄 SERIAL COMMUNICATION WORKING___________________________________________
Listen to the 'data' event, arduinoData has the message inside*/

/*parser.on('data', (arduinoData) => {

    let dataArray = arduinoData.split(' ');

    let arduinoMessage = {
        actionA: dataArray[0],
        actionB: dataArray[1],
        signal: parseInt(dataArray[2])
    }
    ioServer.emit('arduinoMessage', arduinoMessage);
    console.log(arduinoMessage);
 
});*/

/* 🔄 WEBSOCKET COMMUNICATION __________________________________________

1) Create the socket methods to listen the events and emit a response
It should listen for directions and emit the incoming data.*/

ioServer.on('connection', (socket) => {

    socket.on('orderForArduino', (orderForArduino) => {
        port.write(orderForArduino);
        console.log('orderForArduino: ' + orderForArduino);
    });

});

/* 🔄 HTTP COMMUNICATION ___________________________________________

2) Create an endpoint to POST user score and print it
_____________________________________________ */

app.post('/score', (request, response) =>{
    console.log(request.body);
    port.write('P');
    response.end();
})