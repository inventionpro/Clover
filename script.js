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

   if (data.slice(0,4).join('') !== '240159141128') {
      alert('Invalid file contents')
      return;
    }
    canvas.width = parseInt(Array.from(data.slice(4,6)).map(e=>e.toString(2).padStart(8, '0')).join(''), 2)*2;
    canvas.height = parseInt(Array.from(data.slice(6,8)).map(e=>e.toString(2).padStart(8, '0')).join(''), 2)*2;

    let datasec = data.slice(8);
    let pixels = [];
    for (let i = 0; i<canvas.width*canvas.height*4; i++) {
      if (!pixels[Math.floor(i/4)]) pixels[Math.floor(i/4)] = [];
      pixels[Math.floor(i/4)][i%4] = datasec[i];
    }

    for (let b = 0; b<4; b++) {
      for (let i = 0; i<canvas.width*canvas.height/4; i++) {
        let x = (i%(canvas.width/2))*2+b%2;
        let y = Math.floor(i/(canvas.width/2))*2+Math.floor(b/2);
        ctx.fillStyle = `rgba(${pixels[i][0]}, ${pixels[i][1]}, ${pixels[i][2]}, ${pixels[i][4]/255})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
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
