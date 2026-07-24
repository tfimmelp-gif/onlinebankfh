export type LedgerSide = "DEBIT" | "CREDIT";

export type PostingEntry = {
  accountId: string;
  side: LedgerSide;
  amountMinor: bigint;
  statementDescription: string;
};

export function assertBalanced(entries: PostingEntry[]) {
  const total = (side: LedgerSide) =>
    entries.filter((entry) => entry.side === side)
      .reduce((sum, entry) => sum + entry.amountMinor, BigInt(0));
  if (entries.length < 2 || entries.some((entry) => entry.amountMinor <= BigInt(0))) {
    throw new Error("A posting requires at least two positive entries.");
  }
  if (total("DEBIT") !== total("CREDIT")) {
    throw new Error("Ledger transaction is not balanced.");
  }
}

export function reverseEntries(entries: PostingEntry[]): PostingEntry[] {
  return entries.map((entry) => ({
    ...entry,
    side: entry.side === "DEBIT" ? "CREDIT" : "DEBIT",
    statementDescription: `Correction reversal: ${entry.statementDescription}`,
  }));
}
