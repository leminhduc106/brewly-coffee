
"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {

  const [isSignUp, setIsSignUp] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signUp, signIn, signInWithGoogle, loading } = useAuth();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: { email: "", password: "" },
  });

  const getFriendlyError = (err: any) => {
    if (!err || !err.code) return "Đăng nhập thất bại. Vui lòng thử lại. / Authentication failed. Please try again.";
    switch (err.code) {
      case "auth/email-already-in-use":
        return "Email này đã được sử dụng. Vui lòng sử dụng email khác. / An account with this email already exists.";
      case "auth/invalid-email":
        return "Vui lòng nhập địa chỉ email hợp lệ. / Please enter a valid email address.";
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Email hoặc mật khẩu không đúng. / Incorrect email or password.";
      case "auth/weak-password":
        return "Mật khẩu phải có ít nhất 6 ký tự. / Password should be at least 6 characters.";
      case "auth/popup-closed-by-user":
        return "Đăng nhập Google đã bị hủy. / Google sign-in was cancelled.";
      case "auth/network-request-failed":
        return "Lỗi kết nối mạng. Vui lòng kiểm tra internet. / Network error. Please check your connection.";
      case "auth/too-many-requests":
        return "Quá nhiều lần thử. Vui lòng chờ một lúc. / Too many attempts. Please wait a moment.";
      default:
        return "Đăng nhập thất bại. Vui lòng thử lại. / Authentication failed. Please try again.";
    }
  };

  const handleSubmit = async (data: { email: string; password: string }) => {
    if (localLoading) return;
    setLocalLoading(true);
    try {
      if (isSignUp) {
        const res: any = await signUp(data.email, data.password);
        toast({
          title: "Tạo tài khoản thành công! / Account created!",
          description: "Vui lòng đăng nhập lại để tiếp tục. / Please sign in to continue.",
        });
        setIsSignUp(false); // switch to sign in mode
        form.reset({ email: data.email, password: '' });
        return; // don't proceed to sign-in flow automatically
      } else {
        await signIn(data.email, data.password);
        toast({ 
          title: "Đăng nhập thành công! / Signed in!", 
          description: "Chào mừng bạn trở lại! / Welcome back!" 
        });
        router.push("/");
      }
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi đăng nhập / Authentication Error",
        description: getFriendlyError(e),
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (localLoading) return;
    setLocalLoading(true);
    try {
      await signInWithGoogle();
      toast({ 
        title: "Đăng nhập thành công! / Signed in!", 
        description: "Chào mừng bạn trở lại! / Welcome back!" 
      });
      router.push("/");
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi đăng nhập Google / Google Sign-in Error",
        description: getFriendlyError(e),
      });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-16 md:px-6 md:py-24">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <Input
            type="email"
            placeholder="Email"
            {...form.register("email", { required: true })}
            disabled={loading}
            autoComplete="email"
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...form.register("password", { required: true })}
              disabled={loading}
              autoComplete={isSignUp ? "new-password" : "current-password"}
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
          <Button type="submit" className="w-full" disabled={loading || localLoading}>
            {(loading || localLoading)
              ? (isSignUp ? "Creating Account..." : "Signing In...")
              : (isSignUp ? "Create Account" : "Sign In")}
          </Button>
        </form>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleGoogle}
          disabled={loading || localLoading}
        >
          {(loading || localLoading) ? "Processing..." : "Continue with Google"}
        </Button>
        <div className="mt-4 text-center space-y-2">
          <button
            className="text-blue-600 hover:underline text-sm block w-full"
            onClick={() => setIsSignUp((v) => !v)}
            disabled={loading || localLoading}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
          
          <div className="text-center">
            <span className="text-sm text-muted-foreground">or</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => router.push("/staff-request")}
            disabled={loading || localLoading}
          >
            👨‍💼 Request Staff/Manager Access
          </Button>
        </div>
      </div>
    </div>
  );
}
