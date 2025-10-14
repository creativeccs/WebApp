# NIP-CCS: Real Estate Property Listings

`draft` `optional`

This NIP defines a custom event kind for real estate property listings on Nostr, enabling decentralized property management and trading.

## Event Kind

This NIP defines event kind `30403` (Addressable Event) for real estate property listings.

## Event Structure

```json
{
  "kind": 30403,
  "content": "",
  "tags": [
    ["d", "<unique-property-id>"],
    ["title", "<property-title>"],
    ["description", "<property-description>"],
    ["type", "sale|rent|both"],
    ["category", "villa|apartment|commercial|land|other"],
    ["price", "<price-value>"],
    ["currency", "OMR|USD|EUR"],
    ["area", "<area-in-sqm>"],
    ["bedrooms", "<number-of-bedrooms>"],
    ["bathrooms", "<number-of-bathrooms>"],
    ["location", "<location-description>"],
    ["lat", "<latitude>"],
    ["lon", "<longitude>"],
    ["address", "<full-address>"],
    ["city", "<city-name>"],
    ["region", "<region-name>"],
    ["country", "<country-code>"],
    ["status", "available|sold|rented|pending"],
    ["furnished", "yes|no|partial"],
    ["parking", "yes|no"],
    ["garden", "yes|no"],
    ["pool", "yes|no"],
    ["elevator", "yes|no"],
    ["balcony", "yes|no"],
    ["storage", "yes|no"],
    ["security", "yes|no"],
    ["gym", "yes|no"],
    ["year_built", "<construction-year>"],
    ["floor", "<floor-number>"],
    ["total_floors", "<total-building-floors>"],
    ["imeta", "<image-metadata>"],
    ["contact_phone", "<phone-number>"],
    ["contact_email", "<email-address>"],
    ["contact_whatsapp", "<whatsapp-number>"],
    ["available_from", "<availability-date>"],
    ["lease_duration", "<lease-period-months>"],
    ["deposit", "<security-deposit>"],
    ["commission", "<commission-percentage>"],
    ["utilities_included", "yes|no|partial"],
    ["internet_included", "yes|no"],
    ["maintenance_included", "yes|no"],
    ["pets_allowed", "yes|no"],
    ["smoking_allowed", "yes|no"],
    ["gender_preference", "male|female|family|any"],
    ["nationality_preference", "<preferred-nationality>"],
    ["min_lease_period", "<minimum-lease-months>"],
    ["max_occupants", "<maximum-occupants>"],
    ["nearest_landmarks", "<comma-separated-landmarks>"],
    ["public_transport", "<transport-options>"],
    ["schools_nearby", "<nearby-schools>"],
    ["hospitals_nearby", "<nearby-hospitals>"],
    ["shopping_nearby", "<nearby-shopping>"],
    ["language", "en|ar|fa"],
    ["t", "property"],
    ["t", "realestate"],
    ["t", "oman"]
  ]
}
```

## Tag Descriptions

### Required Tags
- `d`: Unique property identifier (required for addressable events)
- `title`: Property title/name
- `type`: Property listing type (sale, rent, or both)
- `category`: Property category
- `price`: Property price
- `currency`: Price currency
- `location`: Location description
- `status`: Current status of the property

### Property Details
- `area`: Property area in square meters
- `bedrooms`: Number of bedrooms (0 for studio)
- `bathrooms`: Number of bathrooms
- `furnished`: Furnishing status
- `year_built`: Year of construction

### Location Tags
- `lat`/`lon`: GPS coordinates for mapping
- `address`: Full street address
- `city`: City name
- `region`: Region/state/province
- `country`: ISO country code (default: OM for Oman)

### Amenities (Boolean Tags)
- `parking`: Parking availability
- `garden`: Garden/yard availability
- `pool`: Swimming pool
- `elevator`: Elevator access
- `balcony`: Balcony/terrace
- `storage`: Storage space
- `security`: Security features
- `gym`: Gym/fitness facilities

### Building Information
- `floor`: Floor number (for apartments)
- `total_floors`: Total floors in building

### Contact Information
- `contact_phone`: Primary phone number
- `contact_email`: Email address
- `contact_whatsapp`: WhatsApp number

### Rental-Specific Tags
- `available_from`: Availability date (ISO format)
- `lease_duration`: Preferred lease duration in months
- `deposit`: Security deposit amount
- `utilities_included`: Utilities inclusion status
- `internet_included`: Internet inclusion
- `maintenance_included`: Maintenance inclusion
- `pets_allowed`: Pet policy
- `smoking_allowed`: Smoking policy
- `gender_preference`: Gender preference for tenants
- `nationality_preference`: Nationality preference
- `min_lease_period`: Minimum lease period
- `max_occupants`: Maximum number of occupants

### Sale-Specific Tags
- `commission`: Commission percentage for agents

### Neighborhood Information
- `nearest_landmarks`: Nearby landmarks
- `public_transport`: Public transportation options
- `schools_nearby`: Nearby schools
- `hospitals_nearby`: Nearby hospitals
- `shopping_nearby`: Nearby shopping centers

### System Tags
- `language`: Content language (en, ar, fa)
- `imeta`: Image metadata following NIP-94
- `t`: Category tags for filtering

## Image Attachments

Property images should be uploaded using NIP-94 compatible services (Blossom servers) and referenced using `imeta` tags:

```json
["imeta", "url <image-url> m <mime-type> x <sha256-hash> size <file-size> dim <dimensions> blurhash <blurhash> alt <alt-text>"]
```

Multiple `imeta` tags can be used for multiple images.

## Query Examples

### Get all properties for sale in Muscat
```javascript
const properties = await nostr.query([{
  kinds: [30403],
  "#type": ["sale", "both"],
  "#city": ["Muscat"],
  "#status": ["available"],
  "#t": ["property"]
}]);
```

### Get villas for rent with specific amenities
```javascript
const villas = await nostr.query([{
  kinds: [30403],
  "#type": ["rent", "both"],
  "#category": ["villa"],
  "#pool": ["yes"],
  "#garden": ["yes"],
  "#status": ["available"]
}]);
```

### Get properties by specific author (admin only)
```javascript
const adminProperties = await nostr.query([{
  kinds: [30403],
  authors: [adminPubkey],
  "#t": ["property"]
}]);
```

## Implementation Notes

1. **Admin-Only Publishing**: Applications should validate that only authorized admin pubkeys can publish property events.

2. **Multi-language Support**: Use the `language` tag to support Arabic, English, and Persian content.

3. **Status Updates**: Properties should be updated by publishing new events with the same `d` tag and updated status.

4. **Image Management**: Use Blossom servers for image storage and NIP-94 metadata format.

5. **Location Privacy**: GPS coordinates are optional; use general location descriptions for privacy.

6. **Currency Support**: Primary currency is OMR (Omani Rial), with USD and EUR support.

## Client Implementation

Clients implementing this NIP should:

1. Validate all required tags before displaying properties
2. Filter properties by admin pubkey for authorized listings
3. Support multi-language content display
4. Implement proper image gallery with NIP-94 metadata
5. Provide advanced filtering by all available tags
6. Show appropriate fields based on property type (sale vs rent)

## Security Considerations

- Only display properties from verified admin pubkeys
- Validate all tag values before processing
- Sanitize contact information display
- Implement rate limiting for property queries
- Verify image authenticity using NIP-94 hashes