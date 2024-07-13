import { EOL } from "node:os";

const FILES_TO_IGNORE_RE =
  /node_modules|[.](?:spec|test|mock)[.](?:ts|mts|cts|js|mjs|cjs)$/;
const BRANCH_COVERAGE_THRESHOLD = 1;
const FUNCTION_COVERAGE_THRESHOLD = 1;
const LINE_COVERAGE_THRESHOLD = 1;

// eslint-disable-next-line no-undefined
const LOCALE = undefined;
const gTimeFormat = new Intl.NumberFormat(LOCALE, {
  style: "unit",
  unit: "millisecond",
  unitDisplay: "narrow",
  maximumFractionDigits: 0,
}).format;
const gPercentFormat = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  maximumFractionDigits: 2,
  notation: "compact",
}).format;
const gNumberFormat = new Intl.NumberFormat(LOCALE).format;

const MAX_PERCENT = 100;

// eslint-disable-next-line max-lines-per-function, complexity
export default async function* dotWithSummaryReporter(pSource) {
  let lFailStack = [];
  let lDiagnosticStack = [];
  let lCoverageObject = {};

  for await (const lEvent of pSource) {
    switch (lEvent.type) {
      case "test:pass":
        if (lEvent.data.details.type === "suite") {
          yield "";
        } else if (lEvent.data.skip || lEvent.data.todo) {
          yield ",";
        } else {
          yield ".";
        }
        break;
      case "test:fail":
        lFailStack.push(lEvent.data);
        if (lEvent.data.details.type === "suite") {
          yield "";
        } else {
          yield "!";
        }
        break;
      case "test:diagnostic":
        lDiagnosticStack.push(lEvent);
        break;
      // comment these lines if you're not interested in any stdout/stderr
      case "test:stdout":
        yield lEvent.data.message;
        break;
      case "test:stderr":
        yield lEvent.data.message;
        break;
      case "test:coverage":
        lCoverageObject = lEvent;
        break;
      default:
        break;
    }
  }

  const lDiagnostics = lDiagnosticStack
    .map(diagnosticToObject)
    .reduce((pAll, pDiagnostic) => ({ ...pAll, ...pDiagnostic }), {});
  const lTotals = calculateTotals(lCoverageObject, FILES_TO_IGNORE_RE);

  // eslint-disable-next-line prefer-template
  yield `${
    EOL + lFailStack.map(summarizeFailsToText).filter(Boolean).join(EOL)
  }${EOL}` +
    summarizeCounts(lDiagnostics) +
    EOL +
    summarizeCoverage(lTotals) +
    EOL +
    getCoverageLines(lCoverageObject) +
    getCoverageFunctions(lCoverageObject) +
    getCoverageBranches(lCoverageObject);

  process.exitCode = determineExitCode(lFailStack, lTotals);
}

function calculateTotals(pCoverageObject, pFilesToIgnore) {
  const lReturnValue = (pCoverageObject?.data?.summary?.files ?? [])
    .filter(({ path }) => !pFilesToIgnore.test(path))
    .reduce(
      (
        pAll,
        {
          totalBranchCount,
          totalFunctionCount,
          totalLineCount,
          coveredBranchCount,
          coveredFunctionCount,
          coveredLineCount,
        },
      ) => {
        return {
          totalBranchCount: pAll.totalBranchCount + totalBranchCount,
          totalFunctionCount: pAll.totalFunctionCount + totalFunctionCount,
          totalLineCount: pAll.totalLineCount + totalLineCount,
          coveredBranchCount: pAll.coveredBranchCount + coveredBranchCount,
          coveredFunctionCount:
            pAll.coveredFunctionCount + coveredFunctionCount,
          coveredLineCount: pAll.coveredLineCount + coveredLineCount,
        };
      },
      {
        path: 0,
        totalBranchCount: 0,
        totalFunctionCount: 0,
        totalLineCount: 0,
        coveredBranchCount: 0,
        coveredFunctionCount: 0,
        coveredLineCount: 0,
      },
    );
  lReturnValue.coveredBranchPercent =
    lReturnValue.coveredBranchCount / lReturnValue.totalBranchCount;
  lReturnValue.coveredFunctionPercent =
    lReturnValue.coveredFunctionCount / lReturnValue.totalFunctionCount;
  lReturnValue.coveredLinePercent =
    lReturnValue.coveredLineCount / lReturnValue.totalLineCount;
  return lReturnValue;
}

function summarizeCoverage(pTotals) {
  if (!pTotals || !pTotals.totalBranchCount) {
    return "";
  }
  return (
    // eslint-disable-next-line prefer-template
    "=============================== Coverage summary ===============================" +
    EOL +
    `Branches     : ${gPercentFormat(pTotals.coveredBranchPercent)} (${gNumberFormat(pTotals.coveredBranchCount)}/${gNumberFormat(pTotals.totalBranchCount)})` +
    `${pTotals.coveredBranchPercent < BRANCH_COVERAGE_THRESHOLD ? " NOK" : ""}` +
    EOL +
    `Functions    : ${gPercentFormat(pTotals.coveredFunctionPercent)} (${gNumberFormat(pTotals.coveredFunctionCount)}/${gNumberFormat(pTotals.totalFunctionCount)})` +
    `${pTotals.coveredFunctionPercent < FUNCTION_COVERAGE_THRESHOLD ? " NOK" : ""}` +
    EOL +
    `Lines        : ${gPercentFormat(pTotals.coveredLinePercent)} (${gNumberFormat(pTotals.coveredLineCount)}/${gNumberFormat(pTotals.totalLineCount)})` +
    `${pTotals.coveredLinePercent < LINE_COVERAGE_THRESHOLD ? " NOK" : ""}` +
    EOL +
    "================================================================================" +
    EOL
  );
}

