import {
  getAcademicCalendar,
  getEnrolledDisciplines,
  getHistory,
  getName,
  getPartialGrades,
  getProfile,
  getRegisteredEmails,
  getSchedules,
  getSchoolGrade,
  login,
} from '../src/api/siga.api';

let sessionId = '';
jest.setTimeout(10000);

describe('get data from siga', () => {

  it('login', async () => {
    const { USERNAME, PASSWORD } = process.env;
    sessionId = await login({ username: USERNAME, password: PASSWORD });
    expect(sessionId).toBeDefined();
  });

  it('name', async () => {
    const name = await getName(sessionId);
    expect(name).toBeDefined();
  });

  it('profile', async () => {
    const profile = await getProfile(sessionId);
    expect(profile).toBeDefined();
  });

  it('academic calendar', async () => {
    const aca = await getAcademicCalendar(sessionId);
    expect(aca).toBeDefined();
  });

  it('school grade', async () => {
    const sg = await getSchoolGrade(sessionId);
    expect(sg).toBeDefined();
  });

  it('history', async () => {
    const s = await getHistory(sessionId);
    expect(s).toBeDefined();
  });

  it('schedules', async () => {
    const ss = await getSchedules(sessionId);
    expect(ss).toBeDefined();
  });

  it('emails', async () => {
    const re = await getRegisteredEmails(sessionId);
    expect(re).toBeDefined();
  });

  it('partial grades', async () => {
    const pg = await getPartialGrades(sessionId);
    expect(pg).toBeDefined();
  });

  it('disciplines', async () => {
    const ed = await getEnrolledDisciplines(sessionId);
    expect(ed).toBeDefined();
  });

});
