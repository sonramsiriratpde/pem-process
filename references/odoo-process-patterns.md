# Odoo 19 process patterns for swimlane diagrams

Source: https://www.odoo.com/documentation/19.0/ (Odoo's official user docs). These are the standard, out-of-the-box flows for the apps most likely to show up in BPR/RFP process diagrams. Treat this as a vocabulary and sequence check, not a spec — real implementations customize stages, add approval steps, or merge steps, and the person's description of their actual process always takes priority over what's listed here. If something they describe doesn't match, ask rather than silently "correcting" it to the standard flow.

When in doubt about a detail not covered here (a specific field, a configuration option, exact menu path), the project's `odoo-documentation-assistant` skill is the better tool — this file only covers what's needed to lay out an accurate process diagram: which stages exist, in what order, and who typically owns each one.

## Sales (quote to cash)

Typical lanes: **Customer, Sales, Warehouse/Inventory, Accounting.**

1. Customer requests a quote, or Sales proactively creates one.
2. Sales creates a **Quotation**.
3. Customer confirms → Quotation becomes a **Sales Order**.
4. If stock-tracked products are involved, Inventory gets a **Delivery Order** (routing depends on the warehouse's configured steps — one-step, two-step with an intermediate output, or three-step with pick + pack + ship).
5. Warehouse validates the delivery.
6. Accounting creates/sends the **Invoice** (can be triggered on order confirmation, on delivery, or on a milestone/subscription schedule, depending on configuration).
7. Customer pays; payment is registered and reconciled against the invoice.

## Purchase (procure to pay)

Typical lanes: **Requestor, Purchasing, Vendor, Warehouse, Accounting.**

1. A need triggers a purchase — manually, or automatically via a reordering rule / MRP.
2. Buyer creates a **Request for Quotation (RFQ)** and sends it to one or more vendors.
3. Vendor confirms pricing/availability.
4. Buyer confirms the RFQ → it becomes a **Purchase Order**.
5. Warehouse receives the goods as a **Receipt**, validated against the PO.
6. Accounting matches the incoming **Vendor Bill** against the PO/receipt (3-way matching if Quality/Inventory data is used).
7. Payment is made to the vendor.

## Inventory

Typical lanes: **Sales/Purchase (source doc), Warehouse.**

- Movements follow configured **routes**: Receipt → (Putaway) → Storage; Storage → (Pick) → (Pack) → Delivery, depending on whether the warehouse uses one-, two-, or three-step routes.
- Internal transfers move stock between locations within the same flow shape (source → transfer → destination).

## Manufacturing (MRP)

Typical lanes: **Planning (Sales Order or Reordering Rule), Manufacturing, Quality (if installed), Warehouse.**

1. A **Manufacturing Order (MO)** is triggered — manually, from a confirmed Sales Order, or by a reordering rule.
2. Components are reserved from stock.
3. **Work Orders** are executed at the relevant **Work Centers**, in the sequence defined by the product's Bill of Materials / routing.
4. If the Quality app is installed, quality checks can be inserted at specific work order steps.
5. Finished goods are received into stock, closing the MO.

## Accounting / Invoicing

Typical lanes: **Sales/Purchase (source), Accounting, Customer/Vendor, Bank.**

1. Draft invoice or bill is generated (from a sales/purchase document, or manually).
2. It's validated/posted.
3. It's sent to the customer, or a vendor bill is recorded.
4. Payment is registered.
5. Payment is reconciled against the bank statement.

## HR — Recruitment

Typical lanes: **Candidate, Recruiter, Hiring Manager, HR (Employees app).**

1. A job position is posted.
2. Applications come in and land in a Kanban pipeline whose stages are fully configurable (commonly something like Initial Qualification → Interview → Offer).
3. Candidate moves through interview stages.
4. An offer is extended and accepted.
5. On hire, the candidate becomes an **Employee** record, handing off to onboarding.

## HR — Time Off

Typical lanes: **Employee, Manager, HR.**

1. Employee submits a **time off request** against an allocation.
2. Manager approves or refuses.
3. Depending on configuration, a second HR approval step may be required.
4. Approved time off is deducted from the allocation and appears on the shared calendar.

## Approvals (generic, cross-app)

Typical lanes: **Requester, Approver(s).**

1. Requester submits an approval request (can be tied to a specific type — purchase, expense, etc. — or generic).
2. One or more approvers review, in sequence or in parallel depending on how the approval type is configured.
3. Approved or refused, with the requester notified either way.

## Other apps that commonly appear in process diagrams

For reference, the broader set of standard Odoo 19 apps grouped by area (useful when naming lanes or confirming an app exists): **Finance** — Accounting and Invoicing, Expenses, Fiscal Localizations; **Sales** — CRM, Sales, Point of Sale, Subscriptions, Rental; **Supply Chain** — Inventory, Manufacturing, Purchase, Barcode, Quality, Maintenance, Repairs; **Human Resources** — Attendances, Employees, Appraisals, Fleet, Payroll, Time Off, Recruitment; **Websites** — Website, eCommerce, eLearning, Live Chat; **Services** — Project, Helpdesk, Field Service, Timesheets.
