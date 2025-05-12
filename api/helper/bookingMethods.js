function generateTimeSlots(
  startTimeStr,
  endTimeStr,
  intervalMinutes = 10,
  baseDate = new Date()
) {
  const slots = [];

  // Converts time like "2:00 PM" to a Date object on the given baseDate
  function toDate(timeStr, baseDate) {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0); // Reset seconds and ms
    return date;
  }

  // Formats time in 12-hour format with AM/PM
  function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const modifier = hours >= 12 ? "PM" : "AM";

    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;

    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes} ${modifier}`;
  }

  let current = toDate(startTimeStr, baseDate);
  const end = toDate(endTimeStr, baseDate);

  while (current < end) {
    slots.push(formatTime(new Date(current)));
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return slots;
}

function convertToMinutes(timeStr) {
  const [time, meridian] = timeStr.split(" ");
  let [hour, minute] = time.split(":").map(Number);
  if (meridian === "PM" && hour !== 12) hour += 12;
  if (meridian === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

module.exports = { generateTimeSlots, convertToMinutes };
