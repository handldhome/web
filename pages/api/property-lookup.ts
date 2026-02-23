import type { NextApiRequest, NextApiResponse } from 'next';

interface RentCastProperty {
  squareFootage?: number;
  lotSize?: number;
  stories?: number;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  formattedAddress?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface PropertyLookupResponse {
  success: boolean;
  data?: {
    squareFootage: number;
    lotSize: number;
    stories: number;
    yearBuilt?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    formattedAddress: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PropertyLookupResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { address } = req.body;

  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid address',
    });
  }

  const apiKey = process.env.RENTCAST_API_KEY;

  if (!apiKey) {
    console.error('RENTCAST_API_KEY not configured');
    return res.status(500).json({
      success: false,
      error: 'Property lookup service not configured. Please enter your home details manually.',
    });
  }

  try {
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://api.rentcast.io/v1/properties?address=${encodedAddress}`;

    console.log('[PropertyLookup] Calling RentCast API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    console.log('[PropertyLookup] RentCast response status:', response.status);

    if (response.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later or enter your home details manually.',
      });
    }

    if (response.status === 401 || response.status === 403) {
      console.error('RentCast API authentication error');
      return res.status(500).json({
        success: false,
        error: 'Property lookup service error. Please enter your home details manually.',
      });
    }

    if (!response.ok) {
      console.error('RentCast API error:', response.status, await response.text());
      return res.status(500).json({
        success: false,
        error: 'Property not found. Please enter your home details manually.',
      });
    }

    const data = await response.json();
    console.log('[PropertyLookup] RentCast response data:', JSON.stringify(data, null, 2));

    // RentCast returns an array of properties
    const properties: RentCastProperty[] = Array.isArray(data) ? data : [];

    if (properties.length === 0) {
      console.log('[PropertyLookup] No properties found in response');
      return res.status(404).json({
        success: false,
        error: 'Property not found. Please enter your home details manually.',
      });
    }

    const property = properties[0];
    console.log('[PropertyLookup] First property:', JSON.stringify(property, null, 2));

    // Validate required fields
    const squareFootage = property.squareFootage;
    const lotSize = property.lotSize;
    const stories = property.stories;

    console.log('[PropertyLookup] Extracted values:', { squareFootage, lotSize, stories });

    if (!squareFootage || !lotSize || !stories) {
      const missing: string[] = [];
      if (!squareFootage) missing.push('square footage');
      if (!lotSize) missing.push('lot size');
      if (!stories) missing.push('stories');

      return res.status(404).json({
        success: false,
        error: `We found your property but couldn't determine the ${missing.join(', ')}. Please enter your home details manually.`,
      });
    }

    // Build formatted address
    const formattedAddress = property.formattedAddress ||
      [property.addressLine1, property.city, property.state, property.zipCode]
        .filter(Boolean)
        .join(', ');

    return res.status(200).json({
      success: true,
      data: {
        squareFootage,
        lotSize,
        stories,
        yearBuilt: property.yearBuilt,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        propertyType: property.propertyType,
        formattedAddress,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
      },
    });
  } catch (error) {
    console.error('Property lookup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please enter your home details manually.',
    });
  }
}
