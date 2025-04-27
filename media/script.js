const canvas = document.getElementById('canvas');
const filep = document.getElementById('file');

function view() {
  try {
    Clover.loadFromFile(filep.files[0], canvas);
  } catch(err) {
    alert(err);
  }
}
window.view = view;

async function encode() {
  try {
    let file = await Clover.convertFromFile(filep.files[0]);
    Clover.downloadFile(file, filep.files[0].name.replace(/\..+?$/m, '.clover'));
  } catch(err) {
    alert(err);
  }
};
window.encode = encode;