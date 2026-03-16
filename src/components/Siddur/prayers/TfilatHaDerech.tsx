import React from 'react';

export const TfilatHaDerech = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className={`max-w-2xl mx-auto text-center space-y-6 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
    <h3 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">בִּרְכַּת פְּתִיחַת הַיּוֹם</h3>
    <p className="text-2xl leading-loose font-serif" dir="rtl">
      יְהִי רָצוֹן מִלְּפָנֶיךָ ה' אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ,<br/>
      שֶׁתּוֹלִיכֵנוּ לְשָׁלוֹם וְתַצְעִידֵנוּ לְשָׁלוֹם,<br/>
      וְתַדְרִיכֵנוּ לְשָׁלוֹם,<br/>
      וְתַגִּיעֵנוּ לִמְחוֹז חֶפְצֵנוּ לְחַיִּים וּלְשִׂמְחָה וּלְשָׁלוֹם.<br/><br/>
      וְתַצִּילֵנוּ מִכַּף כָּל אוֹיֵב וְאוֹרֵב בַּדֶּרֶךְ,<br/>
      וּמִכָּל מִינֵי פֻּרְעָנִיּוֹת הַמִּתְרַגְּשׁוֹת לָבוֹא לָעוֹלָם.<br/><br/>
      וְתִשְׁלַח בְּרָכָה בְּכָל מַעֲשֵׂה יָדֵינוּ,<br/>
      וְתִתְּנֵנוּ לְחֵן וּלְחֶסֶד וּלְרַחֲמִים בְּעֵינֶיךָ וּבְעֵינֵי כָל רוֹאֵינוּ.<br/><br/>
      בָּרוּךְ אַתָּה ה', שׁוֹמֵעַ תְּפִלָּה.
    </p>
    
    <div className={`mt-12 p-6 rounded-2xl text-right border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100'}`}>
      <h4 className="font-bold mb-3 text-lg flex items-center gap-2">
        <span className="text-xl">📖</span> משמעות:
      </h4>
      <ul className="list-disc list-inside space-y-2 text-lg opacity-90">
        <li>בקשה להדרכה ושמירה בדרכי החיים.</li>
        <li>הדגשת החשיבות של חיבור לכלל ישראל כדי להינצל בדרכים.</li>
      </ul>
    </div>
  </div>
);
