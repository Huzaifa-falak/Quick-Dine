export function generateBookingId() {
  return `GR-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
}
