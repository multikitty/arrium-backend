import cron from 'node-cron';
import StripeController from '../Controllers/StripeController';

/**
 * Runs at midnight on every 6th of month
 */
cron.schedule(
  '00 00 6 * *',
  async function () {
    try {
      new StripeController().disableCustomersFiveDays();
    } catch (error) {
      console.log('%cserver.js line:62 error', 'color: #007acc;', error);
    }
  },
  {
    scheduled: true,
    timezone: 'America/Edmonton',
  }
);
