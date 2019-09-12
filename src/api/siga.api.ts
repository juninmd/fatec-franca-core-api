import * as cheerio from 'cheerio';
import { ROUTES } from '../constants';
import { getAcademicUrl, getProfilePictureUrl, image, nBoolean, parseGxState, strDate, strNumber } from '../core/parser.core';
import { makeRequest, MakeRequest, makeScrap, MakeScrap } from '../core/request.core';
import Calendar from '../models/calendar.model';
import Discipline from '../models/discipline.model';
import Evaluation from '../models/evaluation.model';
import HistoryStudent from '../models/history-student.model';
import Schedule from '../models/schedule.model';
import SchoolGrade from '../models/school-grad.modele';

export const login = async ({ username, password }) => {

  try {
    const options: any = {
      method: 'post',
      form: {
        vSIS_USUARIOID: username,
        vSIS_USUARIOSENHA: password,
      },
      url: ROUTES.LOGIN,
    };

    const html = await makeRequest(options);
    if (!html) {
      throw new Error('Não logado');
    }

    const $ = cheerio.load(html);
    const error = $('.ErrorViewer').map((_i, e) => $(e).text()).get().join('\n');
    throw new Error(error);

  } catch (error) {
    if (error.statusCode === 303) {
      return error.response.hasOwnProperty('headers') && error.response.headers['set-cookie'].join(';');
    }
    throw new Error('Não logado');
  }
};

export const getName = (cookie) => {
  const options: MakeScrap = {
    cookie,
    url: ROUTES.HOME,
    scrapper: ($) => {
      const name = $('#span_MPW0041vPRO_PESSOALNOME').text();
      return name.trim().replace(/  /g, '').replace(/-/g, '');
    },
  };
  return makeScrap(options);
};

export const getProfile = (cookie) => {

  let profile: any = {};

  const optionsProfile: MakeScrap = {
    cookie,
    url: ROUTES.HOME,
    scrapper: async ($) => {
      const data = parseGxState($('[name=GXState]').val());
      profile = {
        profile,
        ...{
          averageGrade: strNumber(data['MPW0040vACD_ALUNOCURSOINDICEPR']),
          code: data['MPW0040vACD_ALUNOCURSOREGISTROACADEMICOCURSO'],
          course: data['vACD_CURSONOME_MPAGE'],
          name: data['MPW0040vPRO_PESSOALNOME'],
          period: data['vACD_PERIODODESCRICAO_MPAGE'],
          progress: strNumber(data['MPW0040vACD_ALUNOCURSOINDICEPP']),
          unit: data['vUNI_UNIDADENOME_MPAGE'],
        },
      };

      const optionsPicture: MakeRequest = {
        isImage: true,
        url: getProfilePictureUrl($('#MPW0041FOTO img').attr('src')),
        method: 'get',
        form: undefined,
      };

      const buffer = await makeRequest(optionsPicture);
      profile.picture = image(buffer);

      const optionsDetails: MakeScrap = {
        cookie,
        url: ROUTES.EXCHANGE_PROGRAMS,
        scrapper: ($exchange) => {
          profile.email = $exchange('#span_vPRO_PESSOALEMAIL').text();
          profile.cpf = $exchange('#span_vPRO_PESSOALDOCSCPF').text();
          profile.birthday = strDate($exchange('#span_vPRO_PESSOALDATANASCIMENTO').text());
          return profile;
        },
      };
      return makeScrap(optionsDetails);
    },
  };
  return makeScrap(optionsProfile);
};

export const getAcademicCalendar = (cookie) => {

  const optionsAcademic: MakeScrap = {
    cookie,
    url: ROUTES.ACADEMIC_CALENDAR,
    scrapper: ($$) => {

      const academicUrl = getAcademicUrl($$('[name="Embpage1"]').attr('src'));

      const optionsDetails: MakeScrap = {
        cookie,
        url: academicUrl,
        method: 'get',
        scrapper: ($) => {
          const thisYear = (new Date()).getFullYear();
          const months = [
            'W0002JANEIRO',
            'W0002FEVEREIRO',
            'W0002MARCO',
            'W0002ABRIL',
            'W0002MAIO',
            'W0002JUNHO',
            'W0002JULHO',
            'W0002AGOSTO',
            'W0002SETEMBRO',
            'W0002OUTUBRO',
            'W0002NOVEMBRO',
            'W0002DEZEMBRO',
          ];
          const calendar = months.map((month, monthIndex) => {
            let events = $(`#${month} tr > td:not([bgcolor="#FFFF00"]) > font[color="#FF0000"]`).contents();
            events = events.map((_i, e) => e.data).get();
            return {
              events: events.reduce((_events, event) => {
                event = event.trim();
                if (event.length) {
                  event = event.split('-');
                  event = {
                    date: new Date(thisYear, monthIndex, strNumber(event[0])),
                    name: event[1].trim(),
                    reason: event[2].trim(),
                  };
                  _events.push(event);
                }
                return _events;
                // tslint:disable-next-line: align
              }, []),
            };
          });

          return new Calendar(calendar);
        },
      };
      return makeScrap(optionsDetails);
    },
  };

  return makeScrap(optionsAcademic);
};

