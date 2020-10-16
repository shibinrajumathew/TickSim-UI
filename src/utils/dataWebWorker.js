export default function dataWebWorker() {
  onmessage = function (e) {
    let index = 0;
    let { candleSpeedInMilSec, dbData } = e.data;
    setInterval(() => {
      index += 1;
      let candleData = dbData[index];
      postMessage({ candleData, index });
    }, candleSpeedInMilSec);
  };
}
