var deviceName = "MOSbot";
var bluetoothDeviceDetected;
var bleService = '49535343-fe7d-4ae5-8fa9-9fafd205e455';
var bleCharacteristic = '49535343-1e4d-4bd9-ba61-23c647249616';
var gattCharacteristic;

document.querySelector("#connect").addEventListener("click", function () {
    if (isWebBluetoothEnabled()) {
        read();
    }
});

document.querySelector('#start').addEventListener('click', function(event) {
    if (isWebBluetoothEnabled()) { start() }
})

  document.querySelector('#stop').addEventListener('click', function(event) {
    if (isWebBluetoothEnabled()) { stop() }
})


document.querySelector("#get_info").addEventListener("click", function () {
    if (isWebBluetoothEnabled()) {
        document.getElementById("output").innerHTML = received_info;        //read();
    }
});

function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
        console.log("Web Bluetooth API is not available in this browser!");
        return false;
    }

    return true;
}

function read() {
    return bluetoothDeviceDetected ? Promise.resolve() : getDeviceInfo()
    .then(connectGATT)
    .then((_) => {
        console.log("Reading UV Index...");
        return gattCharacteristic.readValue();
    })
    .catch((error) => {
      console.log("Waiting to start reading: " + error);
    });
}

function getDeviceInfo() {
    let options = {
        optionalServices: [bleService],
        // acceptAllDevices: true, // Option to accept all devices
        filters: [{ name: deviceName }],
    };

    // Auswahl der Bluetooth Geräte in Pop-Up-Fenster
    console.log("Requesting any Bluetooth Device...");
    return navigator.bluetooth
    .requestDevice(options)
    .then((device) => {
        bluetoothDeviceDetected = device;
    })
    .catch((error) => {
        console.log("Argh! " + error);
    });
}


function connectGATT() {
    if (bluetoothDeviceDetected.gatt.connected && gattCharacteristic) {
      return Promise.resolve()
    }

    return bluetoothDeviceDetected.gatt.connect()
    .then(server => {
      console.log('Getting GATT Service...')
      return server.getPrimaryService(bleService)
    })
    .then(service => {
      console.log('Getting GATT Characteristic...')
      return service.getCharacteristic(bleCharacteristic)
    })
    .then(characteristic => {
      gattCharacteristic = characteristic
      gattCharacteristic.addEventListener('characteristicvaluechanged',
          handleChangedValue)
      document.querySelector('#start').disabled = false
      document.querySelector('#stop').disabled = true
    })
}

function handleChangedValue(event) {
    let value = event.target.value.getUint8(0)
    var now = new Date()
    console.log('> ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ' RGB Color ' + value)
}

function start() {
    gattCharacteristic.startNotifications()
    .then(_ => {
        console.log('Start reading...')
        document.querySelector('#start').disabled = true
        document.querySelector('#stop').disabled = false
    })
    .catch(error => {
        console.log('[ERROR] Start: ' + error)
    })
}

function stop() {
    gattCharacteristic.stopNotifications()
    .then(_ => {
      console.log('Stop reading...')
      document.querySelector('#start').disabled = false
      document.querySelector('#stop').disabled = true
    })
    .catch(error => {
      console.log('[ERROR] Stop: ' + error)
    })
}