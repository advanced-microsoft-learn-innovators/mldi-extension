import type { ResponseGetScrapedHtmlSummary } from "@advanced-microsoft-learn-innovators/mldi-types";

export const convertJsonToResponseGetScrapedHtmlSummary = (
  jsonRes: any,
): ResponseGetScrapedHtmlSummary => {
  // if missing any of the required fields, throw an error
  if (
    !jsonRes.message ||
    !jsonRes.isSummary ||
    !jsonRes.isSectionSummary ||
    !jsonRes.aoaiOutputJson ||
    !jsonRes.aoaiOutputJsonHeadings ||
    !jsonRes.aoaiSectionSummaryDataIndices
  ) {
    throw new Error(
      "Missing required fields in JSON response from NestJS server",
    );
  }

  return {
    message: jsonRes.message,
    isSummary: jsonRes.isSummary,
    isSectionSummary: jsonRes.isSectionSummary,
    aoaiOutputJson: jsonRes.aoaiOutputJson,
    aoaiOutputJsonHeadings: jsonRes.aoaiOutputJsonHeadings,
    aoaiSectionSummaryDataIndices: jsonRes.aoaiSectionSummaryDataIndices,
  };
};
