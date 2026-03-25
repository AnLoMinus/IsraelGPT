import { Biography } from './types';
import { abrahamBio } from './abraham';
import { mosesBio } from './moses';
import { davidBio } from './david';
import { rambamBio } from './rambam';
import { ravkookBio } from './ravkook';
import { rashiBio } from './rashi';
import { akivaBio } from './akiva';
import { hillelBio } from './hillel';
import {
  isaacBio, jacobBio, rachelBio, josephBio, reubenBio, simeonBio, leviBio,
  judahBio, issacharBio, zebulunBio, danBio, naphtaliBio, gadBio, asherBio,
  benjaminBio, solomonBio, elijahBio, jeremiahBio, deborahBio, miriamBio,
  estherBio, judahmaccabeeBio, rashbiBio, bruriaBio, beshtBio, nachmanBio,
  aryehlevinBio, chafetzchaimBio, rebbeBio, ovadiaBio
} from './additional';

// מפה של כל הביוגרפיות לפי מזהה הדמות (ID)
export const biographies: Record<string, Biography> = {
  abraham: abrahamBio,
  moses: mosesBio,
  david: davidBio,
  rambam: rambamBio,
  ravkook: ravkookBio,
  rashi: rashiBio,
  akiva: akivaBio,
  hillel: hillelBio,
  isaac: isaacBio,
  jacob: jacobBio,
  rachel: rachelBio,
  joseph: josephBio,
  reuben: reubenBio,
  simeon: simeonBio,
  levi: leviBio,
  judah: judahBio,
  issachar: issacharBio,
  zebulun: zebulunBio,
  dan: danBio,
  naphtali: naphtaliBio,
  gad: gadBio,
  asher: asherBio,
  benjamin: benjaminBio,
  solomon: solomonBio,
  elijah: elijahBio,
  jeremiah: jeremiahBio,
  deborah: deborahBio,
  miriam: miriamBio,
  esther: estherBio,
  judahmaccabee: judahmaccabeeBio,
  rashbi: rashbiBio,
  bruria: bruriaBio,
  besht: beshtBio,
  nachman: nachmanBio,
  aryehlevin: aryehlevinBio,
  chafetzchaim: chafetzchaimBio,
  rebbe: rebbeBio,
  ovadia: ovadiaBio,
};

export const getBiography = (id: string): Biography | undefined => {
  return biographies[id];
};
