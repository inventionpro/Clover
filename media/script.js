const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const filep = document.getElementById('file');

function view() {
  try {
    Clover.loadFromFile(filep.files[0], canvas);
  } catch(err) {
    alert(err);
  }
}
window.view = view;

function encode() {
  try {
    let file = Clover.convertFromFile(filep.files[0], canvas);
    Clover.downloadFile(file, filep.files[0].name.replace(/\..+?$/m, '.clover'));
  } catch(err) {
    alert(err);
  }
};
window.encode = encode;
