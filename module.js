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
  }
};

window.Clover = Clover;
