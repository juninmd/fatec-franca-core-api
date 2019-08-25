import Discipline from './discipline.model';

interface Period {
  startAt: Date;
  endAt: Date;
  discipline: Discipline;
}

export default class Schedule {

  private weekday: number;
  private periods: Period[];

  constructor({ weekday, periods }: { weekday: number, periods: Period[] }) {
    this.weekday = weekday;
    this.periods = periods;
  }

  public setWeekday(weekday: number): void {
    this.weekday = weekday;
  }

  public getWeekday(): number {
    return this.weekday;
  }

  public setPeriods(periods: Period[]): void {
    this.periods = periods;
  }

  public getPeriods(): Period[] {
    return this.periods;
  }

}
