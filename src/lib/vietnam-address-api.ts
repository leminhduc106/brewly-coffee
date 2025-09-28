// Vietnam Address API Service
// Using the official Vietnam Provinces Open API: https://provinces.open-api.vn/

export interface Ward {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
}

export interface District {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: Ward[];
}

export interface Province {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: District[];
}

// Cache for API responses
let provincesCache: Province[] | null = null;
let provinceDetailsCache: Map<number, Province> = new Map();

const API_BASE_URL = 'https://provinces.open-api.vn/api';

/**
 * Fetch all provinces from API
 */
export async function fetchProvinces(): Promise<Province[]> {
  if (provincesCache) {
    return provincesCache;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    provincesCache = await response.json();
    return provincesCache || [];
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
}

/**
 * Fetch province details with districts and wards
 */
export async function fetchProvinceDetails(provinceCode: number): Promise<Province | null> {
  // Check cache first
  if (provinceDetailsCache.has(provinceCode)) {
    return provinceDetailsCache.get(provinceCode) || null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/p/${provinceCode}?depth=3`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const provinceDetails = await response.json();
    
    // Cache the result
    provinceDetailsCache.set(provinceCode, provinceDetails);
    
    return provinceDetails;
  } catch (error) {
    console.error(`Error fetching province details for code ${provinceCode}:`, error);
    return null;
  }
}

/**
 * Get all provinces for dropdown
 */
export async function getProvinces(): Promise<Province[]> {
  return await fetchProvinces();
}

/**
 * Get districts for a specific province
 */
export async function getDistricts(provinceCode: number): Promise<District[]> {
  const provinceDetails = await fetchProvinceDetails(provinceCode);
  return provinceDetails?.districts || [];
}

/**
 * Get wards for a specific district
 */
export async function getWards(provinceCode: number, districtCode: number): Promise<Ward[]> {
  const provinceDetails = await fetchProvinceDetails(provinceCode);
  const district = provinceDetails?.districts.find(d => d.code === districtCode);
  return district?.wards || [];
}

/**
 * Search provinces by name
 */
export async function searchProvinces(query: string): Promise<Province[]> {
  const provinces = await fetchProvinces();
  const lowerQuery = query.toLowerCase();
  return provinces.filter(province => 
    province.name.toLowerCase().includes(lowerQuery) ||
    province.codename.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Calculate delivery fee based on province and district
 * This is a simplified calculation - in real implementation,
 * you would use actual shipping rates
 */
export function calculateDeliveryFee(provinceCode: number, districtCode?: number): number {
  // Base fee
  let fee = 30000; // 30k VND base

  // Ho Chi Minh City (code 79) - lower fees
  if (provinceCode === 79) {
    fee = 15000; // 15k VND for HCMC
    
    // Inner districts get even lower fees
    const innerDistricts = [760, 770, 771, 772, 773, 774, 775]; // Districts 1, 3, 4, 5, 6, 10, 11
    if (districtCode && innerDistricts.includes(districtCode)) {
      fee = 10000; // 10k VND for inner districts
    }
    
    return fee;
  }

  // Hanoi (code 1) - similar to HCMC
  if (provinceCode === 1) {
    fee = 18000; // 18k VND for Hanoi
    return fee;
  }

  // Da Nang (code 48) - medium fee
  if (provinceCode === 48) {
    fee = 20000; // 20k VND for Da Nang
    return fee;
  }

  // Can Tho (code 92) - medium fee
  if (provinceCode === 92) {
    fee = 22000; // 22k VND for Can Tho
    return fee;
  }

  // Major provinces - medium-high fee
  const majorProvinces = [31, 46, 56, 74, 75, 77, 80, 82]; // Hai Phong, Hue, Khanh Hoa, Binh Duong, Dong Nai, Ba Ria-Vung Tau, Long An, Tien Giang
  if (majorProvinces.includes(provinceCode)) {
    fee = 25000; // 25k VND for major provinces
    return fee;
  }

  // Remote provinces - higher fee
  const remoteProvinces = [2, 4, 6, 8, 10, 11, 12, 14, 15, 17, 19, 20, 62, 64, 66, 67]; // Northern mountains, Central Highlands
  if (remoteProvinces.includes(provinceCode)) {
    fee = 40000; // 40k VND for remote areas
    return fee;
  }

  // Default fee for other provinces
  return fee;
}

/**
 * Validate address components
 */
export async function validateAddress(
  provinceCode: number,
  districtCode: number,
  wardCode: number
): Promise<{
  isValid: boolean;
  province?: Province;
  district?: District;
  ward?: Ward;
  errors: string[];
}> {
  const errors: string[] = [];
  
  try {
    // Fetch province details
    const province = await fetchProvinceDetails(provinceCode);
    if (!province) {
      errors.push('Invalid province');
      return { isValid: false, errors };
    }

    // Find district
    const district = province.districts.find(d => d.code === districtCode);
    if (!district) {
      errors.push('Invalid district for selected province');
      return { isValid: false, province, errors };
    }

    // Find ward
    const ward = district.wards.find(w => w.code === wardCode);
    if (!ward) {
      errors.push('Invalid ward for selected district');
      return { isValid: false, province, district, errors };
    }

    return {
      isValid: true,
      province,
      district,
      ward,
      errors: []
    };
  } catch (error) {
    errors.push('Failed to validate address');
    return { isValid: false, errors };
  }
}

/**
 * Format full address string
 */
export function formatAddress(
  province: Province,
  district: District,
  ward: Ward,
  streetAddress?: string
): string {
  const parts = [];
  
  if (streetAddress) {
    parts.push(streetAddress);
  }
  
  parts.push(ward.name);
  parts.push(district.name);
  parts.push(province.name);
  
  return parts.join(', ');
}

/**
 * Clear caches (useful for development/testing)
 */
export function clearCache(): void {
  provincesCache = null;
  provinceDetailsCache.clear();
}