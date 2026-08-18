# Warehouse (Inbound)

**Follow to lean approach:**
1. Keep it High-Level: Focus only on the "happy path"  (the main successful workflow)
2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.

## กระบวนการรับของ

```mermaid
%% กระบวนการรับ RM ตามที่ Supplier จัดส่ง
swimlane-beta TB

  subgraph Warehouse
    start([เริ่มต้น])
    verification{ตรวจสอบจำนวน RM จาก Supplier}
    received[รับ RM]
    done([เสร็จสิ้น])

    %% Fail
    discrepancy_received{รับ RM ตามจำนวน Supplier}

    %% Connector
    connector{ }
  end

  subgraph Purchase
    sent_revise[รับแจ้ง แก้ไข PO]
    revise_po[แก้ไข PO]
  end

  subgraph Vendor/Supplier
    back_order[รับแจ้งให้ส่ง RM ตามจำนวน]
    resent_rm[ส่ง RM เพิ่ม]
  end

  %% Success Flows
  start e1@--> connector
  connector --> verification
  verification e2@-->|Pass| received
  received e3@--> done

  %% Revise PO
  verification -->|Fail| discrepancy_received
  discrepancy_received -->|Request| sent_revise
  sent_revise --> revise_po
  revise_po -->|Revise| received

  %% Backorder
  verification -->|Backorder| back_order
  back_order --> resent_rm
  resent_rm --> connector

  e1@{ animate: true, stroke}
  e2@{ animate: true, stroke}
  e3@{ animate: true, stroke}

  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;
  class start attention;
  class received attention;
  class document_checking attention;
  class verification attention;
  class validated attention;
  class done attention;
```