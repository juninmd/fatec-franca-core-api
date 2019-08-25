interface Event {
  date: Date;
  name: string;
  reason: string;
}

interface Month {
  events: Event[];
}

export default class Calendar {

  private months: Month[];

  constructor(months: Month[]) {
    this.months = months;
  }

  public setMonths(months: Month[]): void {
    this.months = months;
  }

  public getMonths(): Month[] {
    return this.months;
  }

}
