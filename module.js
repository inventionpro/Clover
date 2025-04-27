let Clover = {
  loadFromFile: (file, canvas)=>{
    if (!file || !canvas) return;

    const reader = new FileReader();

    reader.onload = function (evt) {
      let data = new Uint8Array(evt.target.result);

      if (data.slice(0,4).join('') !== '240159141128') {
        throw new Error('Invalid file contents');
      }

      let version = data.slice(4,5);
      let alpha = Boolean(version & 128);

      canvas.width = parseInt(Array.from(data.slice(5,7)).map(e=>e.toString(2).padStart(8, '0')).join(''), 2)*2;
      canvas.height = parseInt(Array.from(data.slice(7,9)).map(e=>e.toString(2).padStart(8, '0')).join(''), 2)*2;

      const ctx = canvas.getContext('2d', { alpha });
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let datasec = data.slice(9);

      let pixels = [];
      for (let i = 0; i<canvas.width*canvas.height*(alpha?4:3); i++) {
        if (!pixels[Math.floor(i/(alpha?4:3))]) pixels[Math.floor(i/(alpha?4:3))] = [];
        pixels[Math.floor(i/(alpha?4:3))][i%(alpha?4:3)] = datasec[i];
      }

      for (let b = 0; b<4; b++) {
        for (let i = 0; i<canvas.width*canvas.height/4; i++) {
          let x = (i%(canvas.width/2))*2+b%2;
          let y = Math.floor(i/(canvas.width/2))*2+Math.floor(b/2);
          ctx.fillStyle = `rgba(${pixels[i][0]}, ${pixels[i][1]}, ${pixels[i][2]}, ${(pixels[i][3]??255)/255})`;
          ctx.fillRect(x+1, y+1, 1, 1);
        }
      }
    }
    reader.onerror = function (evt) {
      throw new Error('Cannot read file');
    }
    reader.readAsArrayBuffer(file);
  },
  convertFromFile: (file)=>{
    return new Promise((resolve, reject)=>{
      if (!file) reject();

      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
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
        resolve(blob);
      };
      img.src = url;
    })
  },
  downloadFile: (file, name)=>{
    let newurl = URL.createObjectURL(file);

    let a = document.createElement('a');
    a.href = newurl;
    a.download = name;
    a.click();

    URL.revokeObjectURL(newurl);
  }
};

window.Clover = Clover;