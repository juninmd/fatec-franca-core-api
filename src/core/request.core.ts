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
      GXState: '{"_EventName":"E\\\'EVT_CONFIRMAR\\\'.","_EventGridId":"","_EventRowId":"","MPW0005_CMPPGM":"login_top.aspx","MPW0005GX_FocusControl":"","vSAIDA":"","vREC_SIS_USUARIOID":"","GX_FocusControl":"vSIS_USUARIOID","GX_AJAX_KEY":"5D987297E9F755F2052325C126E1B0BD","AJAX_SECURITY_TOKEN":"81BEC8A773B479F80AB961F0F34AE8A955FFB25EE2C0038DAA4F6627B9250D53","GX_CMP_OBJS":{"MPW0005":"login_top"},"sCallerURL":"","GX_RES_PROVIDER":"GXResourceProvider.aspx","GX_THEME":"GeneXusX","_MODE":"","Mode":"","IsModified":"1"}',
      ...config.form,
    },
    headers: {
      ...config.cookie && { ['cookie']: config.cookie },
      ...config.method === 'post' && { ['Content-Type']: 'application/x-www-form-urlencoded' },
      ['Origin']: DOMAIN,
      ['User-Agent']: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0',
    },
    method: config.method ? config.method.toUpperCase() : 'POST',
    qs: {
      '6f0bc74644f69460f52750a60c7e0956,gx-no-cache': 1567097707476,
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