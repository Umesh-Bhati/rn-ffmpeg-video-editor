export const convertToHHMMSS = (val: string) => {
  type numberOrString = number | string;
  const secNum = parseInt(val, 10);
  let hours: numberOrString = Math.floor(secNum / 3600);
  let minutes: numberOrString = Math.floor((secNum - hours * 3600) / 60);
  let seconds: numberOrString = secNum - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  let time;
  if (hours === '00') {
    time = minutes + ':' + seconds;
  } else {
    time = hours + ':' + minutes + ':' + seconds;
  }
  return time;
};
