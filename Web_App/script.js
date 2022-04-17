//###############################################################################################
// global variables /////////////////////////////////////////////////////////////////////////////

var deviceName = "MOSbot";
var bleService = '49535343-fe7d-4ae5-8fa9-9fafd205e455';
var bleCharacteristic_TX = '49535343-1e4d-4bd9-ba61-23c647249616';
var bleCharacteristic_RX = '49535343-8841-43f4-a8d4-ecbe34729bb3';
var global_gattCharacteristic_TX;
var global_gattCharacteristic_RX;
var global_service;
var RX_Characteristic;

// Protocol /////////////////////////////////////////////////////////////////////////////

const con_successful   = 1;
const red_1            = 2;
const red_0            = 3;
const green_1          = 4;
const green_0          = 5;
const blue_1           = 6;
const blue_0           = 7;

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
            const device = await navigator.bluetooth.requestDevice({ 
                optionalServices: [bleService],
                // acceptAllDevices: true,      // Option to accept all devices
                filters: [{ name: deviceName }], 
            });
        
            // Connect to the GATT server
            console.log('Connect...');
            const server = await device.gatt.connect();
        
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
        }
    } 
    catch(err) {
      console.error(err);
    }
});

document.querySelector("#disconnect").addEventListener("click", function () {
    if (isWebBluetoothEnabled()) {
        //hier das Gerät disconnecten!
    }
});

document.querySelector('#rot_an').addEventListener('click', function() {
    if (isWebBluetoothEnabled()) { 
        func_Rot_an();
    }
})

  document.querySelector('#rot_aus').addEventListener('click', function() {
    if (isWebBluetoothEnabled()) { 
        func_Rot_aus();
    }
})

document.querySelector('#gruen_an').addEventListener('click', function() {
    if (isWebBluetoothEnabled()) { 
        func_Gruen_an();
    }
})

  document.querySelector('#gruen_aus').addEventListener('click', function() {
    if (isWebBluetoothEnabled()) { 
        func_Gruen_aus();
    }
})

document.querySelector('#blau_an').addEventListener('click', function() {
    if (isWebBluetoothEnabled()) { 
        func_Blau_an();
    }
})

  document.querySelector('#blau_aus').addEventListener('click', function() {
    if (isWebBluetoothEnabled()) { 
        func_Blau_aus();
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
            document.getElementById("led-red-on").hidden = false;
            document.getElementById("led-red-off").hidden = true;
            break;
        
        case red_0:
            document.getElementById("led-red-on").hidden = true;
            document.getElementById("led-red-off").hidden = false;
            break;

        case green_1:
            document.getElementById("led-green-on").hidden = false;
            document.getElementById("led-green-off").hidden = true;
            break;
        
        case green_0:
            document.getElementById("led-green-on").hidden = true;
            document.getElementById("led-green-off").hidden = false;
            break;

        case blue_1:
            document.getElementById("led-blue-on").hidden = false;
            document.getElementById("led-blue-off").hidden = true;
            break;
        
        case blue_0:
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