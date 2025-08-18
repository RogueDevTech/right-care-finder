export class ChartDataDto {
  topCategories: { category: string; count: number }[];
  revenueByDay: { date: string; revenue: number }[];
  careHomeStatusDistribution: { status: string; count: number }[];
  topProducts: { id: string; name: string; sales: number; revenue: number }[];
}
