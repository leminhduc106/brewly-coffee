"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { subscribeToStoreOrders, getOrderStatistics, createOrder } from '@/lib/order-service';
import { allProducts } from '@/lib/data';
import type { Order } from '@/lib/types';
import { Coffee, Package, CheckCircle, Database, BarChart3, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const { toast } = useToast();

  // Simple test order creation function with different statuses
  const createTestOrders = async () => {
    const testOrders = [
      {
        userId: "test-user-1",
        items: [{
          ...allProducts[0], // First product
          cartId: "test-item-1",
          quantity: 2,
          selectedSize: "Medium",
          selectedMilk: "Whole Milk",
          selectedToppings: []
        }],
        subtotal: 50000,
        deliveryFee: 0,
        total: 50000,
        paymentMethod: 'cash' as const,
        deliveryOption: 'pickup' as const,
        storeId: "embassy-hcm",
        specialInstructions: "Test order - pending status"
      },
      {
        userId: "test-user-2", 
        items: [{
          ...allProducts[1], // Second product
          cartId: "test-item-2",
          quantity: 1,
          selectedSize: "Large",
          selectedMilk: "Oat Milk",
          selectedToppings: ["Extra Shot"]
        }],
        subtotal: 65000,
        deliveryFee: 15000,
        total: 80000,
        paymentMethod: 'qr' as const,
        deliveryOption: 'delivery' as const,
        storeId: "embassy-hcm",
        specialInstructions: "Test order - will be confirmed",
        deliveryAddress: {
          recipientName: "Test Customer",
          phoneNumber: "0123456789",
          streetAddress: "123 Test Street",
          ward: "Test Ward",
          district: "Test District", 
          city: "Ho Chi Minh City"
        }
      },
      {
        userId: "test-user-3",
        items: [{
          ...allProducts[2], // Third product
          cartId: "test-item-3",
          quantity: 1,
          selectedSize: "Small",
          selectedMilk: "Almond Milk",
          selectedToppings: []
        }],
        subtotal: 35000,
        deliveryFee: 0,
        total: 35000,
        paymentMethod: 'points' as const,
        deliveryOption: 'pickup' as const,
        storeId: "embassy-hcm",
        specialInstructions: "Test order - small drink"
      }
    ];

    const orderIds = [];
    for (const orderData of testOrders) {
      const orderId = await createOrder(orderData);
      orderIds.push(orderId);
    }

    return {
      message: `Created ${orderIds.length} test orders successfully! Use the Staff Dashboard to move them through different statuses.`,
      orderIds
    };
  };

  // Load real orders and stats
  useEffect(() => {
    const unsubscribe = subscribeToStoreOrders(
      "embassy-hcm", 
      (loadedOrders: Order[]) => {
        setOrders(loadedOrders);
        setIsLoading(false);
      }
    );

    // Load stats
    const loadStats = async () => {
      try {
        const storeStats = await getOrderStatistics("embassy-hcm");
        setStats(storeStats);
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    };
    loadStats();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleCreateTestOrders = async () => {
    setIsCreating(true);
    try {
      const result = await createTestOrders();
      toast({
        title: "✅ Test Orders Created",
        description: result.message,
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "❌ Creation Failed",
        description: error.message || "Could not create test orders",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Coffee className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Create test data and manage system settings
        </p>
      </div>

        {/* Current Orders Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Current Orders in Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                <span>Loading orders...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {orders.filter(o => o.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {orders.filter(o => o.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {stats ? `${Math.round(stats.totalRevenue).toLocaleString()}đ` : '0đ'}
                    </div>
                    <div className="text-sm text-gray-600">Today's Revenue</div>
                  </div>
                </div>

                {orders.length > 0 ? (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Recent Orders:</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">#{order.id.slice(-8)}</div>
                            <div className="text-sm text-gray-600">
                              {order.items.length} items • {order.total.toLocaleString()}đ
                            </div>
                          </div>
                          <Badge variant={
                            order.status === 'completed' ? 'default' :
                            order.status === 'pending' ? 'secondary' :
                            order.status === 'preparing' ? 'outline' : 'secondary'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No orders found in database</p>
                    <p className="text-sm">Create some test orders to get started!</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Test Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Create Test Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>This will create 3 test orders with different configurations:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>📋 Pending order (pickup, cash) - Medium coffee with whole milk</li>
                <li>🚚 Delivery order (QR payment) - Large coffee with oat milk + extra shot</li>
                <li>⭐ Points order (pickup) - Small coffee with almond milk</li>
              </ul>
              <p className="text-green-600">
                ✅ Use the Staff Dashboard to move orders through: Pending → Confirmed → Preparing → Ready → Completed
              </p>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <strong>Testing Flow:</strong> Go to <code>/staff</code> → Confirm orders → Start preparing → Mark ready → Complete
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleCreateTestOrders}
              disabled={isCreating}
              className="w-full"
              size="lg"
            >
              {isCreating ? (
                <>Creating Test Orders...</>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Test Orders
                </>
              )}
            </Button>
          </CardContent>
        </Card>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Use this to populate the staff dashboard with sample orders for testing.
        </p>
      </div>
    </div>
  );
}