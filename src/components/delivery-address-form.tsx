"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Truck, Store, Clock, Loader2 } from "lucide-react";
import type { DeliveryAddress } from "@/lib/types";
import {
  getProvinces,
  getDistricts,
  getWards,
  calculateDeliveryFee as getDeliveryFee,
  type Province,
  type District,
  type Ward,
} from "@/lib/vietnam-address-api";

interface DeliveryAddressFormProps {
  deliveryOption: "pickup" | "delivery";
  onDeliveryOptionChange: (option: "pickup" | "delivery") => void;
  deliveryAddress: DeliveryAddress | null;
  onDeliveryAddressChange: (address: DeliveryAddress | null) => void;
  deliveryFee: number;
  onDeliveryFeeChange: (fee: number) => void;
}

export function DeliveryAddressForm({
  deliveryOption,
  onDeliveryOptionChange,
  deliveryAddress,
  onDeliveryAddressChange,
  deliveryFee,
  onDeliveryFeeChange,
}: DeliveryAddressFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State for dynamic address data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableWards, setAvailableWards] = useState<Ward[]>([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | null>(null);
  const [selectedWardCode, setSelectedWardCode] = useState<number | null>(null);
  
  // Loading states
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error('Failed to load provinces:', error);
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Update available districts when province changes
  useEffect(() => {
    const loadDistricts = async () => {
      if (selectedProvinceCode) {
        setLoadingDistricts(true);
        try {
          const districts = await getDistricts(selectedProvinceCode);
          setAvailableDistricts(districts);
          setAvailableWards([]); // Clear wards when province changes
          setSelectedDistrictCode(null); // Reset district selection
          setSelectedWardCode(null); // Reset ward selection
        } catch (error) {
          console.error('Failed to load districts:', error);
          setAvailableDistricts([]);
        } finally {
          setLoadingDistricts(false);
        }
      } else {
        setAvailableDistricts([]);
        setAvailableWards([]);
        setSelectedDistrictCode(null);
        setSelectedWardCode(null);
      }
    };

    loadDistricts();
  }, [selectedProvinceCode]);

  // Update available wards when district changes
  useEffect(() => {
    const loadWards = async () => {
      if (selectedProvinceCode && selectedDistrictCode) {
        setLoadingWards(true);
        try {
          const wards = await getWards(selectedProvinceCode, selectedDistrictCode);
          setAvailableWards(wards);
          setSelectedWardCode(null); // Reset ward selection
        } catch (error) {
          console.error('Failed to load wards:', error);
          setAvailableWards([]);
        } finally {
          setLoadingWards(false);
        }
      } else {
        setAvailableWards([]);
        setSelectedWardCode(null);
      }
    };

    loadWards();
  }, [selectedProvinceCode, selectedDistrictCode]);

  // Calculate delivery fee when province/district changes
  useEffect(() => {
    if (selectedProvinceCode && deliveryOption === "delivery") {
      const newFee = getDeliveryFee(selectedProvinceCode, selectedDistrictCode || undefined);
      onDeliveryFeeChange(newFee);
    }
  }, [selectedProvinceCode, selectedDistrictCode, deliveryOption, onDeliveryFeeChange]);

  // Handle address field changes
  const handleAddressChange = async (field: keyof DeliveryAddress, value: string) => {
    // Initialize empty address if null
    const currentAddress = deliveryAddress || {
      recipientName: "",
      phoneNumber: "",
      streetAddress: "",
      ward: "",
      district: "",
      city: "",
      specialInstructions: ""
    };

    let updatedAddress = { ...currentAddress, [field]: value };

    // Handle province selection
    if (field === "city") {
      const selectedProvince = provinces.find((province) => province.name === value);
      if (selectedProvince) {
        setSelectedProvinceCode(selectedProvince.code);
        // Clear dependent fields
        updatedAddress.district = "";
        updatedAddress.ward = "";
        setSelectedDistrictCode(null);
        setSelectedWardCode(null);
      }
    }

    // Handle district selection
    if (field === "district") {
      const selectedDistrict = availableDistricts.find((district) => district.name === value);
      if (selectedDistrict) {
        setSelectedDistrictCode(selectedDistrict.code);
        // Clear ward
        updatedAddress.ward = "";
        setSelectedWardCode(null);
      }
    }

    // Handle ward selection
    if (field === "ward") {
      const selectedWard = availableWards.find((ward) => ward.name === value);
      if (selectedWard) {
        setSelectedWardCode(selectedWard.code);
      }
    }

    onDeliveryAddressChange(updatedAddress);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (deliveryOption === "delivery") {
      if (!deliveryAddress?.recipientName?.trim()) {
        newErrors.recipientName = "Họ và tên là bắt buộc";
      }

      if (!deliveryAddress?.phoneNumber?.trim()) {
        newErrors.phoneNumber = "Số điện thoại là bắt buộc";
      } else if (!/^[0-9]{10,11}$/.test(deliveryAddress.phoneNumber.replace(/\s/g, ""))) {
        newErrors.phoneNumber = "Số điện thoại không hợp lệ";
      }

      if (!deliveryAddress?.streetAddress?.trim()) {
        newErrors.streetAddress = "Địa chỉ đường là bắt buộc";
      }

      if (!deliveryAddress?.city?.trim()) {
        newErrors.city = "Tỉnh thành là bắt buộc";
      }

      if (!deliveryAddress?.district?.trim()) {
        newErrors.district = "Quận huyện là bắt buộc";
      }

      if (!deliveryAddress?.ward?.trim()) {
        newErrors.ward = "Phường xã là bắt buộc";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save address
  const handleSaveAddress = () => {
    if (validateForm()) {
      // Address is already being updated in real-time via handleAddressChange
      console.log("Address saved successfully");
    }
  };

  return (
    <div className="space-y-6">
      {/* Delivery Option Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Truck className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Phương thức nhận hàng</h3>
          </div>
          
          <RadioGroup
            value={deliveryOption}
            onValueChange={(value) => onDeliveryOptionChange(value as "pickup" | "delivery")}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="pickup" id="pickup" />
              <div className="flex-1">
                <Label htmlFor="pickup" className="flex items-center space-x-2 cursor-pointer">
                  <Store className="h-4 w-4" />
                  <span className="font-medium">Nhận tại cửa hàng</span>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Miễn phí - Nhận hàng trực tiếp tại cửa hàng
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="delivery" id="delivery" />
              <div className="flex-1">
                <Label htmlFor="delivery" className="flex items-center space-x-2 cursor-pointer">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">Giao hàng tận nơi</span>
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Phí giao hàng: {deliveryFee.toLocaleString()}₫
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Store Pickup Information */}
      {deliveryOption === "pickup" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Store className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Thông tin cửa hàng</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Brewly Coffee - Chi nhánh chính</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      123 Nguyễn Văn Cư, Phường 4, Quận 5, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Giờ hoạt động</h4>
                    <div className="text-sm text-muted-foreground mt-1 space-y-1">
                      <p>Thứ 2 - Thứ 6: 7:00 - 22:00</p>
                      <p>Thứ 7 - Chủ nhật: 8:00 - 23:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-l-4 border-primary bg-primary/5">
                <p className="text-sm">
                  <strong>Lưu ý:</strong> Vui lòng mang theo mã đơn hàng khi đến nhận. 
                  Đơn hàng sẽ được giữ trong vòng 2 ngày kể từ khi đặt.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Address Form */}
      {deliveryOption === "delivery" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Thông tin giao hàng</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="recipientName">
                  Họ và tên <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="recipientName"
                  value={deliveryAddress?.recipientName || ""}
                  onChange={(e) => handleAddressChange("recipientName", e.target.value)}
                  placeholder="Nhập họ và tên"
                  className={errors.recipientName ? "border-destructive" : ""}
                />
                {errors.recipientName && (
                  <p className="text-sm text-destructive">{errors.recipientName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Số điện thoại <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={deliveryAddress?.phoneNumber || ""}
                  onChange={(e) => handleAddressChange("phoneNumber", e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className={errors.phoneNumber ? "border-destructive" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Street Address */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="streetAddress">
                  Địa chỉ đường <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="streetAddress"
                  value={deliveryAddress?.streetAddress || ""}
                  onChange={(e) => handleAddressChange("streetAddress", e.target.value)}
                  placeholder="Nhập số nhà, tên đường"
                  className={errors.streetAddress ? "border-destructive" : ""}
                />
                {errors.streetAddress && (
                  <p className="text-sm text-destructive">{errors.streetAddress}</p>
                )}
              </div>

              {/* Province/City */}
              <div className="space-y-2">
                <Label htmlFor="city">
                  Tỉnh thành <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={deliveryAddress?.city || ""}
                  onValueChange={(value) => handleAddressChange("city", value)}
                  disabled={loadingProvinces}
                >
                  <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                    <SelectValue placeholder={
                      loadingProvinces 
                        ? "Đang tải..." 
                        : "Chọn tỉnh thành"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingProvinces ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    ) : (
                      provinces.map((province) => (
                        <SelectItem key={province.code} value={province.name}>
                          {province.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">
                  Quận huyện <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={deliveryAddress?.district || ""}
                  onValueChange={(value) => handleAddressChange("district", value)}
                  disabled={!selectedProvinceCode || loadingDistricts}
                >
                  <SelectTrigger className={errors.district ? "border-destructive" : ""}>
                    <SelectValue placeholder={
                      !selectedProvinceCode 
                        ? "Chọn tỉnh thành trước"
                        : loadingDistricts
                        ? "Đang tải..."
                        : "Chọn quận huyện"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingDistricts ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    ) : (
                      availableDistricts.map((district) => (
                        <SelectItem key={district.code} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.district && (
                  <p className="text-sm text-destructive">{errors.district}</p>
                )}
              </div>

              {/* Ward */}
              <div className="space-y-2">
                <Label htmlFor="ward">
                  Phường xã <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={deliveryAddress?.ward || ""}
                  onValueChange={(value) => handleAddressChange("ward", value)}
                  disabled={!selectedDistrictCode || loadingWards}
                >
                  <SelectTrigger className={errors.ward ? "border-destructive" : ""}>
                    <SelectValue placeholder={
                      !selectedDistrictCode
                        ? "Chọn quận huyện trước"
                        : loadingWards
                        ? "Đang tải..."
                        : "Chọn phường xã"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingWards ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    ) : (
                      availableWards.map((ward) => (
                        <SelectItem key={ward.code} value={ward.name}>
                          {ward.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.ward && (
                  <p className="text-sm text-destructive">{errors.ward}</p>
                )}
              </div>

              {/* Notes */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="specialInstructions">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="specialInstructions"
                  value={deliveryAddress?.specialInstructions || ""}
                  onChange={(e) => handleAddressChange("specialInstructions", e.target.value)}
                  placeholder="Ghi chú thêm cho người giao hàng..."
                  rows={3}
                />
              </div>
            </div>

            <Separator className="my-6" />

            {/* Delivery Fee Summary */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium">Phí giao hàng</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedProvinceCode 
                    ? provinces.find(p => p.code === selectedProvinceCode)?.name || "Đã chọn tỉnh thành"
                    : "Chưa chọn địa chỉ"
                  }
                  {selectedDistrictCode && availableDistricts.length > 0 
                    ? ` - ${availableDistricts.find(d => d.code === selectedDistrictCode)?.name}`
                    : ""
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-primary">
                  {deliveryFee.toLocaleString()}₫
                </p>
                {selectedProvinceCode === 79 && (
                  <p className="text-xs text-green-600">Giá ưu đãi TPHCM</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}