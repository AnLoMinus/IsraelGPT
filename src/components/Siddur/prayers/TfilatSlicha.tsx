import React from 'react';

export const TfilatSlicha = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className={`max-w-2xl mx-auto text-center space-y-6 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
    <h3 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">תפילת סליחה ותשובה</h3>
    <p className="text-2xl leading-loose font-serif">
      רִבּוֹנוֹ שֶׁל עוֹלָם,<br/>
      חָטָאנוּ לְפָנֶיךָ בַּגָּלוּי וּבַנִּסְתָּר.<br/><br/>
      סְלַח לָנוּ, מְחַל לָנוּ, כַּפֶּר לָנוּ.<br/><br/>
      וְתַעְזְרֵנוּ לָשׁוּב אֵלֶיךָ בֶּאֱמֶת,<br/>
      וּלְתַקֵּן דְּרָכֵינוּ וּמַעֲשֵׂינוּ.
    </p>
    <div className={`mt-12 p-6 rounded-2xl text-right border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100'}`}>
      <h4 className="font-bold mb-3 text-lg flex items-center gap-2">
        <span className="text-xl">📖</span> משמעות:
      </h4>
      <ul className="list-disc list-inside space-y-2 text-lg opacity-90">
        <li>הודאה בחטאים ובקשת סליחה וכפרה.</li>
        <li>התחייבות לתיקון הדרכים והשיבה אל ה'.</li>
      </ul>
    </div>
  </div>
);
