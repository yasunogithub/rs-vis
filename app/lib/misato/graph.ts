import type { MOFBudgetNodeDetails } from '@/types/mof-budget-overview';
import type { SankeyLink, SankeyNode } from '@/types/sankey';
import { total, type MisatoData } from './data';

type Node = SankeyNode & { name: string; details: MOFBudgetNodeDetails };
/** 町資料の集計値をそのまま会計ノードに接続する。個別財源の使途対応は表さない。金額は資料の単位から円へ換算する。 */
export function misatoGraph(data: MisatoData): { nodes: Node[]; links: SankeyLink[] } {
  const unit = data.yenPerUnit;
  const incoming = total(data.revenue), outgoing = total(data.expenditure);
  if (incoming < outgoing) throw new Error('歳出が歳入を超えるため、この図では表現できません');
  const nodes: Node[] = [{ id: 'account', name: '一般会計', type: 'account', value: incoming * unit, details: { nodeType: 'account' } }];
  const links: SankeyLink[] = [];
  data.revenue.forEach(([name, value], i) => {
    if (!value) return;
    const id = `revenue-${i}`;
    nodes.push({ id, name, type: 'source', value: value * unit, details: { nodeType: 'source' } });
    links.push({ source: id, target: 'account', value: value * unit });
  });
  data.expenditure.forEach(([name, value], i) => {
    if (!value) return;
    const id = `expense-${i}`;
    nodes.push({ id, name, type: 'net-expenditure', value: value * unit, details: { nodeType: 'net-expenditure' } });
    links.push({ source: 'account', target: id, value: value * unit });
  });
  if (incoming > outgoing) {
    nodes.push({ id: 'balance', name: '歳入歳出差引額', type: 'surplus', value: (incoming - outgoing) * unit, details: { nodeType: 'surplus', description: '繰越財源を除く前の差引額です。' } });
    links.push({ source: 'account', target: 'balance', value: (incoming - outgoing) * unit });
  }
  return { nodes, links };
}
