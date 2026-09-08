# QA

**Follow to lean approach:**

1. Keep it High-Level: Focus only on the "happy path"  (the main successful workflow)
2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.

## กระบวนตรวจสอบ RM

```mermaid
%% กระบวนการรับ RM ตามที่ Supplier จัดส่ง
swimlane-beta TB

  subgraph QA
    start([เริ่มต้น])
    verification{ตรวจสอบ RM ถูกต้อง}
    tag[ติด Tag Pass]
    transfer[ย้าย RM ไปคลัง]

    %%Fail
    notify[แจ้งผลตรวจสอบ]
  end

  subgraph Warehouse
    received_warehouse[รับ RM]
    done([สิ้นสุด])
  end

  subgraph Purchase
    receive_notify[รับทราบผลการตรวจสอบ]
  end

  %% Success Flows
  start e1@--> verification
  verification e2@-->|Pass| tag
  tag e3@--> transfer
  transfer e4@--> received_warehouse
  received_warehouse e5@--> done

  %% Fail
  verification -->|Fail| notify
  notify --> receive_notify

  classDef attention fill:#fff2cc;
  class start attention;
  class sent attention;
  class verification attention;
  class received_warehouse attention;
  class done attention;

  e1@{ animate: true}
  e2@{ animate: true}
  e3@{ animate: true}
  e4@{ animate: true}
  e5@{ animate: true}
```
