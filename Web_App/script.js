var deviceName = "MOSbot";
var bleService = '49535343-fe7d-4ae5-8fa9-9fafd205e455';
var bleCharacteristic_TX = '49535343-1e4d-4bd9-ba61-23c647249616';
var bleCharacteristic_RX = '49535343-8841-43f4-a8d4-ecbe34729bb3';
var global_gattCharacteristic_TX;
var global_gattCharacteristic_RX;
var global_service;
var bluetoothDeviceDetected;
var RX_Characteristic;

document.querySelector("#connect").addEventListener("click", async () => {                      // async-Funktion: https://blog.logrocket.com/build-bluetooth-app-chrome-bluetooth-web-api/
    try {
        if (isWebBluetoothEnabled()) {
            const device = await navigator.bluetooth.requestDevice({ 
                optionalServices: [bleService],
                // acceptAllDevices: true,      // Option to accept all devices
                filters: [{ name: deviceName }], 
            })
        
            let bluetoothDeviceDetected = device.gatt.device.name;
        
            // Connect to the GATT server
            console.log('Connect...')
            const server = await device.gatt.connect();
        
            // Getting the services we mentioned before through GATT server
            console.log('Getting GATT Service...')
            const MOSbot_service = await server.getPrimaryService(bleService);
        
            // Getting Characteristic for receiving data (BLE -> TX)…
            console.log('Getting GATT Characteristic TX...')
            const TX_Characterisic = await MOSbot_service.getCharacteristic(bleCharacteristic_TX);
        
            TX_Characterisic.startNotifications().then(() => {
                TX_Characterisic.addEventListener(
                    'characteristicvaluechanged', handleNotifications
                );
            });
        
              
            // Getting Characteristic for transmitting data (BLE -> RX)…
            console.log('Getting GATT Characteristic RX...')
            RX_Characteristic = await MOSbot_service.getCharacteristic(bleCharacteristic_RX);
            
            RX_Characteristic.writeValue(Uint8Array.of(1));
            console.log('Connection successfull.');
        }
    } 
    catch(err) {
      console.error(err);
      alert("An error occured while connecting");
    }
});

document.querySelector("#disconnect").addEventListener("click", function () {
    if (isWebBluetoothEnabled()) {
        //hier das Gerät disconnecten!
    }
});

document.querySelector('#rot_an').addEventListener('click', function() {
    if (isWebBluetoothEnabled()) { 
        Rot_an() 
    }
})

  document.querySelector('#rot_aus').addEventListener('click', function() {
    if (isWebBluetoothEnabled()) { 
        Rot_aus() 
    }
})




function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log("Web Bluetooth API is not available in this browser!");
        return false;
    }

    return true;
}


function handleNotifications(event) {
    let value = event.target.value.getUint8(0)
    if(value == 2){
        document.getElementById("output").innerHTML = "Rot An";        //read();
    }
    if(value == 3){
        document.getElementById("output").innerHTML = "Rot Aus";        //read();
    }
    var now = new Date()
    console.log('> ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ' RGB Color ' + value)
}



function Rot_an(){
    RX_Characteristic.writeValue(Uint8Array.of(2));
}

function Rot_aus(){
    RX_Characteristic.writeValue(Uint8Array.of(3));
}