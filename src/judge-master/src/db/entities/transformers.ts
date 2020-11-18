export const arrayAndString = {
  to (v) {
    return v instanceof Array ? v.join(",") : v;
  },
  from (v) {
    return typeof v === "string" ? v.split(",") : v;
  }
}