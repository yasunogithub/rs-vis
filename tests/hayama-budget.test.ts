import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { budget, settlement, total } from '../app/lib/hayama/data';
import { hayamaGraph } from '../app/lib/hayama/graph';

test('町の資料の千円単位の合計と決算収支', () => {
  assert.equal(total(budget.revenue), 13603704);
  assert.equal(total(budget.expenditure), 13603704);
  assert.equal(total(settlement.revenue), 14745806);
  assert.equal(total(settlement.expenditure), 13703002);
  assert.equal(total(settlement.revenue) - total(settlement.expenditure), 1042804);
  assert.equal(total(settlement.revenue) - total(settlement.expenditure) - settlement.carryover, 799585);
});
test('図は実際の集計額を円へ換算し会計への入出を釣り合わせる', () => {
  for (const data of [budget, settlement]) {
    const {nodes, links} = hayamaGraph(data);
    const incoming = links.filter(l => l.target === 'account').reduce((s,l) => s+l.value, 0);
    const outgoing = links.filter(l => l.source === 'account').reduce((s,l) => s+l.value, 0);
    assert.equal(incoming, total(data.revenue) * 1000);
    assert.equal(outgoing, incoming);
    assert.equal(nodes.find(n => n.id === 'balance')?.value ?? 0, (total(data.revenue)-total(data.expenditure))*1000);
  }
});
