import { DOMAIN } from '../constants';

export const strDate = (date: string) => {
  if (date.indexOf('/') === 2) {
    return new Date(date.split('/').reverse().join('-') + ' 00:00:00');
  }
  const nullDate = /(0{4})-(0{2})-(0{2})(T(0{2}):(0{2}):(0{2}))?/;
  if (nullDate.test(date)) {
    return new Date(0);
  }
  if (isNaN(Date.parse(date))) {
    return null;
  }
  return new Date(date);

};

export const getProfilePictureUrl = (url) => {
  const [, image] = url.split('/image//');
  return '/image/' + image;
};

export const getAcademicUrl = (url) => {
  const [, uri] = url.split(DOMAIN);
  return uri;
};

export const strNumber = (n: string) => {
  return isNaN(parseFloat(n)) ? 0 : parseFloat(n);
};

export const nBoolean = (n: number) => {
  return n === 1 ? true : false;
};

export const parseGxState = (gxState: string) => {
  let data: any;
  try {
    data = JSON.parse(gxState);
  } catch (e) {
    data = JSON.parse(gxState.replace(/\\>/g, '&gt'));
  }
  return data;
};

export const image = (base64Buffer: Buffer) => {
  if (!base64Buffer) {
    return '';
  }
  return `data:image/jpeg;base64,${base64Buffer.toString('base64')}`;
};
