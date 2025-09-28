# Vietnam Address API Integration

This implementation provides a complete Vietnam address system using the official Vietnam Provinces Open API.

## Features

- ✅ **Official Data**: Uses https://provinces.open-api.vn/ (Government-backed API)
- ✅ **Complete Hierarchy**: Province → District → Ward structure
- ✅ **Real-time Loading**: Dynamic cascading dropdowns
- ✅ **Smart Caching**: API responses are cached for performance
- ✅ **Delivery Fee Calculation**: Location-based shipping costs
- ✅ **Address Validation**: Full validation with error handling
- ✅ **Vietnamese Localization**: All labels and messages in Vietnamese

## API Structure

### Data Types

```typescript
interface Province {
  name: string; // "Thành phố Hồ Chí Minh"
  code: number; // 79
  division_type: string; // "thành phố trung ương"
  codename: string; // "thanh_pho_ho_chi_minh"
  phone_code: number; // 28
  districts: District[];
}

interface District {
  name: string; // "Quận 1"
  code: number; // 760
  division_type: string; // "quận"
  codename: string; // "quan_1"
  province_code: number; // 79
  wards: Ward[];
}

interface Ward {
  name: string; // "Phường Bến Nghé"
  code: number; // 26734
  division_type: string; // "phường"
  codename: string; // "phuong_ben_nghe"
  district_code: number; // 760
}
```

## Usage

### 1. Basic Address Selection

```typescript
import {
  getProvinces,
  getDistricts,
  getWards,
} from "@/lib/vietnam-address-api";

// Get all provinces
const provinces = await getProvinces();

// Get districts for a province
const districts = await getDistricts(79); // Ho Chi Minh City

// Get wards for a district
const wards = await getWards(79, 760); // District 1, HCMC
```

### 2. Calculate Delivery Fee

```typescript
import { calculateDeliveryFee } from "@/lib/vietnam-address-api";

// Basic fee calculation
const fee = calculateDeliveryFee(79); // HCMC: 15,000₫

// With district for more accuracy
const preciseFee = calculateDeliveryFee(79, 760); // HCMC District 1: 10,000₫
```

### 3. Address Validation

```typescript
import { validateAddress } from "@/lib/vietnam-address-api";

const validation = await validateAddress(79, 760, 26734);
if (validation.isValid) {
  console.log(`Valid address: ${validation.province?.name}`);
}
```

### 4. Format Full Address

```typescript
import { formatAddress } from "@/lib/vietnam-address-api";

const fullAddress = formatAddress(
  province,
  district,
  ward,
  "123 Nguyen Hue Street"
);
// Result: "123 Nguyen Hue Street, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh"
```

## Delivery Fee Structure

| Location Type        | Fee (VND) | Examples                              |
| -------------------- | --------- | ------------------------------------- |
| HCMC Inner Districts | 10,000    | Districts 1, 3, 4, 5, 6, 10, 11       |
| HCMC Other Districts | 15,000    | District 2, 7, 8, 9, 12, etc.         |
| Hanoi                | 18,000    | All Hanoi districts                   |
| Da Nang              | 20,000    | All Da Nang districts                 |
| Can Tho              | 22,000    | Can Tho city                          |
| Major Provinces      | 25,000    | Hai Phong, Hue, Khanh Hoa, etc.       |
| Default              | 30,000    | Most other provinces                  |
| Remote Areas         | 40,000    | Northern mountains, Central Highlands |

## Component Integration

The `DeliveryAddressForm` component automatically:

1. **Loads provinces** on mount
2. **Updates districts** when province changes
3. **Updates wards** when district changes
4. **Calculates delivery fee** when location changes
5. **Validates** all required fields
6. **Shows loading states** during API calls

## Performance Features

- **Caching**: API responses are cached to avoid repeated requests
- **Lazy Loading**: Districts and wards are only loaded when needed
- **Error Handling**: Graceful fallbacks when API calls fail
- **Loading States**: User-friendly loading indicators

## Testing

Run the test suite to verify API integration:

```typescript
import { testVietnamAddressAPI } from "@/lib/test-vietnam-address-api";

// Run all tests
const success = await testVietnamAddressAPI();
```

## API Endpoints Used

- `GET /api/` - Get all provinces
- `GET /api/p/{provinceCode}?depth=3` - Get province with districts and wards

## Error Handling

The system includes comprehensive error handling:

- Network failures → Fallback to empty arrays
- Invalid codes → Clear error messages
- API timeouts → Graceful degradation
- Missing data → User-friendly placeholders

## Development Notes

- The API is rate-limited but generous for normal usage
- All data is in Vietnamese (official names)
- Codes are persistent and can be safely stored
- The API is maintained by the Vietnamese government

## Future Improvements

- [ ] Add English translations for international users
- [ ] Implement postal code integration
- [ ] Add GPS coordinate lookup
- [ ] Integrate with shipping partner APIs
- [ ] Add address auto-complete