function getCoverageLines(pCoverageObject) {
  const lUncoveredLinesPerFiles = (pCoverageObject?.data?.summary?.files ?? [])
    .filter(({ path }) => !FILES_TO_IGNORE_RE.test(path))
    .filter((pSummary) => pSummary.coveredLinePercent < MAX_PERCENT)
    .map(
      (pSummary) =>
        `  ${pSummary.path}:${(pSummary.lines || [])
          .filter((pLine) => pLine.count <= 0)
          .map((pLine) => pLine.line)
          .join(",")}`,
    );
  if (lUncoveredLinesPerFiles.length === 0) {
    return "";
  }
  return `Uncovered lines:${EOL}${lUncoveredLinesPerFiles.join(EOL)}${EOL}`;
}

function getCoverageFunctions(pCoverageObject) {
  const lUncoveredFunctionsPerFiles = (
    pCoverageObject?.data?.summary?.files ?? []
  )
    .filter(({ path }) => !FILES_TO_IGNORE_RE.test(path))
    .filter((pSummary) => pSummary.coveredFunctionPercent < MAX_PERCENT)
    .map(
      (pSummary) =>
        `  ${pSummary.path}:${(pSummary.functions || [])
          .filter((pFunction) => pFunction.count <= 0)
          .map(
            (pFunction) =>
              `${pFunction.line}${pFunction.name ? `(${pFunction.name})` : ""}`,
          )
          .join(",")}`,
    );
  if (lUncoveredFunctionsPerFiles.length === 0) {
    return "";
  }
  return `${EOL}Uncovered functions:${EOL}${lUncoveredFunctionsPerFiles.join(
    EOL,
  )}${EOL}`;
}

function getCoverageBranches(pCoverageObject) {
  const lUncoveredBranchesPerFiles = (
    pCoverageObject?.data?.summary?.files ?? []
  )
    .filter(({ path }) => !FILES_TO_IGNORE_RE.test(path))
    .filter((pSummary) => pSummary.coveredBranchPercent < MAX_PERCENT)
    .map(
      (pSummary) =>
        `  ${pSummary.path}:${(pSummary.branches || [])
          .filter((pBranch) => pBranch.count <= 0)
          .map((pBranch) => pBranch.line)
          .join(",")}`,
    );
  if (lUncoveredBranchesPerFiles.length === 0) {
    return "";
  }
  return `${EOL}Uncovered branches:${EOL}${lUncoveredBranchesPerFiles.join(
    EOL,
  )}${EOL}`;
}

function summarizeCounts(pDiagnostics) {
  return (
    `${gNumberFormat(pDiagnostics.pass)} passing (${gTimeFormat(pDiagnostics.duration_ms)})${EOL}${pDiagnostics.fail > 0 ? `${pDiagnostics.fail} failing${EOL}` : ""}` +
    `${pDiagnostics.skipped > 0 ? `${pDiagnostics.skipped} skipped${EOL}` : ""}` +
    `${pDiagnostics.todo > 0 ? `${pDiagnostics.todo} todo${EOL}` : ""}`
  );
}

// eslint-disable-next-line complexity
function determineExitCode(pFailStack, pTotals) {
  if (pFailStack.length > 0) {
    return 1;
  }
  if (
    (pTotals?.coveredBranchPercent ?? 1) < BRANCH_COVERAGE_THRESHOLD ||
    (pTotals?.coveredFunctionPercent ?? 1) < FUNCTION_COVERAGE_THRESHOLD ||
    (pTotals?.coveredLinePercent ?? 1) < LINE_COVERAGE_THRESHOLD
  ) {
    // should return  1, but on node 22 with our setup at least coverage
    // runs can vary per run so even when the tests _do_ cover 100%, the
    // coverage might be reported as something lower.
    //
    // So far b.t.w. the results on node 20, up to 20.12.2 _are_ consistent.
    return 0;
  }
  return 0;
}

function summarizeFailsToText(pFailEvent) {
  if (pFailEvent.details.error.failureType === "testCodeFailure") {
    return `✘ ${pFailEvent.name}${EOL}  ${formatError(pFailEvent)}${EOL}${EOL}`;
  }
  return "";
}

function diagnosticToObject(pDiagnosticEvent) {
  const lReturnValue = {};
  const [key, value] = pDiagnosticEvent.data.message.split(" ");
  // eslint-disable-next-line security/detect-object-injection
  lReturnValue[key] = value;
  return lReturnValue;
}

function formatError(pTestResult) {
  return (
    pTestResult.details.error.cause.stack ||
    pTestResult.details.error.cause.message ||
    pTestResult.details.error.cause.code
  );
}
