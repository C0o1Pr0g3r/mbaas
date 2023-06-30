const ISODate = "0000-00-00";

export function date2ISODate(date: Date) {
  return date.toISOString().slice(0, ISODate.length);
}

export function date2ISODateTime(date: Date) {
  return date.toISOString();
}
