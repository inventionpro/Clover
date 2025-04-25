# Clover 🍀 File

## Structure
| Section | Size | Contents                            |
| ------- | ---- | ----------------------------------- |
| Header  |      |                                     |
| Magic   | 4 B  | f0 9f 8d 80                         |
| Width   | 2 B  | Half the width of the image         |
| Height  | 2 B  | Half the height of the image        |
| Body    |      |                                      |
| Data    | Any  | 1 Byte per channel, 4 channels RGBA |

All clover images have a even width and height so they are stored as half the value, not loosing any precision and without needing floats.
