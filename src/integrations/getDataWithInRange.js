import httpClient from "../utils/httpClient";
import { getApiDateFormat } from "../utils/chartVisualizationUtil";

const getCandleData = (currentTimeScaleKey, tradingDate) => {
  const endingDate = new Date(tradingDate);
  const startingDate = new Date(tradingDate);

  let oneDayTime = 24 * 60 * 60 * 1000;
  let totalDays = oneDayTime * 10;

  startingDate.setTime(startingDate.getTime() - totalDays);
  const instrumentId = "256265";
  const timeScale = currentTimeScaleKey;
  const formattedFromDate = getApiDateFormat(startingDate);
  const formattedToDate = getApiDateFormat(endingDate);
  const url =
    "getCandleData?instrumentId=" +
    instrumentId +
    "&timeScale=" +
    timeScale +
    "&fromDate=" +
    formattedFromDate +
    "&toDate=" +
    formattedToDate;
  return httpClient.get(url).then((res) => {
    const {
      data: { data },
    } = res;
    return data.candles;
  });
};
export { getCandleData };
