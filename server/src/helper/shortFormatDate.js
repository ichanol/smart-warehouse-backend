const shortFormatDate = (timeData) => {
  const [time] = timeData.toString().split("Z");
  const newTime = new Date(time);
  return (
    ("0" + newTime.getDate()).slice(-2) +
    "/" +
    ("0" + (newTime.getMonth() + 1)).slice(-2) +
    "/" +
    newTime.getFullYear()
  );
};

module.exports = shortFormatDate;
