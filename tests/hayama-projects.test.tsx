import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import projects from '../app/lib/hayama/projects.json';
import { filterHayamaProjects } from '../app/lib/hayama/project-search';
import { ProjectsView } from '../client/components/hayama/ProjectsView';
import { HayamaView } from '../client/components/hayama/HayamaView';

// tsx uses the repository's JSX-preserve config outside Next's compiler.
Object.assign(globalThis, { React });

test('実施計画から収録した事業の出典・年度・重複', () => {
  assert.equal(projects.length, 169);
  assert.equal(new Set(projects.map(p => `${p.account}-${p.id}`)).size, projects.length);
  assert.deepEqual(projects.find(p => p.id === '001979'), { id: '001979', account: '一般会計', code: '2-1-2', name: '教育・保育給付支給事業', department: '子ども育成課', policy: '子育て・子育ち', amount: 995284, page: 68 });
  assert(projects.every(p => p.page >= 19 && p.page <= 276 && Number.isInteger(p.amount) && p.amount >= 0));
});
test('事業名検索と施策・担当課の条件を組み合わせる', () => {
  const found = filterHayamaProjects(projects, { query: '教育・保育給付', policy: '子育て・子育ち', department: '子ども育成課', code: '2-1-2' });
  assert.deepEqual(found.map(p => p.id), ['001979']);
  assert.equal(filterHayamaProjects(projects, { query: '教育・保育給付', policy: '', department: '環境課', code: '' }).length, 0);
});
test('出典・収録範囲・評価未収録・AI整理と問い合わせ先を表示', () => {
  const list = renderToStaticMarkup(React.createElement(ProjectsView));
  const home = renderToStaticMarkup(React.createElement(HayamaView));
  assert.match(list, /2026年度当初予算/);
  assert.match(list, /町の全事業一覧ではありません/);
  assert.match(list, /評価データ未収録/);
  assert.match(list, /2026jisshikeikaku\.pdf#page=68/);
  assert.match(home, /AIを使って町の公開資料を整理/);
  assert.match(home, /正確な内容は町の原資料をご確認/);
  assert.match(home, /https:\/\/x\.com\/yasuaki_jp/);
});
