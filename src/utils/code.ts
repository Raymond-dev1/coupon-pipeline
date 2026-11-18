export function generateReferralCode(length:number): string {
  const digits =
    "ABCDEFGHIJKlmnopqrstuvwxyz0123456789";
  let uniqueToken = "";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    uniqueToken += digits[array[i]! % digits.length];
  }
  return uniqueToken;  
}

const referral_code = generateReferralCode(6)
