import type { Invoice } from "@/feature/gst-reconciliation/types/gst";

export const SAMPLE_INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    vendor_name: "Reliance Industries Ltd",
    vendor_gstin: "27AAACR5055K1Z7",
    invoice_number: "RIL-2026-001",
    invoice_date: "2026-04-15",
    taxable_amount: 100000,
    igst: 18000,
    cgst: 0,
    sgst: 0,
    total_amount: 118000,
    gstr2b_amount: 118000,
    status: "matched",
  },
  {
    id: "inv-002",
    vendor_name: "Tata Consultancy Services",
    vendor_gstin: "27AAACT2727Q1ZW",
    invoice_number: "TCS-2026-045",
    invoice_date: "2026-04-18",
    taxable_amount: 250000,
    igst: 0,
    cgst: 22500,
    sgst: 22500,
    total_amount: 295000,
    gstr2b_amount: 285000,
    status: "amount_mismatch",
  },
  {
    id: "inv-003",
    vendor_name: "Infosys Ltd",
    vendor_gstin: "29AAACI4741L1Z7",
    invoice_number: "INF-2026-112",
    invoice_date: "2026-04-20",
    taxable_amount: 500000,
    igst: 90000,
    cgst: 0,
    sgst: 0,
    total_amount: 590000,
    gstr2b_amount: null,
    status: "missing_in_gstr2b",
  },
  {
    id: "inv-004",
    vendor_name: "HDFC Bank",
    vendor_gstin: "27AAACH2702H1ZA",
    invoice_number: "HDFC-2026-078",
    invoice_date: "2026-04-22",
    taxable_amount: 45000,
    igst: 0,
    cgst: 4050,
    sgst: 4050,
    total_amount: 53100,
    gstr2b_amount: 53100,
    status: "matched",
  },
  {
    id: "inv-005",
    vendor_name: "Wipro Ltd",
    vendor_gstin: "29AAACW0387P1Z8",
    invoice_number: "WIP-2026-234",
    invoice_date: "2026-04-25",
    taxable_amount: 180000,
    igst: 32400,
    cgst: 0,
    sgst: 0,
    total_amount: 212400,
    gstr2b_amount: 212400,
    status: "gstin_mismatch",
  },
];

const VENDOR_TEMPLATES = [
  { name: "Reliance Industries Ltd", code: "RIL", gstin: "27AAACR5055K1Z7", state: "27" },
  { name: "Tata Consultancy Services", code: "TCS", gstin: "27AAACT2727Q1ZW", state: "27" },
  { name: "Infosys Ltd", code: "INF", gstin: "29AAACI4741L1Z7", state: "29" },
  { name: "HDFC Bank Ltd", code: "HDFC", gstin: "27AAACH2702H1ZA", state: "27" },
  { name: "Wipro Ltd", code: "WIP", gstin: "29AAACW0387P1Z8", state: "29" },
  { name: "Tata Steel Ltd", code: "TSL", gstin: "20AAACT2727N1Z2", state: "20" },
  { name: "Larsen & Toubro Ltd", code: "LNT", gstin: "27AAACL0111K1Z3", state: "27" },
  { name: "ICICI Bank Ltd", code: "ICICI", gstin: "27AAACI1681G1ZQ", state: "27" },
  { name: "Bharti Airtel Ltd", code: "BAL", gstin: "07AAACB2894G1ZE", state: "07" },
  { name: "ITC Ltd", code: "ITC", gstin: "19AAACI0054F1Z1", state: "19" },
  { name: "Mahindra & Mahindra", code: "MAM", gstin: "27AAACM0538N1Z4", state: "27" },
  { name: "State Bank of India", code: "SBI", gstin: "27AAACS0852R1ZB", state: "27" },
  { name: "Adani Ports & SEZ", code: "APSEZ", gstin: "24AAACA2697J1ZD", state: "24" },
  { name: "Sun Pharmaceutical Ltd", code: "SUN", gstin: "24AAACS3875K1Z9", state: "24" },
  { name: "Hindustan Unilever Ltd", code: "HUL", gstin: "27AAACH1111B1Z5", state: "27" },
];

/**
 * Generates 1,000 deterministic mock invoice records for GST reconciliation testing.
 */
export function generateMockInvoices(targetCount: number = 1000): Invoice[] {
  const result: Invoice[] = [...SAMPLE_INITIAL_INVOICES];

  let currentId = 6;
  const startDate = new Date(2026, 3, 1); // April 1, 2026

  while (result.length < targetCount) {
    const vendorIndex = (currentId - 1) % VENDOR_TEMPLATES.length;
    const vendor = VENDOR_TEMPLATES[vendorIndex];

    // Seeded pseudo-random variations
    const dateOffset = (currentId * 7) % 30;
    const invDate = new Date(startDate.getTime() + dateOffset * 86400000);
    const dateStr = invDate.toISOString().split("T")[0];

    const baseAmount = ((currentId * 13750) % 450000) + 15000;
    const isInterState = vendor.state !== "27";

    let igst = 0;
    let cgst = 0;
    let sgst = 0;

    if (isInterState) {
      igst = Math.round(baseAmount * 0.18);
    } else {
      cgst = Math.round(baseAmount * 0.09);
      sgst = Math.round(baseAmount * 0.09);
    }

    const totalAmount = baseAmount + igst + cgst + sgst;

    // Distribute statuses across the dataset
    // ~55% matched, ~18% amount_mismatch, ~12% missing_in_gstr2b, ~10% gstin_mismatch, ~5% unreconciled
    const statusSelector = currentId % 20;
    let status: Invoice["status"] = "matched";
    let gstr2bAmount: number | null = totalAmount;
    let vendorGstin = vendor.gstin;

    if (statusSelector === 3 || statusSelector === 8 || statusSelector === 14) {
      status = "amount_mismatch";
      const variance = (currentId % 2 === 0 ? 1 : -1) * ((currentId * 500) % 5000 + 500);
      gstr2bAmount = totalAmount + variance;
    } else if (statusSelector === 5 || statusSelector === 11) {
      status = "missing_in_gstr2b";
      gstr2bAmount = null;
    } else if (statusSelector === 7 || statusSelector === 16) {
      status = "gstin_mismatch";
      // Introduce an invalid GSTIN variant for format validation testing
      vendorGstin = vendor.gstin.substring(0, 10) + "99999";
    } else if (statusSelector === 19) {
      status = "unreconciled";
      gstr2bAmount = totalAmount;
    }

    result.push({
      id: `inv-${String(currentId).padStart(3, "0")}`,
      vendor_name: vendor.name,
      vendor_gstin: vendorGstin,
      invoice_number: `${vendor.code}-2026-${String(currentId * 3).padStart(3, "0")}`,
      invoice_date: dateStr,
      taxable_amount: baseAmount,
      igst,
      cgst,
      sgst,
      total_amount: totalAmount,
      gstr2b_amount: gstr2bAmount,
      status,
    });

    currentId++;
  }

  return result;
}
