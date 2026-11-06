import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { budget, settlement, total } from '../app/lib/misato/data';
import { misatoGraph } from '../app/lib/misato/graph';

test('町の資料の合計と決算収支（当初予算は千円単位、決算は円単位）', () => {
  // 令和8年度当初予算書・説明書「1 総括」: 歳入・歳出とも 6,647,392 千円（66億4,739万2,000円）
  assert.equal(total(budget.revenue), 6647392);
  assert.equal(total(budget.expenditure), 6647392);
  // 令和7年度決算書: 歳入 6,987,179,904 円、歳出 6,426,160,211 円、差引 561,019,693 円
  assert.equal(total(settlement.revenue), 6987179904);
  assert.equal(total(settlement.expenditure), 6426160211);
  assert.equal(total(settlement.revenue) - total(settlement.expenditure), 561019693);
  // 実質収支 = 差引 − 翌年度繰越額（決算書歳出表の翌年度繰越額合計 105,931,000 円）
  assert.equal(settlement.carryover, 105931000);
  assert.equal(total(settlement.revenue) - total(settlement.expenditure) - settlement.carryover, 455088693);
});
test('図は実際の集計額を円へ換算し会計への入出を釣り合わせる', () => {
  for (const data of [budget, settlement]) {
    const {nodes, links} = misatoGraph(data);
    const incoming = links.filter(l => l.target === 'account').reduce((s,l) => s+l.value, 0);
    const outgoing = links.filter(l => l.source === 'account').reduce((s,l) => s+l.value, 0);
    assert.equal(incoming, total(data.revenue) * data.yenPerUnit);
    assert.equal(outgoing, incoming);
    assert.equal(nodes.find(n => n.id === 'balance')?.value ?? 0, (total(data.revenue)-total(data.expenditure))*data.yenPerUnit);
  }
});
