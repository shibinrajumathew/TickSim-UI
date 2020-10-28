export default function dataWebWorker() {
  onmessage = function (e) {
    let { candleSpeedInMilSec, dbData, lastIndexAfterSlice } = e.data;
    let index = lastIndexAfterSlice;
    setInterval(() => {
      index += 1;
      let candleData = dbData[index];
      postMessage({ candleData, index });
    }, candleSpeedInMilSec);
  };
}
