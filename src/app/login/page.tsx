
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth-context';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { createUserProfile } from '@/lib/user-service';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }).optional(),
  birthday: z.string().optional(),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.62-3.82 1.62-5.01 0-9.04-4.03-9.04-9.04s4.03-9.04 9.04-9.04c2.89 0 4.84 1.16 6.3 2.53l2.43-2.43C19.49 1.94 16.36 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c6.92 0 12.04-4.82 12.04-12.04 0-.8-.08-1.57-.2-2.32H12.48z" />
    </svg>
  );

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signUp, signIn, signInWithGoogle } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      birthday: '',
    },
  });

  const getFriendlyErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'No account found with this email address, or the password was incorrect.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in process was cancelled.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for Google Sign-In. Please add it to your Firebase project settings.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({ title: 'Signed in successfully! Redirecting...' });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-in failed',
        description: getFriendlyErrorMessage(error),
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (activeTab === 'signup') {
        const userCredential = await signUp(values.email, values.password);
        
        // Create user profile in Firestore with birthday
        if (userCredential.user) {
          await createUserProfile(userCredential.user.uid, {
            name: values.name || userCredential.user.displayName || 'Coffee Lover',
            email: values.email,
            avatar: userCredential.user.photoURL || '',
            birthday: values.birthday || undefined,
          });
        }
        
        toast({ title: "Account created successfully!", description: "Please sign in with your new credentials." });
        setActiveTab('signin');
        form.reset();
      } else {
        await signIn(values.email, values.password);
        toast({ title: "Signed in successfully! Redirecting..." });
        router.push('/');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: activeTab === 'signup' ? 'Sign up failed' : 'Sign in failed',
        description: getFriendlyErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const AuthFormContent = () => (
    <CardContent className="space-y-4">
    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
        {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
            <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Continue with Google
    </Button>
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
      {activeTab === 'signup' && (
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="you@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  {...field} 
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {activeTab === 'signup' && (
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <div className="text-xs text-muted-foreground">
                We'll surprise you with special birthday rewards! 🎂
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
      </Button>
    </CardContent>
  );

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-16 md:px-6 md:py-24">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Access your account to see your rewards and order history.</CardDescription>
                </CardHeader>
                <AuthFormContent />
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                  <CardDescription>Create an account to start earning loyalty points today.</CardDescription>
                </CardHeader>
                <AuthFormContent />
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
