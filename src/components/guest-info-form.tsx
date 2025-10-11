"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { isValidPhoneNumber } from "@/lib/utils";

export interface GuestInfo {
  name: string;
  phoneNumber: string;
  email?: string;
}

interface GuestInfoFormProps {
  onGuestInfoChange: (guestInfo: GuestInfo | null) => void;
  initialGuestInfo?: GuestInfo;
}

export function GuestInfoForm({
  onGuestInfoChange,
  initialGuestInfo,
}: GuestInfoFormProps) {
  const [guestInfo, setGuestInfo] = useState<GuestInfo>(
    initialGuestInfo || {
      name: "",
      phoneNumber: "",
      email: "",
    }
  );

  const [errors, setErrors] = useState<{
    name?: string;
    phoneNumber?: string;
  }>({});

  const [touched, setTouched] = useState<{
    name?: boolean;
    phoneNumber?: boolean;
  }>({});

  const validateForm = (info: GuestInfo, showErrors = false): boolean => {
    const newErrors: typeof errors = {};

    // Validate name
    if (!info.name.trim()) {
      newErrors.name = "Tên không được để trống / Name is required";
    } else if (info.name.trim().length < 2) {
      newErrors.name = "Tên quá ngắn / Name is too short";
    }

    // Validate phone number
    if (!info.phoneNumber.trim()) {
      newErrors.phoneNumber =
        "Số điện thoại không được để trống / Phone number is required";
    } else if (!isValidPhoneNumber(info.phoneNumber)) {
      newErrors.phoneNumber =
        "Số điện thoại không hợp lệ. Hỗ trợ số quốc tế (ví dụ: +441234567890) / Invalid phone. International numbers supported (e.g., +441234567890)";
    }

    if (showErrors) {
      setErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof GuestInfo, value: string) => {
    const updatedInfo = { ...guestInfo, [field]: value };
    setGuestInfo(updatedInfo);

    // Clear error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: undefined });
    }

    // Only notify parent if form is valid, but don't show errors yet
    if (validateForm(updatedInfo, false)) {
      onGuestInfoChange(updatedInfo);
    } else {
      onGuestInfoChange(null);
    }
  };

  const handleBlur = (field: keyof GuestInfo) => {
    setTouched({ ...touched, [field]: true });

    // Only validate and show errors for this specific field if it has been touched
    if (
      (field === "name" || field === "phoneNumber") &&
      (touched[field as keyof typeof touched] || true)
    ) {
      const fieldErrors: typeof errors = {};

      if (field === "name") {
        if (!guestInfo.name.trim()) {
          fieldErrors.name = "Tên không được để trống / Name is required";
        } else if (guestInfo.name.trim().length < 2) {
          fieldErrors.name = "Tên quá ngắn / Name is too short";
        }
      }

      if (field === "phoneNumber") {
        if (!guestInfo.phoneNumber.trim()) {
          fieldErrors.phoneNumber =
            "Số điện thoại không được để trống / Phone number is required";
        } else if (!isValidPhoneNumber(guestInfo.phoneNumber)) {
          fieldErrors.phoneNumber =
            "Số điện thoại không hợp lệ. Hỗ trợ số quốc tế (ví dụ: +441234567890) / Invalid phone. International numbers supported (e.g., +441234567890)";
        }
      }

      setErrors({ ...errors, ...fieldErrors });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khách hàng / Guest Information</CardTitle>
        <CardDescription>
          Điền thông tin để chúng tôi liên hệ về đơn hàng / Enter your info for
          order updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Đặt hàng nhanh không cần tài khoản</strong> - Để hưởng điểm
            thưởng và xem lịch sử đơn hàng, vui lòng{" "}
            <a href="/login" className="underline font-semibold">
              đăng nhập
            </a>
            .
            <br />
            <strong>Quick order without account</strong> - To earn points and
            view order history, please{" "}
            <a href="/login" className="underline font-semibold">
              sign in
            </a>
            .
          </AlertDescription>
        </Alert>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="guest-name">
            Tên / Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="guest-name"
            value={guestInfo.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Phone Number Field */}
        <div className="space-y-2">
          <Label htmlFor="guest-phone">
            Số điện thoại / Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="guest-phone"
            type="tel"
            value={guestInfo.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            onBlur={() => handleBlur("phoneNumber")}
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Email Field (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="guest-email">
            Email <span className="text-gray-400">(Tùy chọn / Optional)</span>
          </Label>
          <Input
            id="guest-email"
            type="email"
            value={guestInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Để nhận hóa đơn điện tử / For digital receipt
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
