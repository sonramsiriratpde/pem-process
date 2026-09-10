export interface ProcessItem {
  id: string;
  filePath: string;
  filename: string;
  title: string;
  titleTh: string;
  summary: string;
  category: 'as-is' | 'to-be' | 'reference' | 'template';
  department: 'Warehouse' | 'QA' | 'Purchase' | 'S&OP' | 'Accounting' | 'General';
  type: 'mermaid' | 'markdown';
  lanes: string[];
  stepCount: number;
  content: string;
}

export const PROCESS_ITEMS: ProcessItem[] = [
  {
    "id": "as-is_process-s-op-1-3_transfer_rm-mermaid",
    "filePath": "as-is_process/S&OP/1.3_transfer_rm.mermaid",
    "filename": "1.3_transfer_rm.mermaid",
    "title": "1.3 Internal Transfer RM (As-Is)",
    "titleTh": "การเบิกและโอนย้าย RM ในคลังสินค้า",
    "summary": "As-Is requisition and internal transfer of raw materials between Production and Warehouse.",
    "category": "as-is",
    "department": "S&OP",
    "type": "mermaid",
    "lanes": [
      "S&OP"
    ],
    "stepCount": 8,
    "content": "%% Internal Transfer Process Flow\nswimlane-beta TB\n\n  subgraph S&OP\n    start([เริ่มต้น])\n    a1[ขอย้าย FG]\n    a2[ตรวจสอบจำนวนคงคลัง]\n    a3{FG เพียงพอโอนย้ายหรือไม่}\n    a4[สร้างรายการโอนย้าย]\n    a5[ทำการโอนย้าย]\n    a6[ใบโอนย้ายสินค้าระหว่างคลัง]\n    done([สิ้นสุด])\n  end\n\n  %% Success Flows\n  start e1@--> a1\n  a1 e2@--> a2\n  a2 e3@--> a3\n  a3 e4@--> a4\n  a4 e5@--> a5\n  a5 e6@--> a6\n  a6 e7@--> done\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class done attention;\n  class a1 attention;\n  class a2 attention;\n  class a3 attention;\n  class a4 attention;\n  class a5 attention;\n  class a6 attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}\n  e7@{ animate: true}"
  },
  {
    "id": "as-is_process-warehouse-1-1_receipt_rm-mermaid",
    "filePath": "as-is_process/Warehouse/1.1_receipt_rm.mermaid",
    "filename": "1.1_receipt_rm.mermaid",
    "title": "1.1 Receipt Raw Material (As-Is)",
    "titleTh": "รับมอบวัตถุดิบ (RM) และส่งตรวจสอบ QC",
    "summary": "As-Is workflow for receiving raw materials from supplier, invoice verification, QA testing, and purchase PO revisions upon mismatch.",
    "category": "as-is",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Supplier",
      "Warehouse",
      "QA",
      "Purchase"
    ],
    "stepCount": 27,
    "content": "swimlane-beta TB\n\n  subgraph Supplier\n    start([เริ่มต้น])\n    a1[ส่ง RM]\n\n    %% Failure Flows (Invalid Invoice)\n    a13[แก้ไขเอกสาร]\n\n    %% Failure Flows (Quality Fail)\n    a19[รับทราบผล Fail RM]\n    a20{ต้องการเคลม RM หรือไม่}\n    a21[ส่ง RM ทดแทน]\n\n    %% Failure Flows (Debit Note)\n    a24[แจ้งให้ฝ่ายจัดซื้อทราบ]\n    a25[จัดทำใบลดหนี้ และส่งให้ฝ่ายจัดซื้อ]\n  end\n  \n  subgraph Warehouse\n    a2[ตรวจสอบข้อมูล Invoice และ Product]\n    a3{ข้อมูลถูกต้องหรือไม่}\n    a4{จำนวน RM ถูกต้องหรือไม่}\n    a5[รับ RM]\n    a6[ส่ง RM ไปยัง QC]\n\n    %% Failure Flows (Invalid Invoice)\n    a12[แจ้ง Supplier]\n\n    %% Failure Flows (Invalid RM)\n    a14{รับ RM ตาม Invoice หรือไม่}\n    a15[แจ้งจัดซื้อ Revise PO]\n\n    %% Failure Flows (Quality Fail)\n    a22[รับ RM]\n    a23[ปิดงาน]\n  end\n\n  subgraph QA\n    a7[รับ RM]\n    a8[ตรวจสอบคุณภาพ RM]\n    a9{ตรวจสอบคุณภาพ RM ผ่านหรือไม่}\n    a10[ติด Tag Pass]\n    a11[ส่ง RM ไปคลัง Main]\n    done([สิ้นสุด])\n\n    %% Failure Flows (Quality Fail)\n    a17[แจ้งผล Fail ให้ฝ่ายจัดซื้อ]\n  end\n\n  subgraph Purchase\n    a16[[Revise PO]]\n\n    %% Failure Flows (Quality Fail)\n    a18[แจ้งผลตรวจสอบ RM กับ Supplier]\n  end\n\n  %% Success Flows\n  start e1@--> a1\n  a1 e2@--> a2\n  a2 e3@--> a3\n  a3 e4@-->| Pass | a4\n  a4 e5@-->| Pass | a5\n  a5 e6@--> a6\n  a6 e7@--> a7\n  a7 e8@--> a8\n  a8 e9@--> a9\n  a9 e10@-->| Pass | a10\n  a10 e11@--> a11\n  a11 e12@--> done\n\n  %% Failure Flows (Invalid Invoice)\n  a3 -->| Fail | a12\n  a12 -->| Fail | a13\n  a13 --> a2\n\n  %% Failure Flows (Invalid RM)\n  a4 -->| Fail | a14\n  a14 --> a15\n  a15 --> a16\n  a16 --> a5\n\n  %% Failure Flows (Quality Fail)\n  a9 --> a17\n  a17 --> a18\n  a18 --> a19\n  a19 --> a20\n  a20 -->| Yes | a21\n  a21 --> a22\n  a22 --> a23\n  a23 --> done\n\n  %% Failure Flows (Debit Note)\n  a20 -->| Debit Note | a24\n  a24 --> a25\n  a25 --> a23\n\n  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;\n  class start attention;\n  class done attention;\n  \n  class a1 attention;\n  class a2 attention;\n  class a3 attention;\n  class a4 attention;\n  class a5 attention;\n  class a6 attention;\n  class a7 attention;\n  class a8 attention;\n  class a9 attention;\n  class a10 attention;\n  class a11 attention;\n\n  e1@{ animate: true, stroke}\n  e2@{ animate: true, stroke}\n  e3@{ animate: true, stroke}\n  e4@{ animate: true, stroke}\n  e5@{ animate: true, stroke}\n  e6@{ animate: true, stroke}\n  e7@{ animate: true, stroke}\n  e8@{ animate: true, stroke}\n  e9@{ animate: true, stroke}\n  e10@{ animate: true, stroke}\n  e11@{ animate: true, stroke}\n  e12@{ animate: true, stroke}"
  },
  {
    "id": "as-is_process-warehouse-1-2_revise_po-mermaid",
    "filePath": "as-is_process/Warehouse/1.2_revise_po.mermaid",
    "filename": "1.2_revise_po.mermaid",
    "title": "1.2 Revise Purchase Order (As-Is)",
    "titleTh": "แก้ไขใบสั่งซื้อ (Revise PO)",
    "summary": "As-Is PO revision notification flow between Warehouse and Purchasing.",
    "category": "as-is",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Warehouse",
      "Purchase"
    ],
    "stepCount": 7,
    "content": "swimlane-beta TB\n\n  subgraph Warehouse\n    start([เริ่มต้น])\n    done([สิ้นสุด])\n\n    a1[แจ้งจัดซื้อ Revise PO]\n    a4[รับแจ้ง Revise PO]\n    a5[รับ RM]\n  end\n\n  subgraph Purchase\n    a2[Revise PO]\n    a3[แจ้ง Warehouse]\n  end\n\n  %% Success Flows\n  start e1@--> a1\n  a1 e2@--> a2\n  a2 e3@--> a3\n  a3 e4@--> a4\n  a4 e5@--> a5\n  a5 e6@--> done\n\n\n  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;\n  class start attention;\n  class done attention;\n  \n  class a1 attention;\n  class a2 attention;\n  class a3 attention;\n  class a4 attention;\n  class a5 attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}"
  },
  {
    "id": "as-is_process-warehouse-1-3_transfer_rm-mermaid",
    "filePath": "as-is_process/Warehouse/1.3_transfer_rm.mermaid",
    "filename": "1.3_transfer_rm.mermaid",
    "title": "1.3 Internal Transfer RM (As-Is)",
    "titleTh": "การเบิกและโอนย้าย RM ในคลังสินค้า",
    "summary": "As-Is requisition and internal transfer of raw materials between Production and Warehouse.",
    "category": "as-is",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Production",
      "Warehouse"
    ],
    "stepCount": 14,
    "content": "swimlane-beta TB\n\n  subgraph Production\n    start([เริ่มต้น])\n    claim_rm[ขอเบิก RM]\n    received_notify[สร้างใบเบิก]\n    credit_note_issue[พิมพ์ใบเบิก]\n    sent_credit_note[ส่งใบเบิก]\n    received_rm[รับ RM จากคลัง]\n    record_rm[บันทึกข้อมูลการรับ RM]\n    done([สิ้นสุด])\n\n  end\n\n  subgraph Warehouse\n    received_credit_note[รับใบเบิก]\n    verify_credit_note{ตรวจสอบจำนวน RM}\n    allocate_stock[หยิบของตามจำนวน]\n    record_stock[บันทึกข้อมูลการเบิก RM]\n    stock_out[ส่งใบเบิกพร้อม RM ออกจากคลัง]\n\n    %% Failure Flows\n    notify_fail[หยิบของตามจำนวนคงเหลือ]\n  end\n\n  %% Success Flows\n  start e1@--> claim_rm\n  claim_rm e2@--> received_notify\n  received_notify e3@--> credit_note_issue\n  credit_note_issue e4@--> sent_credit_note\n  sent_credit_note e5@--> received_credit_note\n  received_credit_note e6@--> verify_credit_note\n  verify_credit_note e7@-->|Pass| allocate_stock\n  allocate_stock e8@--> record_stock\n  record_stock e9@--> stock_out\n  stock_out e10@--> received_rm\n  received_rm e11@--> record_rm\n  record_rm e12@--> done\n\n  %% Failure Flows\n  verify_credit_note -->|Fail| notify_fail\n  notify_fail --> record_stock\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class claim_rm attention;\n  class received_notify attention;\n  class credit_note_issue attention;\n  class sent_credit_note attention;\n  class received_credit_note attention;\n  class verify_credit_note attention;\n  class allocate_stock attention;\n  class record_stock attention;\n  class stock_out attention;\n  class received_rm attention;\n  class record_rm attention;\n  class done attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}\n  e7@{ animate: true}\n  e8@{ animate: true}\n  e9@{ animate: true}\n  e10@{ animate: true}\n  e11@{ animate: true}\n  e12@{ animate: true}"
  },
  {
    "id": "as-is_process-warehouse-1-4_return_rm-mermaid",
    "filePath": "as-is_process/Warehouse/1.4_return_rm.mermaid",
    "filename": "1.4_return_rm.mermaid",
    "title": "1.4 Return Raw Material (As-Is)",
    "titleTh": "การส่งคืนวัตถุดิบเหลือจากฝ่ายผลิต",
    "summary": "As-Is return flow for unused RM from Production back to Warehouse storage.",
    "category": "as-is",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Production",
      "Warehouse"
    ],
    "stepCount": 15,
    "content": "swimlane-beta TB\n\n  subgraph Production\n    start([เริ่มต้น])\n    a1[สร้างใบส่งคืนวัตถุดิบ]\n    a2[พิมพ์ Tag RM]\n    a3[ส่งใบส่งสินคืนวัตถุดิบ]\n  end\n\n  subgraph Warehouse\n    a4[ใบรับวัตถุดิบ]\n    a5{เอกสารส่งคืนถูกต้อง}\n    a6[สร้างรายการโอนย้าย RM]\n    a7[บันทึกการโอนย้าย RM]\n    a8{FG เพียงพอโอนย้ายหรือไม่}\n    a9[ใบโอน RM]\n    a10[เซ็นต์รับทราบใบโอน RM]\n    done([สิ้นสุด])\n\n    %% Failure Flows\n    a11[ส่งใบส่งคืนวัตถุดิบ]\n    a12[ใบวัตถุดิบ]\n    a13[แก้ไขเอกสารส่งคืนวัตถุดิบ]\n  end\n\n  %% Success Flows\n  start e1@--> a1\n  a1 e2@--> a2\n  a2 e3@--> a3\n  a3 e4@--> a4\n  a4 e5@--> a5\n  a5 e6@--> a6\n  a6 e7@--> a7\n  a7 e8@--> a8\n  a8 e9@--> a9\n  a9 e10@--> a10\n  a10 e11@--> done\n\n  %% Failure Flows\n  a5 --> a11\n  a11 --> a12\n  a12 --> a13\n  a13 --> a3\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class done attention;\n  class a1 attention;\n  class a2 attention;\n  class a3 attention;\n  class a4 attention;\n  class a5 attention;\n  class a6 attention;\n  class a7 attention;\n  class a8 attention;\n  class a9 attention;\n  class a10 attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}\n  e7@{ animate: true}\n  e8@{ animate: true}\n  e9@{ animate: true}\n  e10@{ animate: true}\n  e11@{ animate: true}"
  },
  {
    "id": "as-is_process-warehouse-1-5_job_transfer_rm-mermaid",
    "filePath": "as-is_process/Warehouse/1.5_job_transfer_rm.mermaid",
    "filename": "1.5_job_transfer_rm.mermaid",
    "title": "1.5 Job Transfer RM (As-Is)",
    "titleTh": "การโอนย้ายวัตถุดิบตาม Job งานผลิต",
    "summary": "As-Is transfer of materials assigned directly to production jobs.",
    "category": "as-is",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Production",
      "Warehouse"
    ],
    "stepCount": 8,
    "content": "swimlane-beta TB\n\n  subgraph Production\n    start([เริ่มต้น])\n    a1[สร้างรายการโอน Job]\n    a2[ส่งใบรายการโอน Job]\n    \n    %% Failure Flows\n    a6[แก้ไขรายการโอน Job]\n  end\n\n  subgraph Warehouse\n    a3{รายการโอน RM ข้าม Job ถูกต้องหรือไม่}\n    a4[สร้างรายการโอนย้าย RM]\n    a5[โอนย้าย RM]\n    done([สิ้นสุด])\n  end\n\n  %% Success Flows\n  start e1@--> a1\n  a1 e2@--> a2\n  a2 e3@--> a3\n  a3 e4@-->| ถูกต้อง | a4\n  a4 e5@--> a5\n  a5 e6@--> done\n\n  %% Failure Flows\n  a3 -->| ไม่ถูกต้อง | a6\n  a6 --> a2\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class done attention;\n  class a1 attention;\n  class a2 attention;\n  class a3 attention;\n  class a4 attention;\n  class a5 attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}"
  },
  {
    "id": "as-is_process-warehouse-1-6_stock_auditing-mermaid",
    "filePath": "as-is_process/Warehouse/1.6_stock_auditing.mermaid",
    "filename": "1.6_stock_auditing.mermaid",
    "title": "1.6 Stock Auditing (As-Is)",
    "titleTh": "การตรวจนับและตรวจสอบสต็อกสินค้า",
    "summary": "As-Is periodic inventory counting and auditing between Warehouse and Accounting.",
    "category": "as-is",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Warehouse",
      "Accounting"
    ],
    "stepCount": 14,
    "content": "swimlane-beta TB\n\n  subgraph Warehouse\n    start([เริ่มต้น])\n    a1[พิมพ์ Stock Report]\n    a2[ตรวจรายการ Stock]\n    a3{Stock ถูกต้องหรือไม่}\n    a4[พิมพ์ใบปะหน้าการนับ Stock]\n    a5[ใบปะหน้า]\n    a6[ติดใบการรับ Stock ที่ RM]\n    done([สิ้นสุด])\n    \n    %% Failure Flows\n    a7[จัดทำ Memo ขอปรับปรุงรายการ Stock]\n\n    %% Failure Flows\n    a12[แก้ไข Memo]\n  end\n\n  subgraph Accounting\n    a8[ตรวขสอบ Memo ขอปรับปรุงรายการ]\n    a9{Memo ถูกต้องหรือไม่}\n    a10[ปรับปรุงรายการ Stock]\n\n    %% Failure Flows\n    a11[แจ้งแก้ไข Memo]\n  end\n\n  %% Success Flows\n  start e1@--> a1\n  a1 e2@--> a2\n  a2 e3@--> a3\n  a3 e4@-->| ถูกต้อง | a4\n  a4 e5@--> a5\n  a5 e6@--> a6\n  a6 e7@--> done\n\n  %% Failure Flows\n  a3 -->| ไม่ถูกต้อง | a7\n  a7 --> a8\n  a8 -->| ถูกต้อง | a9\n  a9 -->| ถูกต้อง | a10\n  a10 e11@--> done\n\n  %% Failure Flows\n  a9 -->| ไม่ถูกต้อง | a11\n  a11 --> a12\n  a12 --> a8\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class done attention;\n  class a1 attention;\n  class a2 attention;\n  class a3 attention;\n  class a4 attention;\n  class a5 attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}"
  },
  {
    "id": "to-be_process-accounting-consolidate_planing-md",
    "filePath": "to-be_process/Accounting/consolidate_planing.md",
    "filename": "consolidate_planing.md",
    "title": "Consolidate Planning (To-Be)",
    "titleTh": "การวางแผนงบประมาณและบัญชีรวมบริษัทย่อย",
    "summary": "Financial and planning consolidation process between parent Accounting and subsidiary entities.",
    "category": "to-be",
    "department": "Accounting",
    "type": "markdown",
    "lanes": [
      "Accounting",
      "Subsidiary Company"
    ],
    "stepCount": 7,
    "content": "```mermaid\nswimlane-beta TB\n  %% Consolidate (Plan)\n  subgraph Accounting\n    start([เริ่มต้น])\n    receive([Excel file])\n    a([Review])\n    b([B])\n    verification{ตรวจสอบ Invoice จาก Supplier}\n    received[รับ RM]\n    done([เสร็จสิ้น])\n  end\n\n%%   subgraph Subsidiary Company\n%%     A\n%%   end\n\n  %% Success Flows\n  %% start e1@--> verification\n  start e1@-->verification\n\n  e1@{ animate: true}\n%%   e2@{ animate: true}\n%%   e3@{ animate: true}\n%%   e4@{ animate: true}\n\n  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;\n  class start attention;\n  class received attention;\n  class verification attention;\n  class validated attention;\n  class done attention;\n```"
  },
  {
    "id": "to-be_process-purchase-x_claim_rm-md",
    "filePath": "to-be_process/Purchase/x_claim_rm.md",
    "filename": "x_claim_rm.md",
    "title": "Claim Raw Material Procedure",
    "titleTh": "กระบวนการเคลมวัตถุดิบ (Claim RM)",
    "summary": "Lean procurement procedure for claiming defective or damaged raw materials.",
    "category": "to-be",
    "department": "Purchase",
    "type": "markdown",
    "lanes": [
      "Purchase",
      "Vendor/Supplier",
      "Warehouse"
    ],
    "stepCount": 7,
    "content": "# Purchase\n\n**Follow to lean approach:**\n\n1. Keep it High-Level: Focus only on the \"happy path\"  (the main successful workflow)\n2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.\n\n## กระบวนการ Claim RM\n\n```mermaid\n%% กระบวนการ Claim RM\nswimlane-beta TB\n\n  subgraph Purchase\n    start([เริ่มต้น])\n    claim_rm[แจ้งผลการตรวจสอบและให้ทดแทน RM]\n  end\n\n  subgraph Vendor/Supplier\n    received_notify[รับทราบผลการตรวจสอบ]\n    return_rm[ส่ง RM ทดแทน]\n  end\n\n  subgraph Warehouse\n    received_rm[รับ RM ทดแทน]\n    discrepancy_receive[[กระบวนการรับ RM]]\n    done([สิ้นสุด])\n  end\n\n  %% Success Flows\n  start e1@--> claim_rm\n  claim_rm e2@--> received_notify\n  received_notify e3@--> return_rm\n  return_rm e4@--> received_rm\n  received_rm e5@--> discrepancy_receive\n  discrepancy_receive e6@--> done\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class claim_rm attention;\n  class received_notify attention;\n  class return_rm attention;\n  class received_rm attention;\n  class discrepancy_receive attention;\n  class done attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}\n```\n"
  },
  {
    "id": "to-be_process-purchase-x_credit_note_rm-md",
    "filePath": "to-be_process/Purchase/x_credit_note_rm.md",
    "filename": "x_credit_note_rm.md",
    "title": "Credit Note RM Procedure",
    "titleTh": "กระบวนการออกใบลดหนี้วัตถุดิบ (Credit Note)",
    "summary": "Procure-to-pay workflow for receiving credit notes from suppliers.",
    "category": "to-be",
    "department": "Purchase",
    "type": "markdown",
    "lanes": [
      "Purchase",
      "Vendor/Supplier"
    ],
    "stepCount": 10,
    "content": "# Purchase\n\n**Follow to lean approach:**\n\n1. Keep it High-Level: Focus only on the \"happy path\"  (the main successful workflow)\n2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.\n\n## กระบวนการจัดทำใบลดหนี้\n\n```mermaid\n%% กระบวนการจัดทำใบลดหนี้\nswimlane-beta TB\n\n  subgraph Purchase\n    start([เริ่มต้น])\n    claim_rm[แจ้งผลการตรวจสอบและให้ทำใบลดหนี้]\n    received_credit_note[รับใบลดหนี้]\n    verify_credit_note{ตรวจสอบใบลดหนี้}\n    done([สิ้นสุด])\n\n    %% Failure Flows\n    notify_fail[แจ้งผลการตรวจสอบไม่ผ่าน]\n  end\n\n  subgraph Vendor/Supplier\n    received_notify[รับทราบผลการตรวจสอบ]\n    credit_note_issue[จัดทำใบลดหนี้]\n    sent_credit_note[ส่งใบลดหนี้]\n\n    %% Failure Flows\n    revise_credit_note[แก้ไขใบลดหนี้]\n  end\n\n  %% Success Flows\n  start e1@--> claim_rm\n  claim_rm e2@--> received_notify\n  received_notify e3@--> credit_note_issue\n  credit_note_issue e4@--> sent_credit_note\n  sent_credit_note e5@--> received_credit_note\n  received_credit_note e6@--> verify_credit_note\n  verify_credit_note e7@-->|Pass| done\n\n  %% Failure Flows\n  verify_credit_note -->|Fail| notify_fail\n  notify_fail --> revise_credit_note\n  revise_credit_note --> sent_credit_note\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class claim_rm attention;\n  class received_notify attention;\n  class credit_note_issue attention;\n  class sent_credit_note attention;\n  class received_credit_note attention;\n  class verify_credit_note attention;\n  class done attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}\n  e7@{ animate: true}\n```\n"
  },
  {
    "id": "to-be_process-qa-0_goods_receipt_inspection-mermaid",
    "filePath": "to-be_process/QA/0_goods_receipt_inspection.mermaid",
    "filename": "0_goods_receipt_inspection.mermaid",
    "title": "0 Goods Receipt Inspection (To-Be)",
    "titleTh": "การตรวจสอบคุณภาพสินค้าที่รับมอบ (QA)",
    "summary": "To-Be QA inspection workflow with pass/fail triggers and automated backorder generation.",
    "category": "to-be",
    "department": "QA",
    "type": "mermaid",
    "lanes": [
      "Quality Assurance",
      "Backorder"
    ],
    "stepCount": 7,
    "content": "swimlane-beta TB\n\n  subgraph Quality Assurance\n    start([เริ่มต้น])\n    done([สิ้นสุด])\n    \n    qa1[[Receipt]]\n    qa2[Validate]\n    qa3{Qauntity Fulfillment}\n    qa4[[Internal Transfer]]\n  end\n\n  subgraph Backorder\n    bo1[[Create Backorder]]\n  end\n\n  %% Success Flows\n  start e1@-->| Status: Waiting| qa1\n  qa1 e2@-->| Status: Ready | qa2\n  qa2 e3@-->| Status: Done | qa3\n  qa3 e4@--> | Meet | qa4\n  qa4 e5@--> done\n\n  %% Create Back Order\n  qa3 --> bo1\n  bo1 --> qa4\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class sent attention;\n  class qa1 attention;\n  class qa2 attention;\n  class qa3 attention;\n  class qa4 attention;\n  class done attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e5@{ animate: true}"
  },
  {
    "id": "to-be_process-warehouse-0_receipt_goods-mermaid",
    "filePath": "to-be_process/Warehouse/0_receipt_goods.mermaid",
    "filename": "0_receipt_goods.mermaid",
    "title": "0 Receipt Goods (To-Be Lean)",
    "titleTh": "การรับมอบสินค้าและตรวจสอบตามระบบ Odoo",
    "summary": "Lean To-Be goods receipt workflow integrated with Odoo delivery orders and QA inspection handoff.",
    "category": "to-be",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Warehouse",
      "Purchase",
      "Quality Assurance"
    ],
    "stepCount": 8,
    "content": "swimlane-beta TB\n\n  subgraph Warehouse\n    start([เริ่มต้น])\n    done([เสร็จสิ้น])\n\n    %% Success Flows\n    wh1{Verify Delivery Order}\n    wh2[Verify Product, Package, and Quantity]\n    wh3[Determine storage location and Quantity]\n    wh4[Validate]\n  end\n\n  subgraph Purchase\n    pu1[[Purchase Order]]\n  end\n\n  subgraph Quality Assurance\n    qa1[[goods_receipt_inspection]]\n  end\n\n  %% Success Flows\n  start e1@-->wh1\n  wh1 e2@-->|Correct| wh2\n  wh2 e3@-->|Status: Ready| wh3\n  wh3 e4@-->|Status: Ready| wh4\n  wh4 e5@-->|Status: Done| done\n  done --> qa1\n\n  %% Failure Request to revise Purchase Order\n  wh1 -->|Fail: request to revise Purchase Order| pu1\n  pu1 --> start\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n\n  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;\n  class start attention;\n  class done attention;\n  class wh1 attention;\n  class wh2 attention;\n  class wh3 attention;\n  class wh4 attention;"
  },
  {
    "id": "to-be_process-warehouse-1_transfer_to_quality_control-mermaid",
    "filePath": "to-be_process/Warehouse/1_transfer_to_quality_control.mermaid",
    "filename": "1_transfer_to_quality_control.mermaid",
    "title": "1 Transfer to QC (To-Be)",
    "titleTh": "โอนย้ายสินค้าไปยังแผนกควบคุมคุณภาพ",
    "summary": "To-Be standard internal transfer routing goods directly into the Quality Control zone.",
    "category": "to-be",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Warehouse",
      "Purchase"
    ],
    "stepCount": 7,
    "content": "swimlane-beta TB\n\n  subgraph Warehouse\n    start([เริ่มต้น])\n    done([เสร็จสิ้น])\n\n    %% Success Flows\n    wh1{Verify Delivery Order}\n    wh2[Verify Product, Package, and Quantity]\n    wh3[Determine storage location and Quantity]\n    wh4[Validate]\n  end\n\n  subgraph Purchase\n    pu1[[Purchase Order]]\n  end\n\n  %% Success Flows\n  start e1@-->wh1\n  wh1 e2@-->|Correct| wh2\n  wh2 e3@-->|Status: Ready| wh3\n  wh3 e4@-->|Status: Ready| wh4\n  wh4 e5@-->|Status: Done| done\n\n  %% Failure Request to revise Purchase Order\n  wh1 -->|Fail: request to revise Purchase Order| pu1\n  pu1 --> done\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n\n  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;\n  class start attention;\n  class done attention;\n  class wh1 attention;\n  class wh2 attention;\n  class wh3 attention;\n  class wh4 attention;"
  },
  {
    "id": "to-be_process-warehouse-2_sent_rm_to_qa-md",
    "filePath": "to-be_process/Warehouse/2_Sent_RM_To_QA.md",
    "filename": "2_Sent_RM_To_QA.md",
    "title": "2 Send RM to QA Procedure",
    "titleTh": "กระบวนการส่ง RM ไปให้ QA (Lean Approach)",
    "summary": "Standard operating procedure for inbound Warehouse sending raw materials to Quality Assurance.",
    "category": "to-be",
    "department": "Warehouse",
    "type": "markdown",
    "lanes": [
      "Warehouse",
      "QA"
    ],
    "stepCount": 5,
    "content": "# Warehouse (Inbound)\n\n**Follow to lean approach:**\n1. Keep it High-Level: Focus only on the \"happy path\"  (the main successful workflow)\n2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.\n\n## กระบวนการส่ง RM ไปให้ QA\n\n```mermaid\n%% กระบวนการรับ RM ตามที่ Supplier จัดส่ง\nswimlane-beta TB\n\n  subgraph Warehouse\n    start([เริ่มต้น])\n    sent[ส่ง RM]\n  end\n\n  subgraph QA\n    verification{ตรวจสอบความถูกต้อง}\n    received_warehouse[รับ RM จาก Warehouse]\n    done([สิ้นสุด])\n  end\n\n  %% Success Flows\n  start e1@--> sent\n  sent e2@-->|Internal Transfer| verification\n  verification e3@-->|Pass| received_warehouse\n  received_warehouse e4@--> done\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class sent attention;\n  class verification attention;\n  class received_warehouse attention;\n  class done attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n```\n"
  },
  {
    "id": "to-be_process-warehouse-2_discrepancy_receive-mermaid",
    "filePath": "to-be_process/Warehouse/2_discrepancy_receive.mermaid",
    "filename": "2_discrepancy_receive.mermaid",
    "title": "2 Discrepancy Receive (To-Be)",
    "titleTh": "การจัดการสินค้าไม่ตรงตามคำสั่งซื้อ",
    "summary": "To-Be resolution path for quantity or item discrepancies involving Purchasing and Vendors.",
    "category": "to-be",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Warehouse",
      "Purchase",
      "Vendor/Supplier"
    ],
    "stepCount": 10,
    "content": "swimlane-beta TB\n\n  subgraph Warehouse\n    start([เริ่มต้น])\n    verification{ตรวจสอบจำนวน RM จาก Supplier}\n    received[รับ RM]\n    done([เสร็จสิ้น])\n\n    %% Fail\n    discrepancy_received[รับ RM ตามจำนวน Supplier]\n\n    %% Connector\n    connector{ }\n  end\n\n  subgraph Purchase\n    sent_revise[รับแจ้ง แก้ไข PO]\n    revise_po[แก้ไข PO]\n  end\n\n  subgraph Vendor/Supplier\n    back_order[รับแจ้งให้ส่ง RM ตามจำนวน]\n    resent_rm[ส่ง RM เพิ่ม]\n  end\n\n  %% Success Flows\n  start e1@--> connector\n  connector e2@--> verification\n  verification e3@-->|Pass| received\n  received e4@--> done\n\n  %% Revise PO\n  verification -->|Fail| discrepancy_received\n  discrepancy_received -->|Request| sent_revise\n  sent_revise --> revise_po\n  revise_po -->|Revise| received\n\n  %% Backorder\n  verification -->|Backorder| back_order\n  back_order --> resent_rm\n  resent_rm --> connector\n\n  e1@{ animate: true, stroke}\n  e2@{ animate: true, stroke}\n  e3@{ animate: true, stroke}\n  e4@{ animate: true, stroke}\n\n  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;\n  class start attention;\n  class received attention;\n  class document_checking attention;\n  class verification attention;\n  class validated attention;\n  class done attention;"
  },
  {
    "id": "to-be_process-warehouse-x_internal_transfer_request-md",
    "filePath": "to-be_process/Warehouse/x_internal_transfer_request.md",
    "filename": "x_internal_transfer_request.md",
    "title": "Internal Transfer Request Procedure",
    "titleTh": "คำขอโอนย้ายวัตถุดิบภายใน (Internal Transfer)",
    "summary": "Lean procedure for requesting internal transfers across business units and warehouse locations.",
    "category": "to-be",
    "department": "Warehouse",
    "type": "markdown",
    "lanes": [
      "Business Unit",
      "Warehouse"
    ],
    "stepCount": 11,
    "content": "# Warehouse (Inbound)\n\n**Follow to lean approach:**\n1. Keep it High-Level: Focus only on the \"happy path\"  (the main successful workflow)\n2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.\n\n## Internal Transfer Request\n\n```mermaid\n%% Internal Transfer Process Flow\nswimlane-beta TB\n\n  subgraph Business Unit\n    start([เริ่มต้น])\n    a1[Create Internal Transfer Request]\n    a2{Forecast Availability}\n    a3[Mark as Todo]\n    a8[Scan a product]\n    a9{Validate}\n    \n    done([สิ้นสุด])\n  end\n\n  subgraph Warehouse\n    a4[[Picking Operations]]\n    a5[Define Package and Quantity]\n    a6{Check Availability}\n    a7[Delivery Operations]\n  end\n\n  %% Success Flows\n  start e1@--> a1\n  a1 e2@--> a2\n  a2 e3@-->|Available| a3\n  a3 e4@-->|Status: Waiting| a4\n  a4 e5@--> a5\n  a5 e6@--> a6\n  a6 e7@-->|Status: Ready| a7\n  a7 e8@-->|Delivered| a8\n  a8 e10@--> a9\n  a9 e9@-->|Status: Done| done\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class a1 attention;\n  class a2 attention;\n  class a3 attention;\n  class a4 attention;\n  class a5 attention;\n  class a6 attention;\n  class a7 attention;\n  class a8 attention;\n  class a9 attention;\n  class a10 attention;\n  class done attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}\n  e7@{ animate: true}\n  e8@{ animate: true}\n  e9@{ animate: true}\n  e10@{ animate: true}\n```\n"
  },
  {
    "id": "to-be_process-backorder-mermaid",
    "filePath": "to-be_process/backorder.mermaid",
    "filename": "backorder.mermaid",
    "title": "Backorder Management (To-Be)",
    "titleTh": "การจัดการ Backorder เมื่อสินค้าไม่ครบ",
    "summary": "Automated backorder creation and fulfillment tracking for partial deliveries.",
    "category": "to-be",
    "department": "General",
    "type": "mermaid",
    "lanes": [
      "Backorder"
    ],
    "stepCount": 5,
    "content": "swimlane-beta TB\n  subgraph Backorder\n    start([เริ่มต้น])\n    done([สิ้นสุด])\n    bo1{Create Backorder}\n    bo2[Created Backorder]\n\n    %% No Backorder\n    bo3[No Backorder]\n  end\n\n  %% Create backorder\n  start e1@--> bo1\n  bo1 e2@-->| Yes | bo2\n  bo2 e3@--> done\n\n  %% No backorder\n  bo1 -->| No | bo3\n  bo3 --> done\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class done attention;\n\n  class bo1 attention;\n  class bo2 attention;\n  class bo3 attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}"
  },
  {
    "id": "to-be_process-return_goods-mermaid",
    "filePath": "to-be_process/return_goods.mermaid",
    "filename": "return_goods.mermaid",
    "title": "Return Goods to Vendor (To-Be)",
    "titleTh": "การส่งคืนสินค้าให้แก่ Supplier / Vendor",
    "summary": "Standardized return workflow with delivery orders and vendor validation.",
    "category": "to-be",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Delivery Orders",
      "Vendor/Supplier"
    ],
    "stepCount": 9,
    "content": "swimlane-beta TB\n\n  subgraph Delivery Orders\n    start([เริ่มต้น])\n    done([สิ้นสุด])\n\n    rt1[[Goods Receipt]]\n    rt2[Specify Quantity]\n    \n    %% Return for Exchange\n    rt3{Return \n    for Exchange}\n    rt4[Create Goods Receipt]\n\n    %% Return\n    rt5[Return]\n  end\n\n  subgraph Vendor/Supplier\n    sup1[Validate]\n    sup2[Signature]\n  end\n\n  start e1@--> rt1\n  rt1 e2@-->| Status: Done | rt2\n  rt2 e3@--> rt3\n  rt3 --> rt4\n  \n  %% Return for Exchange\n  rt4 -->| Yes | rt5\n  rt5 -->| WH/OUT | sup1\n  sup1 -->| Delivery Note | sup2\n  sup2 --> done\n\n  %% Return\n  rt3 -->| No | rt5\n\n  classDef attention fill:#fff2cc;\n  class start attention;\n  class done attention;\n\n  class rt1 attention;\n  class rt2 attention;\n  class rt3 attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}"
  },
  {
    "id": "to-be_process-stock_auditing-mermaid",
    "filePath": "to-be_process/stock_auditing.mermaid",
    "filename": "stock_auditing.mermaid",
    "title": "Stock Auditing & Inventory Adjustment (To-Be)",
    "titleTh": "การตรวจนับและปรับปรุงยอดสินค้าคงคลัง (Physical Inventory)",
    "summary": "Lean cycle counting using mobile barcode scanning and automated accounting inventory valuation adjustment.",
    "category": "to-be",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Warehouse",
      "Accounting"
    ],
    "stepCount": 8,
    "content": "%% Stock Auditing & Inventory Adjustment (To-Be Lean Odoo 19)\nswimlane-beta TB\n\n  subgraph Warehouse\n    start([เริ่มต้น])\n    done([สิ้นสุด])\n\n    wh1[Initiate Physical Inventory]\n    wh2[Count & Scan via Barcode]\n    wh3{Discrepancy Found?}\n    wh4[Confirm Stock Balance]\n    wh5[Submit Inventory Adjustment]\n  end\n\n  subgraph Accounting\n    acc1{Approve Adjustment?}\n    acc2[Apply Adjustment & Post Valuation]\n    acc3[Request Recount]\n  end\n\n  %% Success Flows (Balanced count)\n  start e1@--> wh1\n  wh1 e2@--> wh2\n  wh2 e3@--> wh3\n  wh3 e4@-->| No Difference | wh4\n  wh4 e5@--> done\n\n  %% Discrepancy Flow & Accounting Approval\n  wh3 -->| Discrepancy | wh5\n  wh5 -->| Request Approval | acc1\n  acc1 e6@-->| Approved | acc2\n  acc2 e7@-->| Auto-Post Valuation | done\n\n  %% Recount Exception Flow\n  acc1 -->| Reject / Recount | acc3\n  acc3 -->| Notify Recount | wh2\n\n  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;\n  class start attention;\n  class done attention;\n  class wh1 attention;\n  class wh2 attention;\n  class wh3 attention;\n  class wh4 attention;\n  class wh5 attention;\n  class acc1 attention;\n  class acc2 attention;\n  class acc3 attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}\n  e7@{ animate: true}"
  },
  {
    "id": "to-be_process-internal_transfer-mermaid",
    "filePath": "to-be_process/internal_transfer.mermaid",
    "filename": "internal_transfer.mermaid",
    "title": "Internal Transfer & Job Requisition (To-Be)",
    "titleTh": "การโอนย้ายและเบิกจ่ายสินค้าภายใน (Internal Transfer)",
    "summary": "Lean internal picking and route-based movement between manufacturing jobs and warehouse locations.",
    "category": "to-be",
    "department": "Warehouse",
    "type": "mermaid",
    "lanes": [
      "Production",
      "Warehouse"
    ],
    "stepCount": 9,
    "content": "%% Internal Transfer & Job Requisition (To-Be Lean Odoo 19)\nswimlane-beta TB\n\n  subgraph Production\n    start([เริ่มต้น])\n    a1[Create Internal Transfer Request]\n    a2{Forecast Availability}\n    a3[Mark as Todo]\n    a8[Scan / Receive Product]\n    a9{Validate Transfer}\n    done([สิ้นสุด])\n  end\n\n  subgraph Warehouse\n    a4[[Picking Operations]]\n    a5[Define Package and Quantity]\n    a6{Check Availability}\n    a7[Delivery Operations]\n  end\n\n  %% Success Flows\n  start e1@--> a1\n  a1 e2@--> a2\n  a2 e3@-->| Available | a3\n  a3 e4@-->| Status: Waiting | a4\n  a4 e5@--> a5\n  a5 e6@--> a6\n  a6 e7@-->| Status: Ready | a7\n  a7 e8@-->| Delivered | a8\n  a8 e10@--> a9\n  a9 e9@-->| Status: Done | done\n\n  %% Shortage Exception Flow\n  a2 -->| Not Available | a1\n\n  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;\n  class start attention;\n  class done attention;\n  class a1 attention;\n  class a2 attention;\n  class a3 attention;\n  class a4 attention;\n  class a5 attention;\n  class a6 attention;\n  class a7 attention;\n  class a8 attention;\n  class a9 attention;\n\n  e1@{ animate: true}\n  e2@{ animate: true}\n  e3@{ animate: true}\n  e4@{ animate: true}\n  e5@{ animate: true}\n  e6@{ animate: true}\n  e7@{ animate: true}\n  e8@{ animate: true}\n  e9@{ animate: true}\n  e10@{ animate: true}"
  },
  {
    "id": "references-mermaid-swimlane-syntax-md",
    "filePath": "references/mermaid-swimlane-syntax.md",
    "filename": "mermaid-swimlane-syntax.md",
    "title": "Mermaid swimlane syntax reference",
    "titleTh": "",
    "summary": "",
    "category": "reference",
    "department": "General",
    "type": "markdown",
    "lanes": [
      "Sales",
      "Warehouse",
      "Customer",
      "Accounting"
    ],
    "stepCount": 14,
    "content": "# Mermaid swimlane syntax reference\n\nSource: https://mermaid.ai/open-source/syntax/swimlanes.html (Mermaid's own docs — check there directly if something below seems out of date, since this diagram type is new and still evolving).\n\nThere are two ways to draw a swimlane-style diagram in Mermaid. Pick per the \"Which syntax to use\" section of SKILL.md.\n\n## Option A: `swimlane-beta` (Mermaid v11.16+)\n\nPurpose-built diagram type. Marked as beta — syntax may still change in future Mermaid releases.\n\n### Starting a diagram\n\n```\nswimlane-beta\n```\n\nOptionally add a direction right after the keyword:\n\n```\nswimlane-beta LR\n```\n\n| Direction | Meaning                |\n| --------- | ---------------------- |\n| `TB`      | Top to bottom (default if omitted) |\n| `TD`      | Top down, same as `TB` |\n| `BT`      | Bottom to top          |\n| `LR`      | Left to right          |\n| `RL`      | Right to left          |\n\n### Lanes\n\nEach top-level `subgraph ... end` block becomes one swimlane. Give it a plain label, or an id plus a label when the label has spaces or you want a stable id to attach styles/references to:\n\n```\nswimlane-beta LR\n  subgraph Sales\n    quote[Prepare Quotation]\n  end\n  subgraph wh[\"Warehouse\"]\n    pick[Pick & Pack]\n  end\n```\n\n### Nodes\n\nNodes use the same shape syntax as flowcharts — id first, label inside the shape delimiters:\n\n| Syntax        | Shape             | Typical use          |\n| ------------- | ----------------- | --------------------- |\n| `id[Text]`    | Rectangle          | Task or activity      |\n| `id(Text)`    | Rounded rectangle  | Step or event         |\n| `id([Text])`  | Stadium            | Start or end point    |\n| `id{Text}`    | Decision           | Branching question     |\n| `id((Text))`  | Circle             | Connector or marker   |\n\n(Full shape catalog, icons, images, markdown-string labels, classes, and styling: see Mermaid's flowchart syntax docs — same rules apply here.)\n\n### Edges\n\nAlso flowchart-style, and they can connect nodes within a lane or across lanes:\n\n| Syntax             | Meaning                 |\n| ------------------ | ------------------------ |\n| `A --> B`           | Arrow                    |\n| `A --- B`           | Line, no arrowhead        |\n| `A -->|Label| B`    | Arrow with a label        |\n| `A -.-> B`          | Dotted arrow              |\n| `A ==> B`           | Thick arrow                |\n\n### Accessibility\n\n```\nswimlane-beta\n  accTitle: Quote to cash process\n  accDescr: Shows the handoffs between Sales, Warehouse, and Accounting from quotation to payment.\n  ...\n```\n\n### Worked example\n\n```\nswimlane-beta LR\n  subgraph Customer\n    start([Request Quote])\n    pay([Pay Invoice])\n  end\n  subgraph Sales\n    quote[Prepare Quotation]\n    approve{Approved by Customer?}\n  end\n  subgraph Warehouse\n    deliver[Pick, Pack & Deliver]\n  end\n  subgraph Accounting\n    invoice[Issue Invoice]\n  end\n\n  start --> quote\n  quote --> approve\n  approve -->|Revise| quote\n  approve -->|Confirmed| deliver\n  deliver -->|Delivery Confirmed| invoice\n  invoice --> pay\n```\n\n## Option B: classic `flowchart` + `subgraph` (works everywhere)\n\nSame idea, using the long-stable flowchart syntax. This is the safe default when you don't know the target renderer, or when the target is GitHub/GitLab markdown, Notion, Confluence, or an older Mermaid version.\n\n```\nflowchart LR\n  subgraph Customer\n    start([Request Quote])\n    pay([Pay Invoice])\n  end\n  subgraph Sales\n    quote[Prepare Quotation]\n    approve{Approved by Customer?}\n  end\n  subgraph Warehouse\n    deliver[Pick, Pack & Deliver]\n  end\n  subgraph Accounting\n    invoice[Issue Invoice]\n  end\n\n  start --> quote\n  quote --> approve\n  approve -->|Revise| quote\n  approve -->|Confirmed| deliver\n  deliver -->|Delivery Confirmed| invoice\n  invoice --> pay\n```\n\nEverything else — node shapes, edge syntax, direction keywords — is identical to Option A, since `swimlane-beta` reuses flowchart conventions. The only real differences are the opening keyword (`flowchart LR` vs `swimlane-beta LR`) and that classic Mermaid doesn't guarantee lanes render as strict aligned rows the way the purpose-built type does — layout can drift on complex diagrams. If strict lane alignment matters and the renderer supports it, prefer Option A.\n\n## Good practices (why the review checklist looks the way it does)\n\nThese come straight from Mermaid's own guidance and are the basis for the checklist in SKILL.md:\n\n- **One kind of ownership per lane.** Don't mix teams, phases, and statuses as lanes in the same diagram unless that mixing is deliberately the point.\n- **Label cross-lane handoffs.** A cross-lane arrow is where responsibility changes hands — label it with the document, decision, message, or condition that triggers the handoff.\n- **Keep it readable.** Split a large process into several diagrams once lanes or handoffs stop fitting in one view. If you have to trace an arrow twice to follow it, it's too dense.\n- **Use stable ids.** Short, meaningful node/lane ids that don't change even if the display label is edited later.\n- **Put decisions where they're made.** A decision node belongs in the lane that owns that decision; route the outcomes to whichever lanes act on the result.\n\n## When *not* to use a swimlane diagram\n\n- Ownership isn't the point, only sequence/branching matters → plain `flowchart`.\n- The focus is messages over time between participants → `sequenceDiagram`.\n- The focus is how one entity changes state → `stateDiagram`.\n"
  },
  {
    "id": "references-odoo-process-patterns-md",
    "filePath": "references/odoo-process-patterns.md",
    "filename": "odoo-process-patterns.md",
    "title": "Odoo 19 process patterns for swimlane diagrams",
    "titleTh": "",
    "summary": "",
    "category": "reference",
    "department": "General",
    "type": "markdown",
    "lanes": [],
    "stepCount": 0,
    "content": "# Odoo 19 process patterns for swimlane diagrams\n\nSource: https://www.odoo.com/documentation/19.0/ (Odoo's official user docs). These are the standard, out-of-the-box flows for the apps most likely to show up in BPR/RFP process diagrams. Treat this as a vocabulary and sequence check, not a spec — real implementations customize stages, add approval steps, or merge steps, and the person's description of their actual process always takes priority over what's listed here. If something they describe doesn't match, ask rather than silently \"correcting\" it to the standard flow.\n\nWhen in doubt about a detail not covered here (a specific field, a configuration option, exact menu path), the project's `odoo-documentation-assistant` skill is the better tool — this file only covers what's needed to lay out an accurate process diagram: which stages exist, in what order, and who typically owns each one.\n\n## Sales (quote to cash)\n\nTypical lanes: **Customer, Sales, Warehouse/Inventory, Accounting.**\n\n1. Customer requests a quote, or Sales proactively creates one.\n2. Sales creates a **Quotation**.\n3. Customer confirms → Quotation becomes a **Sales Order**.\n4. If stock-tracked products are involved, Inventory gets a **Delivery Order** (routing depends on the warehouse's configured steps — one-step, two-step with an intermediate output, or three-step with pick + pack + ship).\n5. Warehouse validates the delivery.\n6. Accounting creates/sends the **Invoice** (can be triggered on order confirmation, on delivery, or on a milestone/subscription schedule, depending on configuration).\n7. Customer pays; payment is registered and reconciled against the invoice.\n\n## Purchase (procure to pay)\n\nTypical lanes: **Requestor, Purchasing, Vendor, Warehouse, Accounting.**\n\n1. A need triggers a purchase — manually, or automatically via a reordering rule / MRP.\n2. Buyer creates a **Request for Quotation (RFQ)** and sends it to one or more vendors.\n3. Vendor confirms pricing/availability.\n4. Buyer confirms the RFQ → it becomes a **Purchase Order**.\n5. Warehouse receives the goods as a **Receipt**, validated against the PO.\n6. Accounting matches the incoming **Vendor Bill** against the PO/receipt (3-way matching if Quality/Inventory data is used).\n7. Payment is made to the vendor.\n\n## Inventory\n\nTypical lanes: **Sales/Purchase (source doc), Warehouse.**\n\n- Movements follow configured **routes**: Receipt → (Putaway) → Storage; Storage → (Pick) → (Pack) → Delivery, depending on whether the warehouse uses one-, two-, or three-step routes.\n- Internal transfers move stock between locations within the same flow shape (source → transfer → destination).\n\n## Manufacturing (MRP)\n\nTypical lanes: **Planning (Sales Order or Reordering Rule), Manufacturing, Quality (if installed), Warehouse.**\n\n1. A **Manufacturing Order (MO)** is triggered — manually, from a confirmed Sales Order, or by a reordering rule.\n2. Components are reserved from stock.\n3. **Work Orders** are executed at the relevant **Work Centers**, in the sequence defined by the product's Bill of Materials / routing.\n4. If the Quality app is installed, quality checks can be inserted at specific work order steps.\n5. Finished goods are received into stock, closing the MO.\n\n## Accounting / Invoicing\n\nTypical lanes: **Sales/Purchase (source), Accounting, Customer/Vendor, Bank.**\n\n1. Draft invoice or bill is generated (from a sales/purchase document, or manually).\n2. It's validated/posted.\n3. It's sent to the customer, or a vendor bill is recorded.\n4. Payment is registered.\n5. Payment is reconciled against the bank statement.\n\n## HR — Recruitment\n\nTypical lanes: **Candidate, Recruiter, Hiring Manager, HR (Employees app).**\n\n1. A job position is posted.\n2. Applications come in and land in a Kanban pipeline whose stages are fully configurable (commonly something like Initial Qualification → Interview → Offer).\n3. Candidate moves through interview stages.\n4. An offer is extended and accepted.\n5. On hire, the candidate becomes an **Employee** record, handing off to onboarding.\n\n## HR — Time Off\n\nTypical lanes: **Employee, Manager, HR.**\n\n1. Employee submits a **time off request** against an allocation.\n2. Manager approves or refuses.\n3. Depending on configuration, a second HR approval step may be required.\n4. Approved time off is deducted from the allocation and appears on the shared calendar.\n\n## Approvals (generic, cross-app)\n\nTypical lanes: **Requester, Approver(s).**\n\n1. Requester submits an approval request (can be tied to a specific type — purchase, expense, etc. — or generic).\n2. One or more approvers review, in sequence or in parallel depending on how the approval type is configured.\n3. Approved or refused, with the requester notified either way.\n\n## Other apps that commonly appear in process diagrams\n\nFor reference, the broader set of standard Odoo 19 apps grouped by area (useful when naming lanes or confirming an app exists): **Finance** — Accounting and Invoicing, Expenses, Fiscal Localizations; **Sales** — CRM, Sales, Point of Sale, Subscriptions, Rental; **Supply Chain** — Inventory, Manufacturing, Purchase, Barcode, Quality, Maintenance, Repairs; **Human Resources** — Attendances, Employees, Appraisals, Fleet, Payroll, Time Off, Recruitment; **Websites** — Website, eCommerce, eLearning, Live Chat; **Services** — Project, Helpdesk, Field Service, Timesheets.\n"
  },
  {
    "id": "document_template-template-md",
    "filePath": "document_template/template.md",
    "filename": "template.md",
    "title": "Business Unit",
    "titleTh": "",
    "summary": "",
    "category": "template",
    "department": "General",
    "type": "markdown",
    "lanes": [
      "Flow"
    ],
    "stepCount": 2,
    "content": "# Business Unit\n\n**Follow to lean approach:**\n\n1. Keep it High-Level: Focus only on the \"happy path\"  (the main successful workflow)\n2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.\n\n## กระบวน [...]\n\n```mermaid\nswimlane-beta TB\n\n  subgraph Flow\n    start([เริ่มต้น])\n    done([เสร็จสิ้น])\nend\n\nstart --> done\n\n```\n"
  }
];
