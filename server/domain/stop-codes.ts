export type TransferRail = "INTERNAL" | "DOMESTIC" | "INTERNATIONAL";
export type StopRestriction =
  | "ALL_ACTIVITY" | "ALL_DEBITS" | "ALL_CREDITS" | "ALL_TRANSFERS"
  | "INTERNAL_TRANSFERS" | "DOMESTIC_TRANSFERS" | "INTERNATIONAL_TRANSFERS"
  | "LOAN_DISBURSEMENT";

export function blocksTransfer(restrictions: StopRestriction[], rail: TransferRail) {
  return restrictions.some((restriction) =>
    restriction === "ALL_ACTIVITY" ||
    restriction === "ALL_DEBITS" ||
    restriction === "ALL_TRANSFERS" ||
    (rail === "INTERNAL" && restriction === "INTERNAL_TRANSFERS") ||
    (rail === "DOMESTIC" && restriction === "DOMESTIC_TRANSFERS") ||
    (rail === "INTERNATIONAL" && restriction === "INTERNATIONAL_TRANSFERS")
  );
}
