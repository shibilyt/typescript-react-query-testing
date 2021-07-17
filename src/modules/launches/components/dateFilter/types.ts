export type DateFilterType = {
  startDate: Date | null;
  endDate: Date | null;
};

export enum filterStatuses {
  pastWeek = "Last Week",
  pastMonth = "Last Month",
  pastThreeMonths = "Last 3 Months",
  pastSixMonths = "Last 6 Months",
  pastYear = "Last Year",
  pastTwoYear = "Last 2 Year",
}
