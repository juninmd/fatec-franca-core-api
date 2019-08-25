import Discipline from './discipline.model';

interface Entry {
  observation: number;
  discipline: Discipline;
}

export default class HistoryStudent {

  private entries: Entry[];

  constructor(entries: Entry[]) {
    this.entries = entries;
  }

  public setEntries(entries: Entry[]): void {
    this.entries = entries;
  }

  public getEntries(): Entry[] {
    return this.entries;
  }

}
