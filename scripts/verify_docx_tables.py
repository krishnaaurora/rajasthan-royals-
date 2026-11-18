import docx

doc = docx.Document("SupeRR_Selector_Round1_Report.docx")
print("Total tables in document:", len(doc.tables))

for t_idx, t in enumerate(doc.tables):
    first_row = [c.text.strip().replace('\n', ' ') for c in t.rows[0].cells]
    print(f"\n--- TABLE {t_idx} ({len(t.rows)} rows, {len(t.columns)} cols) ---")
    print("Header:", first_row)
    
    # Check tblHeader on row 0
    trPr0 = t.rows[0]._tr.find(docx.oxml.ns.qn('w:trPr'))
    has_tblHeader = trPr0 is not None and len(trPr0.findall(docx.oxml.ns.qn('w:tblHeader'))) > 0
    print("Has w:tblHeader:", has_tblHeader)
    
    # Check cantSplit on rows
    cant_split_count = 0
    for r in t.rows:
        trPr = r._tr.find(docx.oxml.ns.qn('w:trPr'))
        if trPr is not None and len(trPr.findall(docx.oxml.ns.qn('w:cantSplit'))) > 0:
            cant_split_count += 1
    print(f"Rows with w:cantSplit: {cant_split_count}/{len(t.rows)}")
    
    if len(t.columns) == 10:
        for r_i, r in enumerate(t.rows[1:11]):
            cells_text = [c.text.strip().replace('\n', ' ') for c in r.cells]
            print(f"  Row {r_i+1}: {cells_text[0]} | {cells_text[1]} | Balls: {cells_text[3]} | HP: {cells_text[4]} | Base: {cells_text[5]} | Delta: {cells_text[6]} | PRI: {cells_text[7]} | Sim%: {cells_text[8]} | Jaipur%: {cells_text[9]}")
