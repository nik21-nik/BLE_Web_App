
# Protokoll zwischen Web App und BLE-Modul bzw. µC

|µC (uint8)    |HTML (uint8)    |Keyboard-Taste  |Beschreibung                     |
|--------------|----------------|----------------|---------------------------------|
|0             |0               |-               |Default-Wert (keine Aussage)     |
|1             |1               |-               |Verbindung erfolgreich           |
|2             |2               |1               |Rot eingeschaltet                |
|3             |3               |1               |Rot ausgeschaltet                |
|4             |4               |2               |Grün eingeschaltet               |
|5             |5               |2               |Grün ausgeschaltet               |
|6             |6               |3               |Blau eingeschaltet               |
|7             |7               |3               |Blau ausgeschaltet               |
|8             |8               |-               |-- nicht belegt                  |
|9             |9               |-               |-- nicht belegt                  |
|10            |10              |D               |Motor links ein                  |
|11            |11              |D               |Motor links aus                  |
|12            |12              |A               |Motor rechts ein                 |
|14            |13              |A               |Motor rechts aus                 |
