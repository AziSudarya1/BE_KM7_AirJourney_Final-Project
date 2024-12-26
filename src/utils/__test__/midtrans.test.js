import { jest } from '@jest/globals';

jest.unstable_mockModule('../env.js', () => {
  return {
    appEnv: {
      MIDTRANS_IS_PRODUCTION: 'false',
      MIDTRANS_SERVER_KEY: 'test_server_key',
      MIDTRANS_CLIENT_KEY: 'test_client_key',
      MIDTRANS_TOKEN: 'test_base64_token'
    }
  };
});

const { appEnv } = await import('../env.js');
const { midtrans, core, cancelMidtransTransaction, MidtransError } =
  await import('../midtrans.js');

describe('Midtrans Utility', () => {
  describe('Midtrans Initialization', () => {
    it('should initialize Snap client with correct options', () => {
      expect(midtrans.apiConfig.serverKey).toBe(appEnv.MIDTRANS_SERVER_KEY);
      expect(midtrans.apiConfig.clientKey).toBe(appEnv.MIDTRANS_CLIENT_KEY);
      expect(midtrans.apiConfig.isProduction).toBe(false);
    });

    it('should initialize CoreApi client with correct options', () => {
      expect(core.apiConfig.serverKey).toBe(appEnv.MIDTRANS_SERVER_KEY);
      expect(core.apiConfig.clientKey).toBe(appEnv.MIDTRANS_CLIENT_KEY);
      expect(core.apiConfig.isProduction).toBe(false);
    });
  });

  describe('cancelMidtransTransaction', () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully cancel a transaction and return response data', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          status_code: '200',
          status_message: 'Transaction is successfully canceled'
        })
      };

      fetch.mockResolvedValue(mockResponse);

      const orderId = 'test_order_id';
      const result = await cancelMidtransTransaction(orderId);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.sandbox.midtrans.com/v2/${orderId}/cancel`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${appEnv.MIDTRANS_TOKEN}`
          }
        }
      );

      expect(result).toEqual({
        status_code: '200',
        status_message: 'Transaction is successfully canceled'
      });
    });

    it('should throw an HttpError when the API returns a non-OK status', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn()
      };

      fetch.mockResolvedValue(mockResponse);

      const orderId = 'test_order_id';

      await expect(cancelMidtransTransaction(orderId)).rejects.toThrow(
        'Failed to cancel transaction: Bad Request'
      );
      expect(fetch).toHaveBeenCalledWith(
        `https://api.sandbox.midtrans.com/v2/${orderId}/cancel`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${appEnv.MIDTRANS_TOKEN}`
          }
        }
      );
    });
  });

  describe('MidtransError', () => {
    it('should export MidtransError', () => {
      expect(MidtransError).toBeDefined();
    });
  });
});
