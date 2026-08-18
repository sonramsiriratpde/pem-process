# Warehouse (Inbound)

**Follow to lean approach:**
1. Keep it High-Level: Focus only on the "happy path"  (the main successful workflow)
2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.

## กระบวนการส่ง RM ไปให้ QA

```mermaid
%% กระบวนการรับ RM ตามที่ Supplier จัดส่ง
swimlane-beta TB

  subgraph Warehouse
    start([เริ่มต้น])
    sent[ส่ง RM]
  end

  subgraph QA
    received_warehouse[รับ RM จาก Warehouse]
    done([สิ้นสุด])
  end

  %% Success Flows
  start e1@--> sent
  sent e2@--> received_warehouse
  received_warehouse e3@--> done

  classDef attention fill:#fff2cc;
  class start attention;
  class sent attention;
  class received_warehouse attention;
  class done attention;

  e1@{ animate: true, stroke}
  e2@{ animate: true, stroke}
  e3@{ animate: true, stroke}
```
