export default function dynamicDataWebWorker() {
  onmessage = function (e) {
    let dynamicCandleCounter = 0;
    let { dynamicCandleSpeedInMilSec, index } = e.data;
    setInterval(() => {
      if (dynamicCandleCounter > 2) {
        dynamicCandleCounter = 0;
        index = index + 1;
      }
      postMessage({
        dynamicCandleCounter,
        index,
      });
      dynamicCandleCounter += 1;
    }, dynamicCandleSpeedInMilSec);
  };
}
