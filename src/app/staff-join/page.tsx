"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Crown, Users, CheckCircle, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StaffJoinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Coffee className="h-12 w-12 text-amber-600" />
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-gray-900">
              AMBASSADOR's COFFEE
            </h1>
          </div>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Join Our Team! 👨‍💼
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Create your staff or manager account in just 2 minutes. 
              No technical knowledge required - just fill out a simple form!
            </p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center">
              <Crown className="h-16 w-16 mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Join? It's Super Easy!
              </h3>
              <p className="text-blue-100 text-lg mb-8">
                Just click the button below and fill out a simple form. 
                You'll be able to access the staff dashboard immediately after creating your account.
              </p>
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
              >
                <Link href="/staff-request" className="flex items-center gap-3">
                  <Users className="h-6 w-6" />
                  Create Staff Account Now
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits */}
        <div className="max-w-6xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            What You'll Get Access To:
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Staff Benefits */}
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Users className="h-6 w-6" />
                  Staff Account
                  <Badge variant="secondary">Standard Access</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Real-time order management dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Update order status (pending → preparing → ready)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Kitchen display system for easy viewing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Today's order statistics and metrics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Works on phone, tablet, and computer</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Manager Benefits */}
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Crown className="h-6 w-6" />
                  Manager Account
                  <Badge className="bg-purple-600">Full Access</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Everything staff can do</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Advanced analytics and reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Staff performance monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Store management settings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                    <span>Priority access to new features</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Simple Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            How It Works (3 Simple Steps):
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold mb-2">Fill the Form</h4>
                <p className="text-gray-600 text-sm">
                  Enter your name, email, choose staff/manager role, and select your embassy location
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h4 className="font-semibold mb-2">Create Account</h4>
                <p className="text-gray-600 text-sm">
                  Your account is created instantly with proper staff/manager permissions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-semibold mb-2">Start Working</h4>
                <p className="text-gray-600 text-sm">
                  Sign in and access your staff dashboard immediately - no waiting!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Embassy Locations */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Available Embassy Locations:
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <h4 className="font-semibold">Embassy Ho Chi Minh City</h4>
                <p className="text-sm text-gray-600">District 1, HCMC</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <h4 className="font-semibold">Embassy Hanoi</h4>
                <p className="text-sm text-gray-600">Ba Dinh District, Hanoi</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <h4 className="font-semibold">Embassy Da Nang</h4>
                <p className="text-sm text-gray-600">Hai Chau District, Da Nang</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of staff members already using our platform to manage orders efficiently!
            </p>
            <div className="flex flex-col gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 w-full">
                <Link href="/staff-request" className="flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5" />
                  Create Staff Account
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 w-full">
                <Link href="/login" className="flex items-center justify-center gap-2">
                  Sign In
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            Need help? Contact your store manager or visit our admin panel for technical support.
          </p>
        </div>
      </div>
    </div>
  );
}