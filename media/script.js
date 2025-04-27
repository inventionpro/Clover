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
  let file = filep.files[0];
  if (!file) return;

  let url = URL.createObjectURL(file);
  let img = new Image();
  img.onload = function() {
    URL.revokeObjectURL(url);
    canvas.width = Math.ceil(img.width/2)*2;
    canvas.height = Math.ceil(img.height/2)*2;

    ctx.drawImage(img, 0, 0);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let blockWidth = canvas.width / 2;
    let blockHeight = canvas.height / 2;
    let datasec = new Uint8Array(blockWidth * blockHeight * 4);

    for (let blockY = 0; blockY < blockHeight; blockY++) {
      for (let blockX = 0; blockX < blockWidth; blockX++) {
        let x = 1 + blockX * 2;
        let y = 1 + blockY * 2;
        let pidx = (y * canvas.width + x) * 4;

        const idx = (blockY * blockWidth + blockX) * 4;
        datasec[idx] = imageData[pidx]??0;
        datasec[idx+1] = imageData[pidx+1]??0;
        datasec[idx+2] = imageData[pidx+2]??0;
        datasec[idx+3] = imageData[pidx+3]??0;
      }
    }

    let newimg = new Uint8Array(datasec.length+16);
    newimg.set([240, 159, 141, 128]); // Magic 🍀
    newimg.set([128], 4); // Version 0 with alpha
    newimg.set([(canvas.width/2)>>8, (canvas.width/2)&255], 5); // Width
    newimg.set([(canvas.height/2)>>8, (canvas.height/2)&255], 7); // Height
    newimg.set(datasec, 9);

    let blob = new Blob([newimg], { type: 'image/clover' });
    let newurl = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = newurl;
    a.download = file.name.replace(/\..+?$/m, '.clover');
    a.click();

    URL.revokeObjectURL(newurl);
  };
  img.src = url;
};
window.encode = encode;
