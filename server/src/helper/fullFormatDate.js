const dayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const fullFormatDate = (timeData) => {
  const [time] = timeData.toString().split("Z");
  const newTime = new Date(time);
  const day = dayName[newTime.getDay()];
  const date = newTime.getDate();
  const month = monthName[newTime.getMonth()];
  const year = newTime.getFullYear();
  const hour = ("0" + newTime.getHours()).slice(-2);
  const minute = ("0" + newTime.getMinutes()).slice(-2);
  const second = ("0" + newTime.getSeconds()).slice(-2);

  return `${day}, ${date} ${month} ${year} ${hour}:${minute}:${second}`;
};

module.exports = fullFormatDate;
