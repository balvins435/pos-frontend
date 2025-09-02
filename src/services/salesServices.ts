// salesService.ts
import { Sale } from '../types';
import { apiService } from './api';

class SalesService {
  async getAllSales(): Promise<Sale[]> {
    return apiService.get<Sale[]>('/sales');
  }

  async getSale(id: string): Promise<Sale> {
    return apiService.get<Sale>(`/sales/${id}`);
  }

  async createSale(sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>): Promise<Sale> {
    return apiService.post<Sale>('/sales', sale);
  }

  async updateSale(id: string, updates: Partial<Sale>): Promise<Sale> {
    return apiService.patch<Sale>(`/sales/${id}`, updates);
  }

  async cancelSale(id: string): Promise<void> {
    return apiService.patch<void>(`/sales/${id}/cancel`, {});
  }

  async getTodaysSales(): Promise<Sale[]> {
    const today = new Date().toISOString().split('T')[0];
    return apiService.get<Sale[]>(`/sales/date/${today}`);
  }

  async getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
    return apiService.get<Sale[]>(`/sales/range?start=${startDate}&end=${endDate}`);
  }

  async getSalesAnalytics(period: 'today' | 'week' | 'month' | 'year'): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  }> {
    return apiService.get(`/sales/analytics/${period}`);
  }

  async getCustomers(): Promise<Array<{ id: string; name: string; email: string; phone: string }>> {
    return apiService.get('/customers');
  }

  async createCustomer(customer: { name: string; email: string; phone: string }): Promise<{ id: string; name: string; email: string; phone: string }> {
    return apiService.post('/customers', customer);
  }
}

export const salesService = new SalesService();