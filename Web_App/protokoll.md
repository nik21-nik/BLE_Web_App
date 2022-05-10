
# Protokoll zwischen Web App und BLE-Modul bzw. µC

|µC (uint8)    |HTML (uint8)    |Keyboard-Taste  |Beschreibung                     |
|--------------|----------------|----------------|---------------------------------|
|0             |0               |-               |Verbindung erfolgreich           |
|1             |1               |1               |Rot eingeschaltet                |
|2             |2               |1               |Rot ausgeschaltet                |
|3             |3               |2               |Grün eingeschaltet               |
|4             |4               |2               |Grün ausgeschaltet               |
|5             |5               |3               |Blau eingeschaltet               |
|6             |6               |3               |Blau ausgeschaltet               |
|7             |7               |-               |-- nicht belegt                  |
|8             |8               |-               |-- nicht belegt                  |
|10            |10              |D               |Motor links ein                  |
|11            |11              |D               |Motor links aus                  |
|12            |12              |A               |Motor rechts ein                 |
|14            |13              |A               |Motor rechts aus                 |