export const getSchoolGrade = (cookie) => {

  const options: MakeScrap = {
    cookie,
    url: ROUTES.SCHOOL_GRADE,
    scrapper: ($) => {
      const semesters = $('#TABLE1 table [valign=TOP]').map((i, el) => {
        const item: any = {};
        item.number = i + 1;
        item.disciplines = $(el).find(':scope div').map((_, div) => {
          const $discipline = $(div);
          const data = $discipline.find('tr td').map((_i: any, td: any) => {
            const $td = $(td);
            const str = $td.text().trim();
            if (str.indexOf('NF:') > -1) {
              return [
                $td.contents().not($td.children()).text(),
              ].concat($td.find('b').map((_i, b) => $(b).text().trim()).get());
            }
            return str;
          }).get();

          const stateCodes = {
            '#418a58': 'dismissed',
            '#75fa9f': 'approved',
            '#b2d4fd': 'attending',
            '#ffffff': 'not-attended',
          };

          const state: any = stateCodes[$discipline.css('background-color').toLowerCase()];
          const discipline: any = {
            classHours: strNumber(data[1].replace('AS:', '')),
            code: data[0],
            name: data[2],
            state,
          };

          if (data.length > 3) {
            discipline.period = data[6];
            discipline.frequency = strNumber(data[5]);
            discipline.grade = strNumber(data[4]);
          }

          return new Discipline(discipline);
        }).get();

        return item;
      }).get();

      return new SchoolGrade(semesters);
    },
  };
  return makeScrap(options);
};

export const getHistory = (cookie) => {

  const options: MakeScrap = {
    cookie,
    url: ROUTES.HISTORY,
    scrapper: ($) => {
      const data = JSON.parse($('[name=Grid1ContainerDataV]').attr('value'));
      const approvedCheckboxStr = 'Resources/checkTrue.png';
      const entries = data.map((entry) => {
        const discipline: any = { code: entry[0], name: entry[1] };
        const observation = entry[7];

        if (entry[3] === approvedCheckboxStr) {
          discipline.state = 'approved';
        } else if (observation === 'Em Curso') {
          discipline.state = 'attending';
        } else {
          discipline.state = 'not-attended';
        }
        discipline.approved = discipline.state === 'approved';
        discipline.absenses = strNumber(entry[6]);
        discipline.frequency = strNumber(entry[5]);
        discipline.grade = strNumber(entry[4]);
        discipline.period = entry[2];

        return {
          discipline: new Discipline(discipline),
          observation,
        };
      });
      return new HistoryStudent(entries);
    },
  };
  return makeScrap(options);

};

export const getSchedules = (cookie) => {

  const options: MakeScrap = {
    cookie,
    url: ROUTES.SCHEDULE,
    scrapper: ($) => {
      const tags = [
        "[name='Grid2ContainerDataV']",
        "[name='Grid3ContainerDataV']",
        "[name='Grid4ContainerDataV']",
        "[name='Grid5ContainerDataV']",
        "[name='Grid6ContainerDataV']",
        "[name='Grid7ContainerDataV']",
      ];

      const disciplinesRaw = JSON.parse($('[name=GXState]').val().replace(/\\>/g, '&gt')).vALU_ALUNOHISTORICOITEM_SDT;

      const disciplines = disciplinesRaw.map((d) => {

        const [name, hours] = d.ACD_DisciplinaNome.replace('&gt', '').split('<br');

        return {
          name,
          frequency: hours,
          teacher: d.Pro_PessoalNome,
          code: d.ACD_DisciplinaSigla,
        };
      });

      const schedules = tags.map((tag, index) => {
        const data = JSON.parse($(tag).attr('value'));

        return {
          periods: data.map((period) => {
            let [startAt, endAt] = period[1].split('-');
            const now = new Date();
            const periodTime = new Date();

            now.setMilliseconds(0);
            now.setSeconds(0);
            periodTime.setMilliseconds(0);
            periodTime.setSeconds(0);
            const [startHours, startMinutes] = startAt.split(':');
            const [endHours, endMinutes] = endAt.split(':');
            const weekday = index + 1;
            const isSameWeekday = now.getDay() === weekday;

            periodTime.setMinutes(parseInt(startMinutes));
            periodTime.setHours(parseInt(startHours));

            if ((isSameWeekday && +now > +periodTime) || (now.getDay() > weekday)) {
              now.setDate(now.getDate() + 7);
            } else {
              now.setDate(now.getDate() + (weekday - now.getDay()));
            }

            startAt = new Date(+now);
            startAt.setMinutes(parseInt(startMinutes));
            startAt.setHours(parseInt(startHours));

            endAt = new Date(+now);
            endAt.setMinutes(parseInt(endMinutes));
            endAt.setHours(parseInt(endHours));

            const code = period[2];
            const classroomCode = period[3];

            const detail = disciplines.find((q: any) => q.code === code);

            const discipline = new Discipline({ code, classroomCode, frequency: detail.frequency, name: detail.name, teacherName: detail.teacher });

            return { discipline, endAt, startAt };
          }),
          weekday: index + 1,
        };
      });

      return schedules.map((schedule: any) => new Schedule(schedule));
    },
  };

  return makeScrap(options);
};

