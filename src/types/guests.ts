export interface GuestDetails {
  adults: number
  children: number
  infants: number
  pets: boolean
}

export const DEFAULT_GUEST_DETAILS: GuestDetails = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: false,
}
