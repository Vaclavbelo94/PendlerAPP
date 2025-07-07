
import { fixPremiumStatusForUser } from './fixPremiumStatus';

/**
 * Specific fix for verka@gmail.com premium issue
 */
export const fixVerkaPremiumStatus = async () => {
  console.log('=== FIXING VERKA PREMIUM STATUS ===');
  
  const result = await fixPremiumStatusForUser('verka@gmail.com');
  
  if (result.success) {
    console.log('✅ VERKA PREMIUM FIX SUCCESS');
    console.log('Premium activated until:', result.data?.premiumUntil);
    console.log('Original redemption date:', result.data?.redemptionDate);
  } else {
    console.log('❌ VERKA PREMIUM FIX FAILED');
    console.log('Error:', result.message);
  }
  
  return result;
};

// Auto-execute fix for Verka
if (typeof window !== 'undefined') {
  (window as any).fixVerkaPremiumStatus = fixVerkaPremiumStatus;
  
  // Execute the fix automatically after a short delay
  setTimeout(() => {
    fixVerkaPremiumStatus().then(result => {
      console.log('=== AUTO FIX RESULT FOR VERKA ===');
      if (result.success) {
        console.log('✅ Verka premium status has been fixed!');
        console.log('Details:', result.data);
      } else {
        console.log('❌ Failed to fix Verka premium status:', result.message);
      }
    }).catch(error => {
      console.error('❌ Error in auto fix:', error);
    });
  }, 2000);
}
