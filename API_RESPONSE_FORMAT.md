# API Response Format for GET /api/vendor/:id

## Expected Response Structure

```json
{
  "success": true,
  "data": {
    "vendor": {
      "_id": "6999c7bc4037242c0c96a3ff",
      "vendorName": "Vendor Name",
      "email": "vendor@example.com",
      "mobile": "1234567890",
      "isActive": true,
      // ... other vendor fields
    },
    "storeInfo": {
      "storeName": "Store Name",
      "storeImage": [
        {
          "url": "https://..."
        }
      ],
      // ... other store fields
    },
    "storeDetails": {
      // Store details
    },
    "storeAddress": {
      // Store address
    },
    "metrics": {
      "categoryUse": 0,
      "subCategoryUse": 0,
      "totalProducts": 0,
      "productPublished": 0,
      "productInReview": 0,
      "totalOrder": 0,
      "totalDeliveredOrder": 0,
      "totalCanceledOrder": 0,
      "totalRiders": 0,
      "ratings": 0,
      "inventory": 0,
      "amount": 0
    },
    "orderOverview": {
      "statusDistribution": {
        "completed": {
          "count": 0,
          "percentage": 40
        },
        "in_progress": {
          "count": 0,
          "percentage": 25
        },
        "pending": {
          "count": 0,
          "percentage": 20
        },
        "cancelled": {
          "count": 0,
          "percentage": 15
        }
      },
      "orderList": []
    },
    "wallet": {
      // Wallet information
    },
    "deliveryPartners": [],
    "invoices": []
  }
}
```

## Required Metrics Fields

The `metrics` object must include all these fields:

1. **categoryUse** - Number of categories used
2. **subCategoryUse** - Number of sub-categories used
3. **totalProducts** - Total number of products
4. **productPublished** - Number of published products
5. **productInReview** - Number of products in review
6. **totalOrder** - Total number of orders
7. **totalDeliveredOrder** - Total delivered orders
8. **totalCanceledOrder** - Total cancelled orders
9. **totalRiders** - Total number of riders
10. **ratings** - Average rating (can be decimal)
11. **inventory** - Total inventory count
12. **amount** - Total revenue amount (in rupees)

## Notes

- All numeric fields should default to `0` if not available
- The `amount` field is used for Revenue display (formatted as ₹X)
- Response should always have `success: true` for successful requests
- All nested objects should be present even if empty
