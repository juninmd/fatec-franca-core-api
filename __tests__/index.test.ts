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

const sessionInvalid = 'ASP.NET_SessionId=44ogpbfi4jqero11yc2pqg45; path=/; HttpOnly';

describe('invalid token from siga', () => {

  it('name', async () => {
    try {
      await getName(sessionInvalid);
    } catch (error) {
      expect(error.message).toBe('Não logado');
    }
  });

  it('profile', async () => {
    try {
      await getProfile(sessionInvalid);
    } catch (error) {
      expect(error.message).toBe('Não logado');
    }
  });

  it('academic calendar', async () => {
    try {
      await getAcademicCalendar(sessionInvalid);
    } catch (error) {
      expect(error.message).toBe('Não logado');
    }
  });

  it('school grade', async () => {
    try {
      await getSchoolGrade(sessionInvalid);
    } catch (error) {
      expect(error.message).toBe('Não logado');
    }
  });

  it('history', async () => {
    try {
      await getHistory(sessionInvalid);
    } catch (error) {
      expect(error.message).toBe('Não logado');
    }
  });

  it('schedules', async () => {
    try {
      await getSchedules(sessionInvalid);
    } catch (error) {
      expect(error.message).toBe('Não logado');
    }
  });

  it('emails', async () => {
    try {
      await getRegisteredEmails(sessionInvalid);
    } catch (error) {
      expect(error.message).toBe('Não logado');
    }
  });

  it('partial grades', async () => {
    try {
      await getPartialGrades(sessionInvalid);
    } catch (error) {
      expect(error.message).toBe('Não logado');
    }
  });

  it('disciplines', async () => {
    try {
      await getEnrolledDisciplines(sessionInvalid);
    } catch (error) {
      expect(error.message).toBe('Não logado');
    }
  });

});