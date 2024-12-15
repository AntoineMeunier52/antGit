export default class Author {
  constructor(name, email, time) {
    this.name = name;
    this.email = email;
    this.time = time;
  }

  toStr() {
    const timestamp = `${Math.floor(
      this.time.getTime() / 1000
    )} ${this.getTimezoneOffset()}`;

    return `${this.name} <${this.email}> ${timestamp}`;
  }

  getTimezoneOffset() {
    const offset = this.time.getTimezoneOffset();
    const sign = offset <= 0 ? "+" : "-";
    const hours = String(Math.abs(Math.floor(offset / 60))).padStart(2, "0");
    const minutes = String(Math.abs(offset % 60)).padStart(2, "0");
    return `${sign}${hours}${minutes}`;
  }
}
