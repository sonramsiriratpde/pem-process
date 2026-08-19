# Warehouse (Inbound)

**Follow to lean approach:**
1. Keep it High-Level: Focus only on the "happy path"  (the main successful workflow)
2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.

## กระบวนตรวจสอบ Invoice

```mermaid
swimlane-beta TB

  subgraph Warehouse
    start([เริ่มต้น])
    verification{ตรวจสอบ Invoice จาก Supplier}
    received[รับ RM]
    done([เสร็จสิ้น])

    %% Connector
    connector{ }
  end

  subgraph Supplier
    %% Fail
    revise_notification[รับแจ้งแก้ไข]
    revise_invoice[แก้ไข Invoice]
  end

  %% Success Flows
  %% start e1@--> verification
  start e1@-->connector
  connector e2@--> verification
  verification e3@-->|Pass| received
  received e4@--> done

  %% Fail Flows
  verification -->|Fail| revise_notification
  revise_notification --> revise_invoice
  revise_invoice -->|Revise| connector

  e1@{ animate: true}
  e2@{ animate: true}
  e3@{ animate: true}
  e4@{ animate: true}

  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;
  class start attention;
  class received attention;
  class verification attention;
  class validated attention;
  class done attention;
```