interface Grade {
  releaseDate: Date;
  grade: number;
}
interface ApplyDate {
  predicted: Date;
  applied: Date;
  published: Date;
}

export default class Evaluation {

  private weight: number;
  private code: string;
  private title: string;
  private description: string;
  private grades: Grade[];
  private applyDates: ApplyDate;

  constructor ({ applyDates, code, description, grades, title, weight }: {
    applyDates: ApplyDate,
    code: string,
    description: string,
    grades: Grade[],
    title: string,
    weight: number,
  }) {
    this.applyDates = applyDates;
    this.description = description;
    this.grades = grades;
    this.code = code;
    this.title = title;
    this.weight = weight;
  }

  public setWeight (weight: number): void {
    this.weight = weight;
  }

  public getWeight (): number {
    return this.weight;
  }

  public setCode (code: string): void {
    this.code = code;
  }

  public getCode (): string {
    return this.code;
  }

  public setTitle (title: string): void {
    this.title = title;
  }

  public getTitle (): string {
    return this.title;
  }

  public setDescription (description: string): void {
    this.description = description;
  }

  public getDescription (): string {
    return this.description;
  }

  public setGrades (grades: Grade[]): void {
    this.grades = grades;
  }

  public getGrades (): Grade[] {
    return this.grades;
  }

  public setApplyDates (applydates: ApplyDate): void {
    this.applyDates = applydates;
  }

  public getApplyDates (): ApplyDate {
    return this.applyDates;
  }

}
