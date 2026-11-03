/** 葉山町の公表資料を千円単位で記録する。 */
export const sources = {
  budget: 'https://www.town.hayama.lg.jp/material/files/group/3/20260904hosei.pdf',
  settlement: 'https://www.town.hayama.lg.jp/material/files/group/1/r7kessanngaiyou.pdf',
} as const;
type Item = readonly [string, number];
export type HayamaData = { title: string; year: number; source: string; revenue: readonly Item[]; expenditure: readonly Item[]; carryover: number };
export const budget: HayamaData = {
  title: '令和8年度 9月補正後予算', year: 2026, source: sources.budget, carryover: 0,
  revenue: [['町税',6276745],['国庫支出金',1622034],['地方交付税',1550000],['各種交付金',1008004],['県支出金',1010064],['繰越金',799585],['その他',639371],['繰入金',486600],['町債',147000],['地方譲与税',64301]],
  expenditure: [['民生費',5235349],['総務費',2212660],['衛生費',1508025],['教育費',1368874],['土木費',1265712],['消防費',780185],['公債費',590440],['商工費',334876],['議会費',182633],['予備費',80359],['農林水産業費',43591],['災害復旧費',1000]],
};
export const settlement: HayamaData = {
  title: '令和7年度 決算', year: 2025, source: sources.settlement, carryover: 243219,
  revenue: [['町税',6295772],['国庫支出金',1891132],['地方交付税',1605323],['各種交付金',1090878],['県支出金',1026715],['繰越金',839112],['繰入金',803800],['その他',774087],['町債',354500],['地方譲与税',64487]],
  expenditure: [['民生費',5114641],['総務費',2651330],['衛生費',1574676],['教育費',1428096],['土木費',1195966],['消防費',756319],['公債費',581385],['議会費',179140],['商工費',176035],['農林水産業費',45414],['災害復旧費',0]],
};
export const total = (items: readonly Item[]) => items.reduce((sum, [, amount]) => sum + amount, 0);
