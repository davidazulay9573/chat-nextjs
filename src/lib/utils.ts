export function dateFormat(data : Date) {
  data = new Date(data);
  return data.getDate() === new Date().getDate()
    ? `${data.getHours().toString().padStart(2, "0")}:${data
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    : `${data.getDate().toString().padStart(2, "0")}/${(data.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
}

