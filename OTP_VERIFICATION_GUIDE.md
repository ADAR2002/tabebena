# OTP Verification for Doctor Signup

This guide explains how to implement OTP (One-Time Password) verification for doctor signup in the Tabebena application.

## Setup

1. Copy the `.env.example` file to `.env` and update the SMTP settings:
   ```bash
   cp .env.example .env
   ```

2. Update the following environment variables in your `.env` file:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-specific-password
   SMTP_FROM_NAME=Tabebena
   SMTP_FROM_EMAIL=your-email@gmail.com
   ```

   > **Note:** If using Gmail, you'll need to generate an "App Password" for your account and use that instead of your regular password.

## OTP Verification Flow

### 1. Request OTP

**Endpoint:** `POST /auth/request-otp`

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "isDoctor": true
}
```

**Success Response (200 OK):**
```json
{
  "message": "OTP sent successfully"
}
```

### 2. Verify OTP and Complete Registration

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "otp": "123456",
  "userDetails": {
    "email": "doctor@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "isDoctor": true,
    "specialtyId": 1
  }
}
```

**Success Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Implementation Details

- OTPs are valid for 5 minutes
- Each OTP can only be used once
- The system automatically handles OTP expiration and cleanup
- Email delivery failures are logged for debugging

## Error Handling

- **400 Bad Request**: Invalid request body
- **401 Unauthorized**: Invalid or expired OTP
- **409 Conflict**: Email already exists or trying to sign up as doctor without OTP
- **500 Internal Server Error**: Failed to send OTP email

## Security Considerations

- Always use HTTPS in production
- Rate limit OTP requests to prevent abuse
- Consider implementing IP-based rate limiting
- Store sensitive information (like OTPs) securely in memory with short TTL
- Never log OTPs or sensitive user information
