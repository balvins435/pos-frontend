// salesService.ts
import { Sale } from '../types';   // <-- make sure types match Django
import { apiService } from './api';

class SalesService {
  async getAllSales(): Promise<Sale[]> {
    return apiService.get<Sale[]>('/sales/');
  }

  async getSale(id: number): Promise<Sale> {
    return apiService.get<Sale>(`/sales/${id}/`);
  }

  async createSale(sale: Omit<Sale, 'id' | 'date' | 'user'>): Promise<Sale> {
    return apiService.post<Sale>('/sales/', sale);
  }

  async updateSale(id: number, updates: Partial<Sale>): Promise<Sale> {
    return apiService.patch<Sale>(`/sales/${id}/`, updates);
  }

  async cancelSale(id: number): Promise<void> {
    return apiService.patch<void>(`/sales/${id}/cancel/`, {});
  }

  // 🔹 Optional: only if you add custom endpoints in Django later
  async getTodaysSales(): Promise<Sale[]> {
    const today = new Date().toISOString().split('T')[0];
    return apiService.get<Sale[]>(`/sales/date/${today}/`);
  }

  async getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    return apiService.get<Sale[]>(`/sales/range/?start=${startDate}&end=${endDate}`);
  }

  async getSalesAnalytics(period: 'today' | 'week' | 'month' | 'year'): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  }> {
    return apiService.get(`/sales/analytics/${period}/`);
  }

  async getCustomers(): Promise<
    Array<{ id: number; name: string; email: string; phone: string }>
  > {
    return apiService.get('/customers/');
  }

  async createCustomer(customer: {
    name: string;
    email: string;
    phone: string;
  }): Promise<{ id: number; name: string; email: string; phone: string }> {
    return apiService.post('/customers/', customer);
  }
}

export const salesService = new SalesService();
