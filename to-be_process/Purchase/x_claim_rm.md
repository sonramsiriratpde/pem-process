# Purchase

**Follow to lean approach:**

1. Keep it High-Level: Focus only on the "happy path"  (the main successful workflow)
2. Use Simple Shapes: Stick to basic rectangles for step and diamonns for decisions. Avoid overly strict BPMN or UML notation rules that require extra explanation.

## กระบวนการ Claim RM

```mermaid
%% กระบวนการ Claim RM
swimlane-beta TB

  subgraph Purchase
    start([เริ่มต้น])
    claim_rm[แจ้งผลการตรวจสอบและให้ทดแทน RM]
  end

  subgraph Vendor/Supplier
    received_notify[รับทราบผลการตรวจสอบ]
    return_rm[ส่ง RM ทดแทน]
  end

  subgraph Warehouse
    received_rm[รับ RM ทดแทน]
    discrepancy_receive[[กระบวนการรับ RM]]
    done([สิ้นสุด])
  end

  %% Success Flows
  start e1@--> claim_rm
  claim_rm e2@--> received_notify
  received_notify e3@--> return_rm
  return_rm e4@--> received_rm
  received_rm e5@--> discrepancy_receive
  discrepancy_receive e6@--> done

  classDef attention fill:#fff2cc;
  class start attention;
  class claim_rm attention;
  class received_notify attention;
  class return_rm attention;
  class received_rm attention;
  class discrepancy_receive attention;
  class done attention;

  e1@{ animate: true}
  e2@{ animate: true}
  e3@{ animate: true}
  e4@{ animate: true}
  e5@{ animate: true}
  e6@{ animate: true}
```
