import Calendar from './calendar.model';
import Discipline from './discipline.model';
import Evaluation from './evaluation.model';
import History from './history-student.model';
import Schedule from './schedule.model';
import SchoolGrade from './school-grad.modele';

enum EmailIntegrations {
  fatec,
  etec,
  preferential,
  websai,
}

interface RegisteredEmail {
  email: string;
  integrations?: EmailIntegrations[];
}

// interface Attendance {
//   absenses: number;
//   presences: number;
// }

interface PartialGrade {
  finalScore: number;
  frequency: number;
  discipline: Discipline;
  evaluations: Evaluation[];
}

interface Profile {
  averageGrade: number;
  birthday: Date;
  code: string;
  course: string;
  cpf: string;
  email: string;
  name: string;
  period: string;
  picture?: string;
  progress: number;
  unit: string;
}

export default class Student {

  private averageGrade: number;
  private name: string;
  private birthday: Date;
  private code: string;
  private course: string;
  private cpf: string;
  private email: string;
  private period: string;
  private picture: any;
  private progress: number;
  private unit: string;

  private registeredEmails: RegisteredEmail[];
  private partialGrades: PartialGrade[];
  private enrolledDisciplines: Discipline[] = [];
  private schedules: Schedule[];
  private history: History;
  private schoolGrade: SchoolGrade;
  private academicCalendar: Calendar;

  public isEnrolledAtDiscipline(discipline: Discipline): boolean {
    return this.enrolledDisciplines.filter((_discipline: any) => _discipline.getCode() === discipline.getCode()).length > 0;
  }

  public setProfile(profile: Profile): void {
    this.averageGrade = profile.averageGrade;
    this.birthday = profile.birthday;
    this.code = profile.code;
    this.course = profile.course;
    this.cpf = profile.cpf;
    this.email = profile.email;
    this.name = profile.name;
    this.period = profile.period;
    this.picture = profile.picture;
    this.progress = profile.progress;
    this.unit = profile.unit;
  }

  public getProfile(): Profile {
    return {
      averageGrade: this.averageGrade,
      birthday: this.birthday,
      code: this.code,
      course: this.course,
      cpf: this.cpf,
      email: this.email,
      name: this.name,
      period: this.period,
      picture: this.picture,
      progress: this.progress,
      unit: this.unit,
    };
  }

  public setPicture(picture: string): void {
    this.picture = picture;
  }

  public getPicture(): string {
    return this.picture;
  }

  public setAcademicCalendar(calendar: Calendar): void {
    this.academicCalendar = calendar;
  }

  public getAcademicCalendar(): Calendar {
    return this.academicCalendar;
  }

  public setSchoolGrade(schoolGrade: SchoolGrade): void {
    this.schoolGrade = schoolGrade;
  }

  public getSchoolGrade(): SchoolGrade {
    return this.schoolGrade;
  }

  public setHistory(history: History): void {
    this.history = history;
  }

  public getHistory(): History {
    return this.history;
  }

  public setSchedules(schedules: Schedule[]): void {
    this.schedules = schedules;
  }

  public getSchedules(): Schedule[] {
    return this.schedules;
  }

  public getEnrolledDisciplineByCode(code: string): Discipline {
    return this.enrolledDisciplines.filter((d: any) => d.getCode() === code)[0];
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public setRegisteredEmails(registeredEmails: RegisteredEmail[]): void {
    this.registeredEmails = registeredEmails;
  }

  public getRegisteredEmails(): RegisteredEmail[] {
    return this.registeredEmails;
  }

  public setPartialGrades(partialGrades: PartialGrade[]): void {
    this.partialGrades = partialGrades;
  }

  public getPartialGrades(): PartialGrade[] {
    return this.partialGrades;
  }

  public setEnrolledDisciplines(disciplines: Discipline[]): void {
    disciplines.forEach((discipline: any) => this.setEnrolledDiscipline(discipline));
  }

  public setEnrolledDiscipline(discipline: Discipline): void {
    if (this.isEnrolledAtDiscipline(discipline)) {
      this.updateDiscipline(discipline);
    } else {
      this.enrolledDisciplines.push(discipline);
    }
  }

  public getEnrolledDisciplineIndexByCode(code: string): number {
    return this.enrolledDisciplines.indexOf(this.getEnrolledDisciplineByCode(code));
  }

  public getEnrolledDisciplines(): Discipline[] {
    return this.enrolledDisciplines;
  }

  private updateDiscipline(discipline: Discipline) {
    const index = this.getEnrolledDisciplineIndexByCode(discipline.getCode());
    this.enrolledDisciplines[index] = {
      ...this.enrolledDisciplines[index],
      ...JSON.parse(JSON.stringify(discipline)),
    };
  }

}
