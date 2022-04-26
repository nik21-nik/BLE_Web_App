# BLE_Web_App

Studienarbeit von Niklas Stöcklein, MT19A,
Betreuer: Alexander Wilke

## How to use the Web-App

1. Check if your browser is compatible with the Web Bluetooth API on this [website](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API).
2. Download [main.cpp](https://github.com/nik21-nik/BLE_Web_App/blob/main/MOSbot_RGB_BLE/MOSbot_RGB_BLE/main.cpp) and program the MOSbot via ISP
3. Set up the Web-App on your device:
    - Option 1: for all devices
        Visit https://blewebapp.000webhostapp.com/ (this may not be up to date with the files in this repo)
    - Option 2: for PC
        Download [index.html](https://github.com/nik21-nik/BLE_Web_App/blob/main/Web_App/index.html), [script.js](https://github.com/nik21-nik/BLE_Web_App/blob/main/Web_App/script.js) and [style.css](https://github.com/nik21-nik/BLE_Web_App/blob/main/Web_App/style.css) into the same dirctory and open index.html with a compatible browser (e.g. Chrome)
    - Option 3: for Android smartphone
        via SD-card: to be done
4. Connect to MOSbot
5. Interact with MOSbot


## Features
- Connect and disconnect to/from BLE module from MOSbot
- Get current LED-status immediately after connection
- Switch LEDs by pressing buttons or keys (1,2,3)
- Get Feedback of current LED-status
- Switch the two motors by pressing buttons or keys (A,D)

Nice to have:
- Link to Github
- Change background theme of web app 

<br>
<br>
<br>

---

# Knowledge collection

## Links aus Beschreibung der Studienarbeit

- [Using Web BLE to detect and get GATT information](https://www.youtube.com/watch?v=TsXUcAKi790)
- [Goole Chrome Web Bluetooth Samples](https://googlechrome.github.io/samples/web-bluetooth/index.html)
- [Communicating with Bluetooth devices over JavaScript](https://web.dev/bluetooth/)
- [Remote debug Android devices](https://developer.chrome.com/docs/devtools/remote-debugging/)

## Hilfreiche Tutorials für den Einstieg

- [Basic unterstanding of HTML(with CSS and JavaScript)](https://www.youtube.com/watch?v=qz0aGYrrlhU)
-

## Code References und Beispiele

- [Communicating with Bluetooth devices over JavaScript](https://web.dev/bluetooth/)(doppelt aus Studienarbeitsbeschreibung)
- [W3C Web Bluetooth Reference](https://webbluetoothcg.github.io/web-bluetooth/)
- [Goole Chrome Web Bluetooth Samples](https://googlechrome.github.io/samples/web-bluetooth/index.html)(doppelt aus Studienarbeitsbeschreibung)
- [Webtechnologien für Entwickler](https://developer.mozilla.org/de/docs/Web)

## Links für Ausarbeitung

- [Einleitung?:](https://www.heise.de/developer/artikel/Features-von-uebermorgen-die-Web-Bluetooth-API-3167796.html)
- [Introduction to Bluetooth Low Energy](https://learn.adafruit.com/introduction-to-bluetooth-low-energy/introduction)
- [Explaining GATT (Services and Characteristics)](https://www.oreilly.com/library/view/getting-started-with/9781491900550/ch04.html)
- [W3C Web Bluetooth Reference](https://webbluetoothcg.github.io/web-bluetooth/)


## Tipps
- mit about://bluetooth-internals können in Chrome alle Bluetooth Module in der Nähe untersucht werden (Services und Characteristics)