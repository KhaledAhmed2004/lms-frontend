export const ERROR_MAPPINGS: Record<string, string> = {
  "User not found": "userNotFound",
  "Valid token is required": "validTokenRequired",
  "Invalid token payload": "invalidTokenPayload",
  "Session not found": "sessionNotFound",
  "Review not found": "reviewNotFound",
  "Tutor not found": "tutorNotFound",
  "User ID is required": "userIdRequired",
  "Invalid webhook event": "invalidWebhookEvent",
  "Bid ID is required": "bidIdRequired",
  "Payment ID is required": "paymentIdRequired",
  "Failed to delete account": "failedToDeleteAccount",
  "Payment released and transferred to freelancer successfully": "paymentReleased",
  "Payment refunded successfully": "paymentRefunded",
  "All notifications marked as read": "allNotificationsRead",
  "Verification Successful: Please securely store and utilize this code for reset password": "verificationSuccessful",
  "Google Calendar OAuth2 client not configured": "googleCalendarNotConfigured",
};

/**
 * Maps a backend error message to a translation key and extract parameters if any.
 * Returns { key: string, values?: object } or null if no mapping found.
 */
export const mapApiError = (message: string) => {
  if (!message) return null;

  // Direct mappings
  if (ERROR_MAPPINGS[message]) {
    return { key: ERROR_MAPPINGS[message] };
  }

  // Pattern: Invalid {field}: {value}
  const invalidFieldMatch = message.match(/^Invalid (.+): (.+)$/);
  if (invalidFieldMatch) {
    return {
      key: "invalidField",
      values: { field: invalidFieldMatch[1], value: invalidFieldMatch[2] },
    };
  }

  // Pattern: {entity} not found ({id})
  const entityNotFoundMatch = message.match(/^(.+) not found \((.+)\)$/);
  if (entityNotFoundMatch) {
    return {
      key: "entityNotFound",
      values: { entity: entityNotFoundMatch[1], id: entityNotFoundMatch[2] },
    };
  }

  return null;
};
