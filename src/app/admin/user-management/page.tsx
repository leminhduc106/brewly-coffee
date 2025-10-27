"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { logRoleChange } from "@/lib/role-audit";
import {
  Users,
  Crown,
  Shield,
  User,
  Search,
  AlertTriangle,
} from "lucide-react";
import type { User as UserType } from "@/lib/types";

interface UserWithId extends UserType {
  id: string;
}

export default function UserManagementPage() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  // Load all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("name"));
        const snapshot = await getDocs(q);
        const userList: UserWithId[] = [];

        snapshot.forEach((doc) => {
          const userData = doc.data() as UserType;
          userList.push({ ...userData, id: doc.id });
        });

        setUsers(userList);
        setFilteredUsers(userList);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          variant: "destructive",
          title: "Error Loading Users",
          description: "Failed to load user list. Please refresh the page.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [toast]);

  // Filter users based on search and role
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleRoleChange = async (
    userId: string,
    newRole: "customer" | "staff" | "manager" | "admin"
  ) => {
    if (!userProfile) return;

    // Prevent self-demotion if last admin
    if (
      userId === userProfile.uid &&
      userProfile.role === "admin" &&
      newRole !== "admin"
    ) {
      const adminCount = users.filter((u) => u.role === "admin").length;
      if (adminCount <= 1) {
        toast({
          variant: "destructive",
          title: "Cannot Demote Last Admin",
          description:
            "You must have at least one admin. Promote another user to admin first.",
        });
        return;
      }
    }

    setUpdating(userId);
    try {
      const targetUser = users.find((u) => u.id === userId);
      const oldRole = targetUser?.role;

      // Update Firestore
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      // Log audit entry
      await logRoleChange({
        actor: userProfile.uid,
        actorName: userProfile.name || userProfile.email || "Unknown",
        target: userId,
        targetName: targetUser?.name || targetUser?.email || "Unknown",
        oldRole,
        newRole,
        at: new Date().toISOString(),
        method: "admin-ui",
      });

      toast({
        title: "Role Updated",
        description: `User role changed to ${newRole}. They must log out and back in to see changes.`,
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update user role. Please try again.",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-purple-600" />;
      case "manager":
        return <Shield className="h-4 w-4 text-blue-600" />;
      case "staff":
        return <Users className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "staff":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage user roles and permissions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="px-3 py-1">
                  <Users className="w-4 h-4 mr-1" />
                  {users.length} Total Users
                </Badge>
                <Badge className="px-3 py-1 bg-purple-600">
                  <Crown className="w-4 h-4 mr-1" />
                  {adminCount} Admins
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Warning for low admin count */}
          {adminCount < 2 && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-amber-800 font-medium">
                      Low Admin Count Warning
                    </p>
                    <p className="text-amber-700 text-sm">
                      You have only {adminCount} admin(s). Consider promoting
                      another user to admin to avoid lockout risk.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Users Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-medium text-gray-900">
                          User
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-gray-900">
                          Current Role
                        </th>
                        <th className="text-left py-3 px-2 font-medium text-gray-900">
                          Store
                        </th>
                        <th className="text-center py-3 px-2 font-medium text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name || "No Name"}
                              </p>
                              <p className="text-sm text-gray-600">
                                {user.email}
                              </p>
                              {user.id === userProfile?.uid && (
                                <Badge
                                  variant="outline"
                                  className="mt-1 text-xs"
                                >
                                  You
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <Badge
                              className={getRoleBadgeColor(
                                user.role || "customer"
                              )}
                            >
                              {getRoleIcon(user.role || "customer")}
                              <span className="ml-1 capitalize">
                                {user.role || "customer"}
                              </span>
                            </Badge>
                          </td>
                          <td className="py-4 px-2">
                            <span className="text-sm text-gray-600">
                              {user.storeId || "No store assigned"}
                            </span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex justify-center gap-2">
                              {(
                                [
                                  "customer",
                                  "staff",
                                  "manager",
                                  "admin",
                                ] as const
                              ).map((role) => (
                                <Button
                                  key={role}
                                  size="sm"
                                  variant={
                                    user.role === role ? "default" : "outline"
                                  }
                                  disabled={
                                    user.role === role || updating === user.id
                                  }
                                  onClick={() =>
                                    handleRoleChange(user.id, role)
                                  }
                                  className="min-w-[80px]"
                                >
                                  {updating === user.id
                                    ? "..."
                                    : role.charAt(0).toUpperCase() +
                                      role.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
