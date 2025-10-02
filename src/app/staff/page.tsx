"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  subscribeToStoreOrders, 
  updateOrderStatus, 
  getOrderStatistics
} from '@/lib/order-service';
import { 
  cancelOrder
} from '@/lib/order-service';
import { calculateEstimatedPrepTime } from '@/lib/staff-management';
import { stores } from '@/lib/data';
import type { Order } from '@/lib/types';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Coffee, 
  Users, 
  DollarSign,
  Package,
  Timer,
  MapPin,
  Phone,
  Truck,
  XCircle
} from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function StaffDashboard() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [todayStats, setTodayStats] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("queue");
  const [isLoading, setIsLoading] = useState(true);
  // Cancellation dialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderBeingCancelled, setOrderBeingCancelled] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const cancellationReasons = [
    'Customer request',
    'Out of stock / unavailable',
    'Unable to contact customer',
    'Suspicious / fraud concern',
    'Other'
  ];

  // Get user's store info
  // Normalize legacy numeric IDs to new slug IDs (migration safeguard)
  const normalizeStoreId = (raw?: string): string | undefined => {
    if (!raw) return undefined;
    // Map old numeric IDs to new slugs
    const legacyMap: Record<string, string> = {
      '1': 'embassy-hcm',
      '2': 'embassy-hanoi',
      '3': 'embassy-hcm-q5'
    };
    return legacyMap[raw] || raw;
  };

  const normalizedUserStoreId = normalizeStoreId(userProfile?.storeId);
  const userStore = stores.find(store => store.id === normalizedUserStoreId);
  const storeId = normalizedUserStoreId || stores[0].id; // Fallback to first store

  // Filter orders by status for different tabs
  const activeOrders = allOrders.filter(order => 
    ['pending', 'confirmed'].includes(order.status)
  );
  
  const preparingOrders = allOrders.filter(order => 
    ['preparing', 'ready'].includes(order.status)
  );
  
  const completedOrders = allOrders.filter(order => 
    order.status === 'completed'
  );
  
  const kitchenOrders = allOrders.filter(order => 
    ['confirmed', 'preparing'].includes(order.status)
  );

  // Subscribe to real-time orders
  useEffect(() => {
    if (!storeId) return;

    setIsLoading(true);
    const unsubscribe = subscribeToStoreOrders(
      storeId, 
      (orders: Order[]) => {
        // Store all orders, we'll filter per tab
        setAllOrders(orders);
        setIsLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [storeId]);

  // Load today's statistics
  useEffect(() => {
    const loadStats = async () => {
      if (!storeId) return;
      
      try {
        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const stats = await getOrderStatistics(storeId);
        setTodayStats({
          totalOrders: stats.totalOrders,
          pending: stats.pending,
          preparing: stats.preparing,
          ready: stats.ready,
          completed: stats.completed,
          cancelled: stats.cancelled,
          totalRevenue: stats.totalRevenue,
          averageOrderValue: stats.averageOrderValue
        });
      } catch (error) {
        console.error("Error loading stats:", error);
        // Set default stats on error
        setTodayStats({
          totalOrders: 0,
          pending: 0,
          preparing: 0,
          ready: 0,
          completed: 0,
          cancelled: 0,
          totalRevenue: 0,
          averageOrderValue: 0
        });
      }
    };

    loadStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [storeId]);

  const openCancelDialog = (order: Order) => {
    setOrderBeingCancelled(order);
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!orderBeingCancelled || !userProfile) return;
    if (!cancelReason.trim()) {
      toast({
        variant: 'destructive',
        title: 'Lý do cần thiết / Reason Required',
        description: 'Vui lòng chọn hoặc nhập lý do huỷ đơn. / Please select or enter a cancellation reason.'
      });
      return;
    }
    try {
      await cancelOrder(orderBeingCancelled.id, userProfile.uid, cancelReason.trim());
      toast({
        title: 'Đơn hàng đã huỷ / Order Cancelled',
        description: `Đã huỷ đơn với lý do: ${cancelReason}`
      });
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Huỷ thất bại / Cancellation Failed',
        description: e?.message || 'Không thể huỷ đơn hàng. / Could not cancel order.'
      });
    } finally {
      setCancelDialogOpen(false);
      setOrderBeingCancelled(null);
      setCancelReason("");
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status'], estimatedTime?: number) => {
    if (!userProfile) return;
    try {
      await updateOrderStatus(orderId, newStatus, userProfile.uid, undefined, estimatedTime);
      
      toast({
        title: "✅ Cập nhật thành công / Order Updated",
        description: `Trạng thái đơn hàng đã chuyển thành ${newStatus} / Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast({
        variant: "destructive",
        title: "❌ Cập nhật thất bại / Update Failed",
        description: error.message || "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại. / Could not update order status. Please try again.",
      });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  return (
    <ProtectedRoute allowedRoles={['staff', 'manager', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <Coffee className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="font-headline text-2xl font-bold text-gray-900">
                    AMBASSADOR's COFFEE
                  </h1>
                  <p className="text-sm text-gray-600">
                    Staff Dashboard • {userStore?.name || 'Embassy Location'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="px-3 py-1">
                  <Users className="w-4 h-4 mr-1" />
                  {userProfile?.name}
                </Badge>
                <Badge className="px-3 py-1 bg-primary">
                  {userProfile?.role ? 
                    userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1) : 
                    'Staff'
                  }
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Overview */}
          {todayStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{todayStats.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{todayStats.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Coffee className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Preparing</p>
                      <p className="text-2xl font-bold text-gray-900">{todayStats.preparing}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {todayStats.totalRevenue.toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="queue" className="flex items-center gap-2">
                Order Queue {activeOrders.length > 0 && (<Badge variant="secondary" className="ml-1 text-xs">{activeOrders.length}</Badge>)}
              </TabsTrigger>
              <TabsTrigger value="preparing" className="flex items-center gap-2">
                Preparing {preparingOrders.length > 0 && (<Badge variant="secondary" className="ml-1 text-xs">{preparingOrders.length}</Badge>)}
              </TabsTrigger>
              <TabsTrigger value="kitchen" className="flex items-center gap-2">
                Kitchen Display {kitchenOrders.length > 0 && (<Badge variant="secondary" className="ml-1 text-xs">{kitchenOrders.length}</Badge>)}
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                Completed {completedOrders.length > 0 && (<Badge variant="secondary" className="ml-1 text-xs">{completedOrders.length}</Badge>)}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="queue" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Active Orders ({activeOrders.length})</h2>
                <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Refresh
                </Button>
              </div>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading orders...</p>
                </div>
              ) : activeOrders.length === 0 ? (
                <Card><CardContent className="text-center py-12"><Coffee className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900 mb-2">No Active Orders</h3><p className="text-gray-600">All orders are completed. Great work!</p></CardContent></Card>
              ) : (
                <div className="grid gap-4">
                  {activeOrders.map(order => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{formatTime(order.createdAt)} • {getTimeAgo(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(order.status)}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
                            <Badge variant="outline">{order.deliveryOption === 'pickup' ? (<><Package className="w-3 h-3 mr-1" />Pickup</>) : (<><Truck className="w-3 h-3 mr-1" />Delivery</>)}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {order.deliveryOption === 'delivery' && order.deliveryAddress && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div className="text-sm">
                                <p className="font-medium">{order.deliveryAddress.recipientName}</p>
                                <p className="text-gray-600">{order.deliveryAddress.streetAddress}, {order.deliveryAddress.ward}</p>
                                <p className="text-gray-600">{order.deliveryAddress.district}, {order.deliveryAddress.city}</p>
                                {order.deliveryAddress.phoneNumber && (<p className="flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{order.deliveryAddress.phoneNumber}</p>)}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="space-y-3 mb-4">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded-lg object-cover" />
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">{item.selectedSize} • {item.selectedMilk}{item.selectedToppings && item.selectedToppings.length > 0 && (<> • {item.selectedToppings.join(', ')}</>)}</p>
                              </div>
                              <Badge variant="secondary">x{item.quantity}</Badge>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mb-4 p-3 bg-green-50 rounded-lg"><span className="font-medium">Total Amount:</span><span className="font-bold text-lg">{order.total.toLocaleString()}₫</span></div>
                        <div className="mt-2">
                          {order.status === 'pending' && (
                            <div className="flex w-full gap-3">
                              <Button 
                                onClick={() => handleStatusUpdate(order.id, 'confirmed')} 
                                size="sm" 
                                className="flex-1 h-10"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                              </Button>
                              <Button 
                                type="button" 
                                size="sm" 
                                variant="outline" 
                                onClick={() => openCancelDialog(order)} 
                                className="flex-1 h-10 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                          {order.status !== 'pending' && (
                            <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
                              {order.status === 'confirmed' && (<Button onClick={() => { const est = calculateEstimatedPrepTime(order.items); handleStatusUpdate(order.id, 'preparing', est); }} size="sm" className="col-span-1"><Timer className="w-4 h-4 mr-1" /> Start</Button>)}
                              {order.status === 'preparing' && (<Button onClick={() => handleStatusUpdate(order.id, 'ready')} size="sm" className="col-span-1"><AlertCircle className="w-4 h-4 mr-1" /> Ready</Button>)}
                              {order.status === 'ready' && (<Button onClick={() => handleStatusUpdate(order.id, 'completed')} size="sm" className="col-span-1 bg-green-600 hover:bg-green-700"><CheckCircle className="w-4 h-4 mr-1" /> Done</Button>)}
                              {['confirmed','preparing','ready'].includes(order.status) && (<Button type="button" size="sm" variant="outline" onClick={() => openCancelDialog(order)} className="col-span-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"><XCircle className="w-4 h-4 mr-1" /> Cancel</Button>)}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Preparing Tab */}
            <TabsContent value="preparing" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Preparing Orders ({preparingOrders.length})</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : preparingOrders.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <Timer className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No orders being prepared</h3>
                    <p>Orders in preparation will appear here</p>
                  </div>
                ) : (
                  preparingOrders.map((order: Order) => (
                    <Card key={order.id} className={`${
                      order.status === 'preparing' ? 'bg-orange-50 border-orange-200' : 
                      order.status === 'ready' ? 'bg-green-50 border-green-200' : 
                      'bg-white'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg font-bold">#{order.id.slice(-8)}</CardTitle>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {order.deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'} • 
                            {order.paymentMethod.toUpperCase()}
                          </p>
                          <p>
                            <Clock className="w-4 h-4 inline mr-1" />
                            Ordered: {getTimeAgo(order.createdAt)}
                            {order.estimatedTime && (
                              <> • Est: {order.estimatedTime}min</>
                            )}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-start py-2 border-b last:border-b-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  {item.selectedSize} • {item.selectedMilk}
                                </p>
                                {item.selectedToppings && item.selectedToppings.length > 0 && (
                                  <p className="text-sm font-medium text-orange-600">
                                    + {item.selectedToppings.join(', ')}
                                  </p>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <Badge variant="secondary" className="mb-1">
                                  x{item.quantity}
                                </Badge>
                                <p className="text-sm font-medium">
                                  {item.price.toLocaleString()}đ
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-primary">{order.total.toLocaleString()}đ</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {order.status === 'preparing' && (
                            <Button
                              onClick={() => handleStatusUpdate(order.id, 'ready')}
                              className="flex-1"
                              variant="default"
                            >
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Mark Ready
                            </Button>
                          )}
                          
                          {order.status === 'ready' && (
                            <Button
                              onClick={() => handleStatusUpdate(order.id, 'completed')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete Order
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Kitchen Display Tab */}
            <TabsContent value="kitchen" className="space-y-4">
              <h2 className="text-lg font-semibold">Kitchen Display System ({kitchenOrders.length})</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {kitchenOrders.map((order) => (
                    <Card key={order.id} className="bg-yellow-50 border-yellow-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl font-bold">#{order.id.slice(-8)}</CardTitle>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Ordered: {getTimeAgo(order.createdAt)}
                          {order.estimatedTime && (
                            <> • Est: {order.estimatedTime}min</>
                          )}
                        </p>
                      </CardHeader>
                      <CardContent>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <div>
                              <p className="font-medium text-lg">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.selectedSize} • {item.selectedMilk}
                              </p>
                              {item.selectedToppings && item.selectedToppings.length > 0 && (
                                <p className="text-sm font-medium text-orange-600">
                                  + {item.selectedToppings.join(', ')}
                                </p>
                              )}
                            </div>
                            <Badge variant="secondary" className="text-lg px-3 py-1">
                              x{item.quantity}
                            </Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Completed Orders Tab */}
            <TabsContent value="completed" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Completed Orders ({completedOrders.length})</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : completedOrders.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No completed orders</h3>
                    <p>Completed orders will appear here</p>
                  </div>
                ) : (
                  completedOrders.map((order: Order) => (
                    <Card key={order.id} className="bg-green-50 border-green-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg font-bold">#{order.id.slice(-8)}</CardTitle>
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            COMPLETED
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <MapPin className="w-4 h-4 inline mr-1" />
                            {order.deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'} • 
                            {order.paymentMethod.toUpperCase()}
                          </p>
                          <p>
                            <Clock className="w-4 h-4 inline mr-1" />
                            Completed: {getTimeAgo(order.createdAt)}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-start py-2 border-b last:border-b-0">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  {item.selectedSize} • {item.selectedMilk}
                                </p>
                                {item.selectedToppings && item.selectedToppings.length > 0 && (
                                  <p className="text-sm font-medium text-orange-600">
                                    + {item.selectedToppings.join(', ')}
                                  </p>
                                )}
                              </div>
                              <div className="text-right ml-4">
                                <Badge variant="secondary" className="mb-1">
                                  x{item.quantity}
                                </Badge>
                                <p className="text-sm font-medium">
                                  {item.price.toLocaleString()}đ
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-green-600">{order.total.toLocaleString()}đ</span>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="pt-2 text-center">
                          <p className="text-sm text-green-600 font-medium">
                            ✅ Order completed successfully
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Cancellation Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold">
                Huỷ đơn hàng #{orderBeingCancelled?.id.slice(-8)}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {/* Display order details */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Bạn đang cố gắng huỷ đơn hàng này. Vui lòng chọn lý do huỷ.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2">
                {cancellationReasons.map((reason, index) => (
                  <Button 
                    key={index} 
                    variant={cancelReason === reason ? "default" : "outline"} 
                    onClick={() => setCancelReason(reason)} 
                    className="w-full text-left justify-start"
                  >
                    {reason}
                  </Button>
                ))}
                <Button 
                  variant={cancelReason === 'other' ? "default" : "outline"} 
                  onClick={() => setCancelReason('other')} 
                  className="w-full text-left justify-start"
                >
                  Khác (vui lòng ghi rõ)
                </Button>
              </div>
              {cancelReason === 'other' && (
                <textarea
                  value={cancelReason === 'other' ? '' : cancelReason}
                  onChange={(e) => setCancelReason(e.target.value || 'other')}
                  className="mt-2 w-full p-2 border rounded-md focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Vui lòng ghi rõ lý do huỷ đơn hàng."
                />
              )}
            </div>
            <AlertDialogFooter>
              <Button 
                onClick={() => setCancelDialogOpen(false)} 
                variant="outline" 
                className="mr-2"
              >
                Huỷ
              </Button>
              <Button 
                onClick={handleCancelOrder} 
                variant="destructive"
              >
                Xác nhận huỷ
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  );
}