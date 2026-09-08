```mermaid
swimlane-beta TB
  %% Consolidate (Plan)
  subgraph Accounting
    start([เริ่มต้น])
    receive([Excel file])
    a([Review])
    b([B])
    verification{ตรวจสอบ Invoice จาก Supplier}
    received[รับ RM]
    done([เสร็จสิ้น])
  end

%%   subgraph Subsidiary Company
%%     A
%%   end

  %% Success Flows
  %% start e1@--> verification
  start e1@-->verification

  e1@{ animate: true}
%%   e2@{ animate: true}
%%   e3@{ animate: true}
%%   e4@{ animate: true}

  classDef attention fill:#fff2cc,stroke:#333,stroke-width:2px;
  class start attention;
  class received attention;
  class verification attention;
  class validated attention;
  class done attention;
```