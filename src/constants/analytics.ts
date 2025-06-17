export const ANALYTICS_EVENTS = {
  // Referral Events
  REFERRAL: {
    CTA_CLICKED: 'referral_page_cta_clicked',
    PAGE_VIEWD: 'referral_child_referral_page_viewed',
  },
  REVENUE: {
    UNLOCK_CLICKED: 'web_revenue_unlock_plus_click',
    STRIPE_SUCCESS: 'web_revenue_stripe_transaction_successfull_system',
  },
} as const;
