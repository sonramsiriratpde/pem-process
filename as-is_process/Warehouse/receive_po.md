# PSL101 เยื่อ&บรรจุ

## End-to-end (AS-IS) Process

**Follow to lean approach:**
1. Keep it High-Level: Focus only on the "happy path"  (the main successful workflow)
2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.

```mermaid
swimlane-beta TB

  subgraph Sales/S&OP
    start([เริ่มต้น])
    plan[[วางแผนการผลิต]]
  end

  subgraph Purchase
    purchase_order[[รับซื้อไผ่]]
  end

  subgraph QC
    incoming_inspection{QC ลำไผ่}
    final_inspection{QC สินค้าสำเร็จรูป}
    rework_inspection{QC ปรับปรุง}
    %% reject([ปฏิเสธ/คัดออก])
    scrap_writeoff([ตัดจำหน่าย/ทำลาย])
    fail_incoming_inspection{Fail}
    fail_final_inspection{Fail}
  end

  subgraph Production
    chipping[[Chipping]]
    fiber_bundle[[Bundle fiber]]
    tmp[[TMP ผลิตเยื่อ]]
    packaging[Packaging]
    rework[ปรับปรุง]
  end

  subgraph Logistics
    ship[[จัดส่ง]]
  end

  subgraph Finance
    invoice[[Invoice/บันทึกบัญชี]]
    done([สิ้นสุด])
  end

  subgraph Environment_WWT
    waste([บำบัดน้ำเสีย])
  end
  
  subgraph Supplier
    vendor_return([รับคืน])
  end

%% Flows
  start e1@--> plan
  plan e2@-->|Received| purchase_order
  purchase_order e3@-->|Incoming| incoming_inspection
  incoming_inspection e4@-->|Pass| chipping
  chipping e5@--> fiber_bundle
  fiber_bundle e6@--> tmp
  tmp e7@--> packaging
  packaging e8@-->|Final| final_inspection
  final_inspection e9@-->|Pass| ship
  tmp -.->|น้ำเสีย| waste
  packaging -.->|น้ำเสีย| waste
  ship e10@-->|วางบิล| invoice
  invoice e11@--> done

  incoming_inspection -->|Fail| fail_incoming_inspection
  fail_incoming_inspection -->|Reworkable| vendor_return
  fail_incoming_inspection -->|Unusable| scrap_writeoff
  final_inspection -->|Fail| fail_final_inspection
  fail_final_inspection -->|Fixable| rework
  rework -->|Rework| rework_inspection
  rework_inspection -->|Pass| ship
  rework_inspection -->|Fail| scrap_writeoff
  fail_final_inspection -->|Scrap| scrap_writeoff

  e1@{ animate: true, stroke}
  e2@{ animate: true, stroke}
  e3@{ animate: true, stroke}
  e4@{ animate: true, stroke}
  e5@{ animate: true, stroke}
  e6@{ animate: true, stroke}
  e7@{ animate: true, stroke}
  e8@{ animate: true, stroke}
  e9@{ animate: true, stroke}
  e10@{ animate: true, stroke}
  e11@{ animate: true, stroke}

  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;
  class start attention;
  class plan attention;
  class purchase_order attention;
  class incoming_inspection attention;
  class chipping attention;
  class fiber_bundle attention;
  class tmp attention;
  class packaging attention;
  class ship attention;
  class invoice attention;
  class final_inspection attention;
  class done attention;
  ```