#!/usr/bin/env python3
"""Extract only clearly-labelled R8 rows; requires PyMuPDF and pdftotext output.
Usage: python3 scripts/extract-hayama-plan.py SOURCE.pdf SOURCE-layout.txt > app/lib/hayama/projects.json
"""
import json
import re
import sys
from pathlib import Path
import pymupdf

pdf = pymupdf.open(sys.argv[1])
pages = Path(sys.argv[2]).read_text(encoding='utf8').split('\f')
records = []
seen = set()
for i, text in enumerate(pages):
    if i < 18 or i >= len(pdf):
        continue
    lines = text.splitlines()
    first = '\n'.join(lines[:12])
    # Some sheets in the R8 compilation are explicitly labelled R7: omit them.
    account = re.search(r'令和\s*8年度\s*(\d+)\s*(\S+)', first)
    code = re.search(r'施策コード\s*([^\n]+)', first)
    project_id = re.search(r'簡略番号\s*[:：]\s*(\d{6})', first)
    line = next((s for s in lines[:12] if '簡略番号' in s), '')
    name = re.search(r'\s(?:大|中|小|細)\s*\d+\s*(.*?)\s*[（(]簡略番号', line)
    dept = re.search(r'所属\s+\d{6,}(?:-\d+)?\s+(\S+)', first)
    field = re.search(r'【(?:政策分野|基盤分野)】([^\n]+)', text)
    if not (account and code and project_id and name and dept and field and '事 業 費' in first):
        continue
    # PDF uses fixed column positions: first amount of the "事業費" row,
    # not the other years or the right-hand evaluation table.
    words = pdf[i].get_text('words')
    amounts = [w[4] for w in words if 488 <= w[0] < 555 and 99 < w[1] < 104 and re.fullmatch(r'[\d,]+', w[4])]
    if len(amounts) != 1:
        continue
    key = (account.group(1), project_id.group(1))
    if key in seen:
        raise ValueError(f'duplicate account/project {key} on PDF page {i + 1}')
    seen.add(key)
    field_text = re.split(r'\s{2,}|【', field.group(1).strip())[0].strip()
    record = {
        'id': project_id.group(1), 'account': account.group(2),
        'code': re.sub(r'\s+', ' ', code.group(1).strip()),
        'name': name.group(1).strip().lstrip('★'), 'department': dept.group(1),
        'policy': field_text, 'amount': int(amounts[0].replace(',', '')), 'page': i + 1,
    }
    records.append(record)
print(json.dumps(records, ensure_ascii=False, indent=2))
