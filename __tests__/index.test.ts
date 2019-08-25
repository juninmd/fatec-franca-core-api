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
} from '../src/api/fatec.api';

async function init() {
  try {
    const sessionId = await login({ username: process.env.USERNAME, password: process.env.PASSWORD });
    console.log(sessionId);

    const name = await getName(sessionId);
    console.log(name);

    const profile = await getProfile(sessionId);
    console.log(profile);

    const aca = await getAcademicCalendar(sessionId);
    console.log(aca);

    const sg = await getSchoolGrade(sessionId);
    console.log(sg);

    const s = await getHistory(sessionId);
    console.log(s);

    const ss = await getSchedules(sessionId);
    console.log(ss);

    const re = await getRegisteredEmails(sessionId);
    console.log(re);

    const pg = await getPartialGrades(sessionId);
    console.log(pg);

    const ed = await getEnrolledDisciplines(sessionId);
    console.log(ed);

  } catch (error) {
    console.log(error);
  }
}
init();