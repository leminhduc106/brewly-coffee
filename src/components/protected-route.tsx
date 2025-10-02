"use client";

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Coffee } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackMessage?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackMessage = "You don't have permission to access this area." 
}) => {
  const { user, userProfile, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium">Đang kiểm tra quyền truy cập...</p>
            <p className="text-sm text-muted-foreground opacity-75">Checking authorization...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Coffee className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="font-headline text-2xl">
              Yêu cầu đăng nhập nhân viên
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Staff Access Required</p>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6 space-y-2">
              <p className="text-muted-foreground">
                Vui lòng đăng nhập bằng tài khoản nhân viên để truy cập bảng điều khiển.
              </p>
              <p className="text-sm text-muted-foreground opacity-75">
                Please sign in with your staff credentials to access the dashboard.
              </p>
            </div>
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <a href="/login">Đăng nhập / Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No user profile or insufficient role
  if (!userProfile || !allowedRoles.includes(userProfile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <CardTitle className="font-headline text-2xl">
              Không có quyền truy cập
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Access Denied</p>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4 space-y-2">
              <p className="text-muted-foreground">
                Bạn không có quyền truy cập vào khu vực này. Vui lòng liên hệ quản lý để được hỗ trợ.
              </p>
              <p className="text-sm text-muted-foreground opacity-75">
                You don't have permission to access this area. Please contact your manager for assistance.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
              <p className="text-sm text-amber-800">
                <strong>Vai trò của bạn / Your Role:</strong> {userProfile?.role || "Chưa được phân quyền / No role assigned"}
              </p>
              <p className="text-sm text-amber-800">
                <strong>Quyền yêu cầu / Required Roles:</strong> {allowedRoles.join(", ")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <a href="/">Về trang chủ / Go Home</a>
              </Button>
              <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                <a href="/staff-join">Liên hệ hỗ trợ / Get Help</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
};