import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockFindOne = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const mockCreate = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const mockGenerateReferralCode = jest.fn<(length: number) => string>();

jest.unstable_mockModule('../models/users.models.js', () => ({
  default: {
    findOne: mockFindOne,
    create: mockCreate,
  },
}));

jest.unstable_mockModule('../utils/code.js', () => ({
  generateReferralCode: mockGenerateReferralCode,
}));

const { createReferralCode } = await import('../services/referral.service.js');

const user = {
  firstname: 'Ada',
  email: 'ada@example.com',
};

describe('createReferralCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user with a generated referral code and idempotency key', async () => {
    const newUser = { ...user, referral_code: 'ABC123', idempotent_key: 12 };
    mockFindOne.mockResolvedValue(null);
    mockGenerateReferralCode.mockReturnValue('ABC123');
    mockCreate.mockResolvedValue(newUser);

    const result = await createReferralCode({ ...user, idempotencyKey: 12 });

    expect(mockCreate).toHaveBeenCalledWith({
      ...user,
      referral_code: 'ABC123',
      idempotent_key: 12,
    });
    expect(result).toEqual({
      status: 201,
      success: true,
      message: 'User registered Successfully',
      referral_code: 'ABC123',
      newUser,
    });
  });

  it('returns a duplicate response for a repeated idempotency key', async () => {
    mockFindOne.mockResolvedValue({
      ...user,
      idempotent_key: 12,
      referral_code: 'ABC123',
    });

    await expect(
      createReferralCode({ ...user, idempotencyKey: 12 }),
    ).resolves.toEqual({
      status: 409,
      success: false,
      message: 'Duplicate request',
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('returns the existing referral code when the email is already registered', async () => {
    const existingUser = {
      ...user,
      idempotent_key: 11,
      referral_code: 'ABC123',
    };
    mockFindOne.mockResolvedValue(existingUser);

    await expect(
      createReferralCode({ ...user, idempotencyKey: 12 }),
    ).resolves.toEqual({
      status: 409,
      success: false,
      referral_code: 'ABC123',
      existingUser,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
