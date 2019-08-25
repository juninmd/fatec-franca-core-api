import Discipline from './discipline.model';

interface Semester {
  number: number;
  disciplines: Discipline[];
}

export default class SchoolGrade {

  private semesters: Semester[];

  constructor(semesters: Semester[]) {
    this.semesters = semesters;
  }

  public setSemesters(semesters: Semester[]): void {
    this.semesters = semesters;
  }

  public getSemesters(): Semester[] {
    return this.semesters;
  }

}
