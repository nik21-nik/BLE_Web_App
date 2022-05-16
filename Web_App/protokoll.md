
# Protokoll zwischen Web App und BLE-Modul bzw. µC

|Wert (uint8)    |Keyboard-Taste  |Beschreibung                                             |
|                |                |als Steuerbefehl            |als Feedback                |
|----------------|----------------|---------------------------------------------------------|
|0               |-               |-                           |Verbindung erfolgreich      |
|1               |1               |Rot einschalten             |Rot eingeschaltet           |
|2               |1               |Rot ausschalten             |Rot ausgeschaltet           |
|3               |2               |Grün einschalten            |Grün eingeschaltet          |
|4               |2               |Grün ausschalten            |Grün ausgeschaltet          |
|5               |3               |Blau einschalten            |Blau eingeschaltet          |
|6               |3               |Blau ausschalten            |Blau ausgeschaltet          |
|10              |D               |Motor links einschalten     |Motor links eingeschaltet   |
|11              |D               |Motor links ausschalten     |Motor links ausgeschaltet   |
|12              |A               |Motor rechts einschalten    |Motor rechts eingeschaltet  |
|14              |A               |Motor rechts ausschalten    |Motor rechts ausgeschaltet  |
