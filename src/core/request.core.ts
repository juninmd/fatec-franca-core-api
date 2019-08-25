import * as cheerio from 'cheerio';
import * as request from 'request-promise-native';
import { DOMAIN } from '../constants';

const scrapperCache = {};

export interface MakeScrap {
  url: string;
  scrapper: any;
  cookie: string;
  method?: 'get' | 'post';
}

export const makeScrap = async (options: MakeScrap) => {

  const { cookie, url, scrapper } = options;

  if (!scrapperCache[cookie]) {
    scrapperCache[cookie] = {};
  }
  if (scrapperCache[cookie][url]) {
    if (!scrapperCache[cookie][url].isExpired()) {
      return scrapper(scrapperCache[cookie][url].$);
    }
    scrapperCache[cookie][url] = null;
  }

  if (!cookie) {
    throw new Error('Missing cookie, try logging in');
  }

  const optionsRequest: MakeRequest = {
    form: undefined,
    method: options.method ? options.method : 'post',
    url,
    cookie,
  };

  const response = await makeRequest(optionsRequest);

  const $ = cheerio.load(response, { decodeEntities: true });
  const createdAt = +new Date();
  const duration = 1000 * 60 * 5;
  scrapperCache[cookie][url] = {
    $,
    isExpired() {
      return +new Date() > (createdAt + duration);
    },
  };
  return scrapper($);
};

export interface MakeRequest {
  url: string;
  method: 'post' | 'get';
  form: any;
  cookie?: string;
  isImage?: boolean;
}
export const makeRequest = async (config: MakeRequest) => {
  const baseConfig: any = {
    encoding: config.isImage ? 'base64' : undefined,
    form: {
      GXState: '{"_EventName":"EENTER.","_EventGridId":"","_EventRowId":"",' +
        '"MPW0005_CMPPGM":"login_top.aspx","MPW0005GX_FocusControl":"","vREC_' +
        'SIS_USUARIOID":"","GX_FocusControl":"vSIS_USUARIOID","GX_AJAX_KEY":"' +
        '0BDD4711481AA1585555288A38D54A0E","AJAX_SECURITY_TOKEN":"60D2197ED30' +
        'EA865BA4DDC1181C00E9DE327E1CD49D496228104BEF231E87A2D","GX_CMP_OBJS"' +
        ':{"MPW0005":"login_top"},"sCallerURL":"","GX_RES_PROVIDER":"GXResour' +
        'ceProvider.aspx","GX_THEME":"GeneXusX","_MODE":"","Mode":"","IsModif' +
        'ied":"1"}',
      ...config.form,
    },
    headers: {
      ...config.cookie && { ['cookie']: config.cookie },
      ...config.method === 'post' && { ['Content-Type']: 'application/x-www-form-urlencoded' },
      ['Origin']: DOMAIN,
      ['User-Agent']: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    },
    method: config.method ? config.method.toUpperCase() : 'POST',
    params: {
      '165c97fac0d4c1ad6055e3730b7af070,,gx-no-cache': 1513131652687,
    },
    uri: DOMAIN + config.url,
  };
  try {

    return await request(baseConfig);

  } catch (error) {
    console.log(baseConfig.uri, baseConfig.method, config.isImage);
    throw error;
  }
};