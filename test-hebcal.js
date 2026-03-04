import { HDate, Sedra, Locale } from '@hebcal/core';
import { DafYomi } from '@hebcal/learning';

const today = new HDate();
console.log("Today:", today.toString());

try {
  const daf = new DafYomi(today);
  console.log("Daf Yomi:", daf.render('he'));
} catch (e) {
  console.log("Daf Yomi error:", e.message);
}
