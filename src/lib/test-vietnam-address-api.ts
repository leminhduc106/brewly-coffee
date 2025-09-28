// Test script for Vietnam Address API
// Run this to verify the API integration works correctly

import {
  getProvinces,
  getDistricts,
  getWards,
  calculateDeliveryFee,
  validateAddress,
  formatAddress
} from './vietnam-address-api';

export async function testVietnamAddressAPI() {
  console.log('🧪 Testing Vietnam Address API...\n');

  try {
    // Test 1: Get all provinces
    console.log('1️⃣ Testing getProvinces()...');
    const provinces = await getProvinces();
    console.log(`✅ Found ${provinces.length} provinces`);
    console.log(`📍 First few: ${provinces.slice(0, 3).map(p => p.name).join(', ')}\n`);

    // Test 2: Get districts for Ho Chi Minh City (code 79)
    console.log('2️⃣ Testing getDistricts() for Ho Chi Minh City...');
    const hcmcDistricts = await getDistricts(79);
    console.log(`✅ Found ${hcmcDistricts.length} districts in HCMC`);
    console.log(`🏙️ First few: ${hcmcDistricts.slice(0, 3).map(d => d.name).join(', ')}\n`);

    // Test 3: Get wards for District 1, HCMC (code 760)
    console.log('3️⃣ Testing getWards() for District 1, HCMC...');
    const district1Wards = await getWards(79, 760);
    console.log(`✅ Found ${district1Wards.length} wards in District 1`);
    console.log(`🏘️ First few: ${district1Wards.slice(0, 3).map(w => w.name).join(', ')}\n`);

    // Test 4: Calculate delivery fees
    console.log('4️⃣ Testing calculateDeliveryFee()...');
    const hcmcFee = calculateDeliveryFee(79, 760); // HCMC District 1
    const hanoiFee = calculateDeliveryFee(1); // Hanoi
    const remoteFee = calculateDeliveryFee(2); // Ha Giang (remote)
    
    console.log(`💰 HCMC District 1 delivery fee: ${hcmcFee.toLocaleString()}₫`);
    console.log(`💰 Hanoi delivery fee: ${hanoiFee.toLocaleString()}₫`);
    console.log(`💰 Remote area delivery fee: ${remoteFee.toLocaleString()}₫\n`);

    // Test 5: Validate address
    console.log('5️⃣ Testing validateAddress()...');
    if (district1Wards.length > 0) {
      const validation = await validateAddress(79, 760, district1Wards[0].code);
      console.log(`✅ Address validation: ${validation.isValid ? 'VALID' : 'INVALID'}`);
      
      if (validation.isValid && validation.province && validation.district && validation.ward) {
        const fullAddress = formatAddress(
          validation.province,
          validation.district,
          validation.ward,
          '123 Nguyen Hue Street'
        );
        console.log(`📮 Formatted address: ${fullAddress}\n`);
      }
    }

    console.log('🎉 All tests completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testVietnamAddressAPI();
}