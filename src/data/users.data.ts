export interface UserCredentials {
  username: string;
  password: string;
}

// SauceDemo seeds every account with the same password; only the username
// changes the account's behavior (locked out, slow UI, broken images, etc).
const PASSWORD = process.env.USER_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: {
    username: process.env.STANDARD_USER ?? 'standard_user',
    password: PASSWORD,
  },
  lockedOut: {
    username: process.env.LOCKED_OUT_USER ?? 'locked_out_user',
    password: PASSWORD,
  },
  problem: {
    username: process.env.PROBLEM_USER ?? 'problem_user',
    password: PASSWORD,
  },
  performanceGlitch: {
    username: process.env.PERFORMANCE_GLITCH_USER ?? 'performance_glitch_user',
    password: PASSWORD,
  },
} as const satisfies Record<string, UserCredentials>;

export const invalidLoginCases: Array<{
  name: string;
  username: string;
  password: string;
  expectedError: string;
}> = [
  {
    name: 'unknown username',
    username: 'no_such_user',
    password: PASSWORD,
    expectedError: 'Username and password do not match any user in this service',
  },
  {
    name: 'wrong password',
    username: users.standard.username,
    password: 'wrong_password',
    expectedError: 'Username and password do not match any user in this service',
  },
  {
    name: 'empty username',
    username: '',
    password: PASSWORD,
    expectedError: 'Username is required',
  },
  {
    name: 'empty password',
    username: users.standard.username,
    password: '',
    expectedError: 'Password is required',
  },
  {
    name: 'locked out user',
    username: users.lockedOut.username,
    password: PASSWORD,
    expectedError: 'Sorry, this user has been locked out.',
  },
];
