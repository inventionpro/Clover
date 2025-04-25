const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const filep = document.getElementById('file');

function view() {
  let file = filep.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function (evt) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let data = new Uint8Array(evt.target.result);

   if (data.slice(0,4).join('') !== '') {
      alert('Invalid file contents')
      return;
    }
    canvas.width = parseInt(Array.from(data.slice(6,10)).map(e=>e.toString(2).padStart(8, '0')).join(''), 2);
    canvas.height = parseInt(Array.from(data.slice(10,14)).map(e=>e.toString(2).padStart(8, '0')).join(''), 2);
  }
  reader.onerror = function (evt) {
    alert("Error reading file");
  }
}

function encode() {
  let file = filep.files[0];
  if (!file) return;

  let url = URL.createObjectURL(file);
  let img = new Image();
  img.onload = function() {
    URL.revokeObjectURL(url);
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let newimg = new UInt8Array();
  };
  img.src = url;
};
