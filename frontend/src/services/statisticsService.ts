import { apiClient } from "../axios/apiClient";

export interface MonthlyStatDto {
    month: string;
    year: number;
    adoptii: number;
    pierdute: number;
    evenimente: number;
}

export interface RecentActivityDto {
    type: string;
    action: string;
    detail: string;
    date: string;
}

export interface ContentCountsDto {
    adoptii: number;
    blogPosts: number;
    veterinaryClinics: number;
    quizResults: number;
    marketplaceListings: number;
    evenimente: number;
}

export interface StatisticsSummaryDto {
    totalPets: number;
    lostPetsActive: number;
    lostPetsRecoveredThisMonth: number;
    totalUsers: number;
    newUsersThisWeek: number;
    totalSitters: number;
    monthlyData: MonthlyStatDto[];
    recentActivity: RecentActivityDto[];
    contentCounts: ContentCountsDto;
}

export async function getStatisticsSummary(): Promise<StatisticsSummaryDto> {
    const { data } = await apiClient.get<StatisticsSummaryDto>("/statistics/summary");
    return data;
}
