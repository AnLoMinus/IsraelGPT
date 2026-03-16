import React from 'react';

export const TfilatHaAchdut = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className={`max-w-2xl mx-auto text-center space-y-6 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
    <h3 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">תפילת האחדות</h3>
    <p className="text-xl leading-loose font-serif">
      אָבִינוּ שֶׁבַּשָּׁמַיִם, צוּר יִשְׂרָאֵל וְגוֹאֲלוֹ,<br/>
      בָּרֵךְ אֶת עַמְּךָ יִשְׂרָאֵל בְּכָל מָקוֹם שֶׁהֵם.<br/>
      תֵּן בָּנוּ אַהֲבָה וְאַחֲוָה, שָׁלוֹם וְרֵעוּת,<br/>
      וְהָסֵר מִתּוֹכֵנוּ שִׂנְאַת חִנָּם וּמַחֲלוֹקֶת.<br/>
      עֲשֵׂה שֶׁנִּהְיֶה אֲגֻדָּה אַחַת לַעֲשׂוֹת רְצוֹנְךָ בְּלֵבָב שָׁלֵם,<br/>
      וְתַקְּנֵנוּ בְּעֵצָה טוֹבָה מִלְּפָנֶיךָ.<br/>
      אָמֵן.
    </p>
    <div className={`mt-12 p-6 rounded-2xl text-right border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100'}`}>
      <h4 className="font-bold mb-3 text-lg flex items-center gap-2">
        <span className="text-xl">📖</span> משמעות:
      </h4>
      <ul className="list-disc list-inside space-y-2 text-lg opacity-90">
        <li>בקשה לאחדות ושלום בתוך עם ישראל.</li>
        <li>הדגשת החשיבות של עבודה משותפת בלב שלם.</li>
      </ul>
    </div>
  </div>
);