export const getRegisteredEmails = (cookie) => {

  const options: MakeScrap = {
    cookie,
    url: ROUTES.HOME,
    scrapper: ($) => {
      const email = $('#span_vPRO_PESSOALEMAIL').text();
      return email;
    },
  };
  return makeScrap(options);
};

export const getPartialGrades = (cookie) => {

  const options: MakeScrap = {
    cookie,
    url: ROUTES.PARTIAL_GRADES,
    scrapper: ($) => {
      let data = $('[name=GXState]').val();
      data = JSON.parse(data.replace(/\\>/g, '&gt')).Acd_alunonotasparciais_sdt;
      const partialGrades = (data.map((line) => {
        let disciplineState;
        const approved: boolean = nBoolean(line['ACD_AlunoHistoricoItemAprovada']);
        const quited: boolean = Number(strDate(line['ACD_AlunoHistoricoItemDesistenciaData']))! !== 0;

        if (quited) {
          disciplineState = 'quited';
        } else if (approved) {
          disciplineState = 'approved';
        } else {
          disciplineState = 'attending';
        }

        const discipline = new Discipline({
          classroomId: line['ACD_AlunoHistoricoItemTurmaId'],
          code: line['ACD_DisciplinaSigla'],
          courseId: line['ACD_CursoId'],
          frequency: line['ACD_AlunoHistoricoItemFrequencia'],
          grade: line['ACD_AlunoHistoricoItemMediaFinal'],
          name: line['ACD_DisciplinaNome'],
          periodId: line['ACD_Periodoid'],
          quitDate: strDate(line['ACD_AlunoHistoricoItemDesistenciaData']),
          state: disciplineState,
          teacherId: line['ACD_AlunoHistoricoItemProfessorId'],
        });

        return {
          discipline,
          evaluations: line['Avaliacoes'].map((evaluation) => {
            return new Evaluation({
              applyDates: {
                applied: strDate(evaluation['ACD_PlanoEnsinoAvaliacaoDataProva'])!,
                predicted: strDate(evaluation['ACD_PlanoEnsinoAvaliacaoDataPrevista'])!,
                published: strDate(evaluation['ACD_PlanoEnsinoAvaliacaoDataPublicacao'])!,
              },
              code: evaluation['ACD_PlanoEnsinoAvaliacaoSufixo'],
              description: evaluation['ACD_PlanoEnsinoAvaliacaoDescricao'],
              grades: evaluation.Notas.map((grade) => {
                return {
                  date: strDate(grade['ACD_PlanoEnsinoAvaliacaoParcialDataLancamento']),
                  score: grade['ACD_PlanoEnsinoAvaliacaoParcialNota'],
                };
              }),
              title: evaluation['ACD_PlanoEnsinoAvaliacaoTitulo'],
              weight: strNumber(evaluation['ACD_PlanoEnsinoAvaliacaoPeso']),
            });
          }),
        };
      }));
      return partialGrades;
    },
  };
  return makeScrap(options);
};

export const getEnrolledDisciplines = (cookie) => {

  const options: MakeScrap = {
    cookie,
    url: ROUTES.PARTIAL_ABSENSES,
    scrapper: ($$) => {
      let data = $$('[name=GXState]').val();
      data = JSON.parse(data.replace(/\\>/g, '&gt')).vFALTAS;

      const optionsDetails: MakeScrap = {
        cookie,
        url: ROUTES.SCHEDULE,
        scrapper: ($) => {
          let scheduleData = $('[name=GXState]').val();
          scheduleData = JSON.parse(scheduleData.replace(/\\>/g, '&gt')).vALU_ALUNOHISTORICOITEM_SDT;
          const enrolledDisciplines = (data.map((line) => {
            const scheduleDiscipline = scheduleData.filter((d) => {
              return d['ACD_DisciplinaSigla'] === line['ACD_DisciplinaSigla'].trim();
            })[0];

            return new Discipline({
              absenses: line['TotalAusencias'],
              classroomCode: scheduleDiscipline['ACD_TurmaLetra'],
              classroomId: line['ACD_AlunoHistoricoItemTurmaId'],
              code: line['ACD_DisciplinaSigla'].trim(),
              courseId: line['ACD_AlunoHistoricoItemCursoId'],
              name: line['ACD_DisciplinaNome'],
              periodId: line['ACD_Periodoid'],
              presences: line['TotalPresencas'],
              teacherId: line['ACD_AlunoHistoricoItemProfessorId'],
              teacherName: scheduleDiscipline['Pro_PessoalNome'],
            });
          }));
          return enrolledDisciplines;
        },
      };
      return makeScrap(optionsDetails);
    },
  };
  return makeScrap(options);
};