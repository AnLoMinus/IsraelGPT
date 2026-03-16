import React from 'react';

export const ShemaYisrael = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className={`max-w-2xl mx-auto text-center space-y-6 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
    <h3 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">קריאת שמע</h3>
    <p className="text-3xl leading-loose font-serif font-bold">
      שְׁמַע יִשְׂרָאֵל ה' אֱלֹהֵינוּ ה' אֶחָד.
    </p>
    <p className="text-xl leading-loose font-serif text-slate-500 dark:text-slate-400">
      בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד.
    </p>
    <p className="text-xl leading-loose font-serif mt-6">
      וְאָהַבְתָּ אֵת ה' אֱלֹהֶיךָ, בְּכָל לְבָבְךָ וּבְכָל נַפְשְׁךָ וּבְכָל מְאֹדֶךָ.<br/>
      וְהָיוּ הַדְּבָרִים הָאֵלֶּה, אֲשֶׁר אָנֹכִי מְצַוְּךָ הַיּוֹם, עַל לְבָבֶךָ.<br/>
      וְשִׁנַּנְתָּם לְבָנֶיךָ וְדִבַּרְתָּ בָּם, בְּשִׁבְתְּךָ בְּבֵיתֶךָ וּבְלֶכְתְּךָ בַדֶּרֶךְ וּבְשָׁכְבְּךָ וּבְקוּמֶךָ.<br/>
      וּקְשַׁרְתָּם לְאוֹת עַל יָדֶךָ, וְהָיוּ לְטֹטָפֹת בֵּין עֵינֶיךָ.<br/>
      וּכְתַבְתָּם עַל מְזֻזוֹת בֵּיתֶךָ וּבִשְׁעָרֶיךָ.
    </p>
    <div className={`mt-12 p-6 rounded-2xl text-right border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100'}`}>
      <h4 className="font-bold mb-3 text-lg flex items-center gap-2">
        <span className="text-xl">📖</span> משמעות:
      </h4>
      <ul className="list-disc list-inside space-y-2 text-lg opacity-90">
        <li>הצהרת אמונה בייחוד ה' ובמלכותו.</li>
        <li>התחייבות לאהבת ה' וללימוד התורה בכל עת.</li>
      </ul>
    </div>
  </div>
);
