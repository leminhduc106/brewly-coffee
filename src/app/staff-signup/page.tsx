"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/user-service";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Coffee, Shield, Eye, EyeOff } from "lucide-react";

interface StaffSignupForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: "staff" | "manager";
  storeId: string;
}

const stores = [
  { id: "embassy-hcm", name: "Embassy Ho Chi Minh City", address: "District 1, HCMC" },
  { id: "embassy-hanoi", name: "Embassy Hanoi", address: "Ba Dinh District, Hanoi" },
  { id: "embassy-danang", name: "Embassy Da Nang", address: "Hai Chau District, Da Nang" },
];

export default function StaffSignupPage() {
  // Soft-disable open signup unless query contains ?invite=VALID (future logic)
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (!invite) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <CardTitle>Direct Staff Signup Disabled</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Public creation of staff/manager accounts is now restricted to prevent unauthorized access.
              </p>
              <Button asChild className="w-full">
                <a href="/staff-request">Request Access Instead</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  // using centralized auth instance from firebase.ts
  
  const form = useForm<StaffSignupForm>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      role: "staff",
      storeId: "",
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form;
  const selectedRole = watch("role");
  const selectedStore = watch("storeId");

  const handleSubmit_ = async (data: StaffSignupForm) => {
    if (loading) return;

    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    if (data.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password should be at least 6 characters long.",
      });
      return;
    }

    setLoading(true);

    try {
      // Generate Employee ID
      const employeeId = `${data.role.toUpperCase()}${Date.now().toString().slice(-3)}`;
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Create staff profile in Firestore
      await createUserProfile(userCredential.user.uid, {
        email: data.email,
        name: data.name,
        role: data.role,
        storeId: data.storeId,
        employeeId: employeeId,
        hireDate: new Date().toISOString().split('T')[0], // Today's date
        avatar: `https://i.pravatar.cc/150?u=${employeeId}`,
      });

      toast({
        title: "✅ Staff Account Created!",
        description: `${data.role === 'manager' ? 'Manager' : 'Staff'} account created successfully. You can now sign in.`,
        duration: 5000,
      });

      // Redirect to login page
      router.push("/login");

    } catch (error: any) {
      console.error("Staff signup error:", error);
      
      let errorMessage = "Failed to create staff account. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "An account with this email already exists.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      toast({
        variant: "destructive",
        title: "Signup Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold">AMBASSADOR's COFFEE</CardTitle>
          </div>
          <p className="text-xl font-semibold text-primary">Staff Registration</p>
          <p className="text-muted-foreground">
            Create your staff or manager account to access the dashboard
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(handleSubmit_)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...register("name", { required: "Name is required" })}
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="staff@ambassadors-coffee.com"
                    {...register("email", { required: "Email is required" })}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      {...register("password", { required: "Password is required" })}
                      disabled={loading}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      {...register("confirmPassword", { required: "Please confirm password" })}
                      disabled={loading}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Role & Store */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Position & Location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={selectedRole}
                    onValueChange={(value: "staff" | "manager") => setValue("role", value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">
                        <div className="flex items-center gap-2">
                          <Coffee className="h-4 w-4" />
                          <span>Staff</span>
                          <Badge variant="secondary">Standard Access</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="manager">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          <span>Manager</span>
                          <Badge variant="default">Full Access</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={`${selectedRole.toUpperCase()}${Date.now().toString().slice(-3)}`}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    ✨ Auto-generated based on role and timestamp
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeId">Embassy Location *</Label>
                <Select
                  value={selectedStore}
                  onValueChange={(value) => setValue("storeId", value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your embassy location" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{store.name}</span>
                          <span className="text-sm text-muted-foreground">{store.address}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.storeId && (
                  <p className="text-sm text-red-500">Please select a store location</p>
                )}
              </div>
            </div>

            {/* Role Description */}
            {selectedRole && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="font-semibold mb-2">
                  {selectedRole === 'manager' ? 'Manager' : 'Staff'} Permissions:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Access staff dashboard</li>
                  <li>✅ Manage incoming orders</li>
                  <li>✅ Update order status in real-time</li>
                  <li>✅ View kitchen display system</li>
                  {selectedRole === 'manager' && (
                    <>
                      <li>✅ View analytics and reports</li>
                      <li>✅ Manage store settings</li>
                      <li>✅ Access advanced features</li>
                    </>
                  )}
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>Creating Account...</>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Create {selectedRole === 'manager' ? 'Manager' : 'Staff'} Account
                </>
              )}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/login")}
                disabled={loading}
              >
                Already have an account? Sign In
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}