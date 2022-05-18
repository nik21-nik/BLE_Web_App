//###############################################################################################
// global variables /////////////////////////////////////////////////////////////////////////////

var deviceName = "MOSbot";
var bleService = '49535343-fe7d-4ae5-8fa9-9fafd205e455';
var bleCharacteristic_TX = '49535343-1e4d-4bd9-ba61-23c647249616';
var bleCharacteristic_RX = '49535343-8841-43f4-a8d4-ecbe34729bb3';
var global_device;
var RX_Characteristic;

// Protocol /////////////////////////////////////////////////////////////////////////////

const con_successful   = 0;
const red_1            = 1;
const red_0            = 2;
const green_1          = 3;
const green_0          = 4;
const blue_1           = 5;
const blue_0           = 6;
const Motor_links_1    = 10;
const Motor_links_0    = 11;
const Motor_rechts_1   = 12;
const Motor_rechts_0   = 13;

// Feedback
var red_on              = false;
var green_on            = false;
var blue_on             = false;
var Motor_links_on      = false;
var Motor_rechts_on     = false;

//###############################################################################################
// Styling /////////////////////////////////////////////////////////////////////////////
document.getElementById("led-red-on").hidden = true;
document.getElementById("led-red-off").hidden = false;
document.getElementById("led-green-on").hidden = true;
document.getElementById("led-green-off").hidden = false;
document.getElementById("led-blue-on").hidden = true;
document.getElementById("led-blue-off").hidden = false;

// Toggle between dark and white mode
function darkMode() {
    var element = document.body;
    element.classList.toggle("white-mode");
  }

//###############################################################################################
// Event Listeners /////////////////////////////////////////////////////////////////////////////

// Connect / Disconnect /////////////////////////////////////////////////////////////////////////////

document.querySelector("#connect").addEventListener("click", async () => {                      // async-Funktion: https://blog.logrocket.com/build-bluetooth-app-chrome-bluetooth-web-api/
    try {
        if (isWebBluetoothEnabled()) {
            global_device = await navigator.bluetooth.requestDevice({ 
                optionalServices: [bleService],
                // acceptAllDevices: true,      // Option to accept all devices
                filters: [{ name: deviceName }], 
            });
        
            // Connect to the GATT server
            console.log('Connect...');
            const server = await global_device.gatt.connect();
        
            // Getting the services we mentioned before through GATT server
            console.log('Getting GATT Service...');
            const MOSbot_service = await server.getPrimaryService(bleService);
        
            // Getting Characteristic for receiving data (BLE -> TX)…
            console.log('Getting GATT Characteristic TX...');
            const TX_Characterisic = await MOSbot_service.getCharacteristic(bleCharacteristic_TX);
        
            TX_Characterisic.startNotifications().then(() => {
                TX_Characterisic.addEventListener(
                    'characteristicvaluechanged', handleNotifications
                );
            });
        
              
            // Getting Characteristic for transmitting data (BLE -> RX)…
            console.log('Getting GATT Characteristic RX...');
            RX_Characteristic = await MOSbot_service.getCharacteristic(bleCharacteristic_RX);
            
            writeData(con_successful);

        }
    } 
    catch(err) {
      console.error(err);
    }
});

document.querySelector("#disconnect").addEventListener("click", function () {
    global_device.gatt.disconnect();    
    global_device.addEventListener('gattserverdisconnected', console.log("Disconnected."));
    document.getElementById("connect").disabled = false;
    document.getElementById("disconnect").disabled = true;
});

// switch LEDs /////////////////////////////////////////////////////////////////////////////

//# with buttons

document.querySelector('#rot').addEventListener('click', function() {
    red_on ? writeData(red_0) : writeData(red_1);
});

document.querySelector('#gruen').addEventListener('click', function() {
    green_on ? writeData(green_0) : writeData(green_1);
});

document.querySelector('#blau').addEventListener('click', function() {
    blue_on ? writeData(blue_0) : writeData(blue_1);
});

document.querySelector('#motor_l').addEventListener('click', function() {
    Motor_links_on ? writeData(Motor_links_0) : writeData(Motor_links_1);
});

document.querySelector('#motor_r').addEventListener('click', function() {
    Motor_rechts_on ? writeData(Motor_rechts_0) : writeData(Motor_rechts_1);
});

//# with keyboard

document.addEventListener("keydown", function(event) {
    if (event.code == "Digit1") {                                  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
        red_on ? writeData(red_0) : writeData(red_1);
    }
    if (event.code == "Digit2") {
        green_on ? writeData(green_0) : writeData(green_1);
    }
    if (event.code == "Digit3") {
        blue_on ? writeData(blue_0) : writeData(blue_1);
    }
    if (event.code == "KeyD" && !Motor_links_on) {
        writeData(Motor_links_1);
    }
    if (event.code == "KeyA" && !Motor_rechts_on) {
        writeData(Motor_rechts_1);
    }
});

document.addEventListener("keyup", function(event) {            // Beim Loslassen der Tasten soll der Motor ausgehen
    if (event.code == "KeyD") {
        writeData(Motor_links_0);
    }
    if (event.code == "KeyA") {
        writeData(Motor_rechts_0);
    }
});

//###############################################################################################
// Functions /////////////////////////////////////////////////////////////////////////////

// Check browser compatibility 
function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log("Web Bluetooth API is not available in this browser!");
        alert("Web Bluetooth API is not available in this browser!");
        return false;
    }
    return true;
}

// Receive feedback from Server
function handleNotifications(event) {
    let value = event.target.value.getUint8(0);

    switch (value) {
        case con_successful:
            console.log('Connection successfull.');
            document.getElementById("connect").disabled = true;
            document.getElementById("disconnect").disabled = false;
        break;
        
        case red_1:
            red_on = true;
            document.getElementById("led-red-on").hidden = false;
            document.getElementById("led-red-off").hidden = true;
        break;
        
        case red_0:
            red_on = false;
            document.getElementById("led-red-on").hidden = true;
            document.getElementById("led-red-off").hidden = false;
        break;

        case green_1:
            green_on = true;
            document.getElementById("led-green-on").hidden = false;
            document.getElementById("led-green-off").hidden = true;
        break;
        
        case green_0:
            green_on = false;
            document.getElementById("led-green-on").hidden = true;
            document.getElementById("led-green-off").hidden = false;
        break;

        case blue_1:
            blue_on = true;
            document.getElementById("led-blue-on").hidden = false;
            document.getElementById("led-blue-off").hidden = true;
        break;
        
        case blue_0:
            blue_on = false;
            document.getElementById("led-blue-on").hidden = true;
            document.getElementById("led-blue-off").hidden = false;
        break;

        case Motor_links_1:
            Motor_links_on = true;
        break;

        case Motor_links_0:
            Motor_links_on = false;
        break;

        case Motor_rechts_1:
            Motor_rechts_on = true;
        break;

        case Motor_rechts_0:
            Motor_rechts_on = false;
        break;

        default:
            console.log("Data does not match protocol!");
        break;
    }

    //Ausgabe der empfangenen Daten in der Konsole
    var now = new Date();
    console.log('> ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ' Received data: ' + value);
}

// Send commands to Server
function writeData(data){
    RX_Characteristic.writeValue(Uint8Array.of(data));
}