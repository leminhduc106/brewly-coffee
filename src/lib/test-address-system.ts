// Test file to demonstrate the Vietnam address system using the new API
// This file shows how the dynamic address system works with real Vietnam data

import {
  getProvinces,
  getDistricts,
  getWards,
  calculateDeliveryFee,
} from "./vietnam-address-api";

// Example usage of the address system
async function testAddressSystem() {
  console.log("=== Vietnam Address System Demo (New API) ===");

  try {
    // Get all provinces
    const provinces = await getProvinces();
    console.log(`📍 Available provinces: ${provinces.length}`);
    provinces.slice(0, 5).forEach((province) => {
      console.log(`   - ${province.name} (Code: ${province.code})`);
    });

    // Test Ho Chi Minh City districts
    const hcmCity = provinces.find((p) => p.code === 79); // HCMC code
    if (hcmCity) {
      const hcmDistricts = await getDistricts(hcmCity.code);
      console.log(`\n🏙️ Districts in Ho Chi Minh City: ${hcmDistricts.length}`);
      hcmDistricts.slice(0, 5).forEach((district) => {
        console.log(`   - ${district.name} (Code: ${district.code})`);
      });

      // Test wards in District 1
      const district1 = hcmDistricts.find((d) => d.name === "Quận 1");
      if (district1) {
        const wardsInDistrict1 = await getWards(hcmCity.code, district1.code);
        console.log(`\n🏘️ Wards in District 1: ${wardsInDistrict1.length}`);
        wardsInDistrict1.slice(0, 5).forEach((ward) => {
          console.log(`   - ${ward.name} (Code: ${ward.code})`);
        });
      }
    }

    // Test delivery fees with province codes
    console.log("\n💰 Delivery Fee Examples:");
    console.log(`HCM Inner District: ${calculateDeliveryFee(79, 760).toLocaleString()}₫`); // District 1
    console.log(`HCM Outer District: ${calculateDeliveryFee(79, 769).toLocaleString()}₫`); // District 12
    console.log(`Hanoi: ${calculateDeliveryFee(1).toLocaleString()}₫`);
    console.log(`Da Nang: ${calculateDeliveryFee(48).toLocaleString()}₫`);
    console.log(`Can Tho: ${calculateDeliveryFee(92).toLocaleString()}₫`);
    console.log(`Remote Area (Ha Giang): ${calculateDeliveryFee(2).toLocaleString()}₫`);

  } catch (error) {
    console.error("❌ Error testing address system:", error);
  }
}

// Run the test
testAddressSystem();

export {};
