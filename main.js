 const getColorIndicesForCoord = (x, y, width) => {
     const red = y * (width * 4) + x * 4;
     return [red, red + 1, red + 2, red + 3];
 };

 function setPixel(imageData, x, y, r, g, b, a) {
     var index = 4 * (x + y * imageData.width);
     imageData.data[index + 0] = r;
     imageData.data[index + 1] = g;
     imageData.data[index + 2] = b;
     imageData.data[index + 3] = a;
 }

 function TempToRGB(temp, minTemp, maxTemp) {
     const med = (minTemp + maxTemp) / 2
     const redVal = 255 / (maxTemp - minTemp) * (temp - minTemp);
     const greenVal = 255 / (maxTemp - minTemp) * Math.abs(temp - med);
     const blueVal = 255 / (maxTemp - minTemp) * (maxTemp - temp);
     return {
         r: redVal,
         g: greenVal,
         b: blueVal
     }
 }

 function TempToGray(temp, minTemp, maxTemp) {
     return temp * 255 / maxTemp;
 }

 function tempToColor(t, min, max) {
     if (!Number.isFinite(t) || !Number.isFinite(min) || !Number.isFinite(max)) {
         throw new TypeError('function tempToColor() expected only numbers');
     }

     if (min > max) {
         throw new Error('minimum cannot be greater than maximum');
     }

     if (t < min) {
         t = min;
     } else if (t > max) {
         t = max;
     }

     const nT = (t - min) / (max - min);
     let rValue = 255;
     let gValue = 255;
     let bValue = 255;


     const regions = [1 / 6, (1 / 6) * 2, (1 / 6) * 3, (1 / 6) * 4, (1 / 6) * 5];
     if (nT <= regions[0]) {
         rValue = 128 - 6 * nT * 127.999;
         gValue = 0;
         bValue = 255;
     } else if (nT > regions[0] && nT <= regions[1]) {
         rValue = 0;
         gValue = 1280 - 6 * (1 - nT) * 255.999;
         bValue = 255;
     } else if (nT > regions[1] && nT <= regions[2]) {
         rValue = 0;
         gValue = 255;
         bValue = 768 - 6 * nT * 255.999;
     } else if (nT > regions[2] && nT <= regions[3]) {
         rValue = 768 - 6 * (1 - nT) * 255.999;
         gValue = 255;
         bValue = 0;
     } else if (nT > regions[3] && nT <= regions[4]) {
         rValue = 255;
         gValue = 1280 - 6 * nT * 255.999;
         bValue = 0;
     } else {
         rValue = 255;
         gValue = 0;
         bValue = 128 - 6 * (1 - nT) * 127.999;
     }

     return {
         r: rValue,
         g: gValue,
         b: bValue
     }
 }

 const canvas = document.getElementById('canvas');
 const width = 2048;
 const height = 1536;
 const min = 10.39;
 const max = 46.39;
 canvas.width = width;
 canvas.height = height;
 const ctx = canvas.getContext('2d');
 const imageData = ctx.createImageData(width, height);

 //  let time = new Date();
 //  fetch('https://raw.githubusercontent.com/Nogen/ThermalImageData/main/dataCompressed.js')
 //      .then((response) => response.json())
 //      .then((data) => {


 //          dataPROVA = data;

 //          console.log('Scaricata in: ', Date.now() - time);

 //          time = new Date();





 //          // Iterate through every pixel
 //          // for (let i = 0; i < imageData.data.length; i += 4) {
 //          //   // Modify pixel data
 //          //   imageData.data[i + 0] = 190;  // R value
 //          //   imageData.data[i + 1] = 0;    // G value
 //          //   imageData.data[i + 2] = 210;  // B value
 //          //   imageData.data[i + 3] = 255;  // A value
 //          // }

 //          for (let i = 0; i < height; i++) {
 //              for (let j = 0; j < width; j++) {
 //                  const color = TempToRGB(dataPROVA[i][j], min, max)
 //                  setPixel(imageData, i, j, color.r, color.g, color.b, 255);
 //                  // const grayScale = TempToGray(dataPROVA[i][j], min, max);
 //                  // setPixel(imageData, i, j, grayScale, grayScale, grayScale, 255);
 //              }
 //          }

 //          // Draw image data to the canvas
 //          ctx.putImageData(imageData, 0, 0);
 //          console.log('Visualizzata in: ', Date.now() - time);

 //          canvas.addEventListener('click', (e) => {
 //              var x = e.clientX - canvas.offsetLeft;
 //              var y = e.clientY - canvas.offsetTop;
 //              console.log(dataPROVA[x][y]);
 //          });

 //          // setPixel(imageData, 50, 50, 0, 0, 0, 255);
 //          // ctx.putImageData(imageData, 0, 0);
 //      });

 const minData = 4.41;

 fetch('https://raw.githubusercontent.com/Nogen/ThermalImageData/main/prova.bin')
     .then((response) => response.arrayBuffer())
     .then((data) => {

         const thermalValue = new Uint16Array(data);
         console.log(thermalValue);
         for (let y = 0; y < height; y++) {
             for (let x = 0; x < width; x++) {
                 const index = (x + y * width);
                 const value = thermalValue[index] / 100 + minData;
                 const color = tempToColor(value, min, max)
                 setPixel(imageData, x, y, color.r, color.g, color.b, 255);
             }
         }

         // Draw image data to the canvas
         ctx.putImageData(imageData, 0, 0);

         canvas.addEventListener('click', (e) => {
             const rect = canvas.getBoundingClientRect();
             var x = Math.round(e.clientX - rect.left);
             var y = Math.round(e.clientY - rect.top);
             console.log(e.clientX, e.clientY);
             const index = (x + y * width);
             const value = thermalValue[index] / 100 + minData;
             console.log(value);
         });

     });