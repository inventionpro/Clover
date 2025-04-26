# Clover 🍀
Clover is a binary image file format designed for slow unstable connections.

## File Structure
| Section  | Size | Contents                 |
| -------- | ---- | ------------------------ |
| Header   |      |                          |
| Magic    | 4 B  | `f0 9f 8d 80`            |
| Version  | 1 B  | `00` starting at 0       |
| Width    | 2 B  | Half width of image      |
| Height   | 2 B  | Half height of image     |
| Body     |      |                          |
| Data     | Any  | 1 Byte per channel, RGB(A) |

Thw first bit of version determines of there is an alpha channel.
All clover images have a even width and height so they are stored as half the value, not loosing any precision and without needing floats.
