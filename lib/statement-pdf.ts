export type StatementPdfEntry = {
  reference: string;
  direction: "CREDIT" | "DEBIT";
  amountMinor: number;
  description: string;
  effectiveAt: string;
};

export type StatementPdfInput = {
  period: string;
  customerName: string;
  accountType: string;
  accountNumber: string;
  currentBalanceMinor: number;
  generatedAt: string;
  entries: StatementPdfEntry[];
};

function safeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "-")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function money(minor: number) {
  const sign = minor < 0 ? "-" : "";
  return `${sign}$${(Math.abs(minor) / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function text(value: string, x: number, y: number, size: number, font = "F1", color = "0.14 0.20 0.29") {
  return `BT ${color} rg /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${safeText(value)}) Tj ET`;
}

function rightText(value: string, right: number, y: number, size: number, font = "F1", color = "0.14 0.20 0.29") {
  const estimatedWidth = safeText(value).length * size * (font === "F2" ? 0.56 : 0.5);
  return text(value, Math.max(40, right - estimatedWidth), y, size, font, color);
}

function truncated(value: string, length: number) {
  return value.length > length ? `${value.slice(0, length - 3)}...` : value;
}

function pageContent(input: StatementPdfInput, entries: StatementPdfEntry[], pageNumber: number, pageCount: number) {
  const creditTotal = input.entries
    .filter((entry) => entry.direction === "CREDIT")
    .reduce((sum, entry) => sum + entry.amountMinor, 0);
  const debitTotal = input.entries
    .filter((entry) => entry.direction === "DEBIT")
    .reduce((sum, entry) => sum + entry.amountMinor, 0);
  const commands: string[] = [
    "1 1 1 rg 0 0 612 792 re f",
    "0.055 0.118 0.2 rg 0 704 612 88 re f",
    "0.93 0.69 0.23 rg 44 738 m 52 754 l 60 738 l 52 722 l h f",
    "0.93 0.69 0.23 rg 36 738 m 52 746 l 68 738 l 52 730 l h f",
    text("NORTHSTAR", 82, 747, 17, "F2", "1 1 1"),
    text("DIGITAL BANKING", 82, 732, 7, "F1", "0.72 0.80 0.89"),
    rightText("OFFICIAL ACCOUNT STATEMENT", 568, 741, 7, "F2", "0.93 0.69 0.23"),
    text("MONTHLY ACCOUNT STATEMENT", 40, 675, 8, "F2", "0.22 0.36 0.63"),
    text(input.period, 40, 651, 22, "F2", "0.10 0.17 0.27"),
    rightText(`Generated ${new Date(input.generatedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}`, 570, 654, 8, "F1", "0.40 0.46 0.55"),
    "0.965 0.973 0.982 rg 40 602 532 36 re f",
    text(input.customerName, 54, 621, 9, "F2"),
    text(`${input.accountType} account`, 54, 609, 7, "F1", "0.40 0.46 0.55"),
    rightText(`Account ${input.accountNumber}`, 558, 615, 9, "F2"),
  ];

  const summaries = [
    { x: 40, label: "CURRENT POSTED BALANCE", value: money(input.currentBalanceMinor), color: "0.12 0.25 0.50" },
    { x: 222, label: "PERIOD CREDITS", value: money(creditTotal), color: "0.08 0.45 0.34" },
    { x: 404, label: "PERIOD DEBITS", value: money(debitTotal), color: "0.65 0.24 0.24" },
  ];
  for (const summary of summaries) {
    commands.push(
      "0.985 0.988 0.993 rg",
      `${summary.x} 535 168 52 re f`,
      text(summary.label, summary.x + 13, 570, 6.5, "F2", "0.44 0.50 0.59"),
      text(summary.value, summary.x + 13, 550, 13, "F2", summary.color),
    );
  }

  commands.push(
    text("TRANSACTION ACTIVITY", 40, 510, 8, "F2", "0.14 0.20 0.29"),
    rightText(`${input.entries.length} item${input.entries.length === 1 ? "" : "s"}`, 570, 510, 7, "F1", "0.44 0.50 0.59"),
    "0.09 0.17 0.28 rg 40 478 532 24 re f",
    text("DATE", 52, 487, 6.5, "F2", "0.82 0.87 0.93"),
    text("DESCRIPTION", 130, 487, 6.5, "F2", "0.82 0.87 0.93"),
    text("REFERENCE", 370, 487, 6.5, "F2", "0.82 0.87 0.93"),
    rightText("AMOUNT", 558, 487, 6.5, "F2", "0.82 0.87 0.93"),
  );

  if (entries.length === 0) {
    commands.push(
      "0.975 0.98 0.986 rg 40 427 532 51 re f",
      text("No posted activity for this statement period.", 180, 448, 9, "F1", "0.43 0.49 0.57"),
    );
  } else {
    entries.forEach((entry, index) => {
      const top = 478 - index * 25;
      const baseline = top - 16;
      if (index % 2 === 1) commands.push(`0.977 0.982 0.989 rg 40 ${top - 25} 532 25 re f`);
      commands.push(
        "0.89 0.91 0.94 RG 0.5 w",
        `40 ${top - 25} m 572 ${top - 25} l S`,
        text(new Date(entry.effectiveAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }), 52, baseline, 7.5),
        text(truncated(entry.description, 38), 130, baseline, 7.5, "F2"),
        text(truncated(entry.reference, 18), 370, baseline, 6.8, "F1", "0.42 0.48 0.57"),
        rightText(`${entry.direction === "CREDIT" ? "+" : "-"}${money(entry.amountMinor)}`, 558, baseline, 7.8, "F2", entry.direction === "CREDIT" ? "0.08 0.45 0.34" : "0.58 0.24 0.24"),
      );
    });
  }

  commands.push(
    "0.91 0.93 0.95 RG 0.6 w 40 62 m 572 62 l S",
    text("ACCOUNT STATEMENT", 40, 43, 6.5, "F2", "0.22 0.36 0.63"),
    text("Keep this statement for your records. Contact support promptly if any transaction appears incorrect.", 40, 30, 6.5, "F1", "0.44 0.50 0.59"),
    rightText(`Page ${pageNumber} of ${pageCount}`, 572, 38, 7, "F2", "0.40 0.46 0.55"),
  );
  return commands.join("\n");
}

export function makeStyledStatementPdf(input: StatementPdfInput) {
  const entriesPerPage = 15;
  const pageEntries = input.entries.length
    ? Array.from({ length: Math.ceil(input.entries.length / entriesPerPage) }, (_, index) =>
        input.entries.slice(index * entriesPerPage, (index + 1) * entriesPerPage))
    : [[]];
  const streams = pageEntries.map((entries, index) => pageContent(input, entries, index + 1, pageEntries.length));
  const kids = streams.map((_, index) => `${5 + index * 2} 0 R`).join(" ");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${kids}] /Count ${streams.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
  ];
  streams.forEach((stream, index) => {
    const pageId = 5 + index * 2;
    const contentId = pageId + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}
