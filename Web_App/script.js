//###############################################################################################
// global variables /////////////////////////////////////////////////////////////////////////////

var deviceName = "MOSbot";
var bleService = '49535343-fe7d-4ae5-8fa9-9fafd205e455';
var bleCharacteristic_TX = '49535343-1e4d-4bd9-ba61-23c647249616';
var bleCharacteristic_RX = '49535343-8841-43f4-a8d4-ecbe34729bb3';
var global_device;
var RX_Characteristic;

// Protocol /////////////////////////////////////////////////////////////////////////////

const con_successful   = 1;
const red_1            = 2;
const red_0            = 3;
const green_1          = 4;
const green_0          = 5;
const blue_1           = 6;
const blue_0           = 7;

var red_on = false;
var green_on = false;
var blue_on = false;

//###############################################################################################
// Styling /////////////////////////////////////////////////////////////////////////////
document.getElementById("led-red-on").hidden = true;
document.getElementById("led-red-off").hidden = false;
document.getElementById("led-green-on").hidden = true;
document.getElementById("led-green-off").hidden = false;
document.getElementById("led-blue-on").hidden = true;
document.getElementById("led-blue-off").hidden = false;

//###############################################################################################
// Event Listeners /////////////////////////////////////////////////////////////////////////////

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
            
            RX_Characteristic.writeValue(Uint8Array.of(1));
            console.log('Connection successfull.');

            document.getElementById("connect").disabled = true;
            document.getElementById("disconnect").disabled = false;
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

document.querySelector('#rot').addEventListener('click', function() {
    red_on ? func_Rot_aus() : func_Rot_an()
})

document.querySelector('#gruen').addEventListener('click', function() {
    green_on ? func_Gruen_aus() : func_Gruen_an();
})

document.querySelector('#blau').addEventListener('click', function() {
    blue_on ? func_Blau_aus() : func_Blau_an();
})


document.addEventListener("keydown", function(event) {
    if (event.code == "Digit1") {                                  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
        red_on ? func_Rot_aus() : func_Rot_an();
    }
    if (event.code == "Digit2") {
        green_on ? func_Gruen_aus() : func_Gruen_an();
    }
    if (event.code == "Digit3") {
        blue_on ? func_Blau_aus() : func_Blau_an();
    }
})


//###############################################################################################
// Functions /////////////////////////////////////////////////////////////////////////////

function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log("Web Bluetooth API is not available in this browser!");
        return false;
    }

    return true;
}


function handleNotifications(event) {
    let value = event.target.value.getUint8(0);

    switch (value) {
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

        default:
            console.log("Data does not match protocol!")
            break;
    }

    
    var now = new Date();
    console.log('> ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ' Received data: ' + value);
}



function func_Rot_an(){
    RX_Characteristic.writeValue(Uint8Array.of(red_1));
}

function func_Rot_aus(){
    RX_Characteristic.writeValue(Uint8Array.of(red_0));
}

function func_Gruen_an(){
    RX_Characteristic.writeValue(Uint8Array.of(green_1));
}

function func_Gruen_aus(){
    RX_Characteristic.writeValue(Uint8Array.of(green_0));
}

function func_Blau_an(){
    RX_Characteristic.writeValue(Uint8Array.of(blue_1));
}

function func_Blau_aus(){
    RX_Characteristic.writeValue(Uint8Array.of(blue_0));
}