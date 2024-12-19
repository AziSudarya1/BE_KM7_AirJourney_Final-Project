import { describe, expect, it, jest } from '@jest/globals';

const mockCore = {
  transaction: {
    status: jest.fn()
  }
};
const mockMidtransError = class extends Error {
  constructor(message, ApiResponse) {
    super(message);
    this.ApiResponse = ApiResponse;
  }
};

jest.unstable_mockModule('../../utils/midtrans.js', () => ({
  core: mockCore,
  MidtransError: mockMidtransError
}));

const mockHttpError = jest.fn();

jest.unstable_mockModule('../../utils/error.js', () => ({
  HttpError: jest.fn().mockImplementation((message, statusCode) => {
    mockHttpError(message, statusCode);

    const error = new Error(message);
    Object.setPrototypeOf(error, Error.prototype);
    error.statusCode = statusCode;
    return error;
  })
}));

const midtransServices = await import('../midtrans.js');
const { checkMidtransTransactionValidity } = midtransServices;

describe('checkMidtransTransactionValidity', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw HttpError when transactionId is not provided', async () => {
    await expect(checkMidtransTransactionValidity()).rejects.toThrowError(
      'Transaction ID is required'
    );
    expect(mockHttpError).toHaveBeenCalledWith(
      'Transaction ID is required',
      400
    );
  });

  it('should return valid payload when transaction ID is valid', async () => {
    const mockValidPayload = { status: 'success', transaction_id: '12345' };
    mockCore.transaction.status.mockResolvedValueOnce(mockValidPayload);

    const result = await checkMidtransTransactionValidity('12345');
    expect(result).toEqual(mockValidPayload);
    expect(mockCore.transaction.status).toHaveBeenCalledWith('12345');
  });

  it('should throw HttpError with API error message and status code when MidtransError occurs', async () => {
    const mockErrorResponse = {
      status_message: 'Transaction not found',
      status_code: '404'
    };

    const midtransError = new mockMidtransError(
      'Error occurred',
      mockErrorResponse
    );
    mockCore.transaction.status.mockRejectedValueOnce(midtransError);

    await expect(
      checkMidtransTransactionValidity('12345')
    ).rejects.toThrowError('Transaction not found');
    expect(mockHttpError).toHaveBeenCalledWith('Transaction not found', 404);
  });

  it('should re-throw non-MidtransError errors', async () => {
    const genericError = new Error('Some generic error');
    mockCore.transaction.status.mockRejectedValueOnce(genericError);

    await expect(
      checkMidtransTransactionValidity('12345')
    ).rejects.toThrowError('Some generic error');
    expect(mockCore.transaction.status).toHaveBeenCalledWith('12345');
  });

  it('should re-throw MidtransError when ApiResponse is not present', async () => {
    const midtransError = new mockMidtransError('Error occurred', null);
    mockCore.transaction.status.mockRejectedValueOnce(midtransError);

    await expect(
      checkMidtransTransactionValidity('12345')
    ).rejects.toThrowError('Error occurred');
    expect(mockHttpError).not.toHaveBeenCalled();
  });

  it('should re-throw MidtransError when ApiResponse is not an object', async () => {
    const midtransError = new mockMidtransError(
      'Error occurred',
      'Invalid response'
    );
    mockCore.transaction.status.mockRejectedValueOnce(midtransError);

    await expect(
      checkMidtransTransactionValidity('12345')
    ).rejects.toThrowError('Error occurred');
    expect(mockHttpError).not.toHaveBeenCalled();
  });
});
