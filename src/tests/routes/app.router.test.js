/* eslint-disable no-undef */
const UserRouter = require('../../users/user.router');
const UserSecureRouter = require('../../users/user.secure.router');
const AccountSecureRouter = require('../../modules/accounting/accounts/accounts.secure.router');
const OperationSecureRouter = require('../../modules/accounting/operations/operation.secure.router');

describe('App:', () => {
  it('UserRouter should be defined', () => {
    expect(UserRouter).toBeDefined();
  });

  it('UserSecureRouter should be defined', () => {
    expect(UserSecureRouter).toBeDefined();
  });

  it('AccountRouter should be defined', () => {
    expect(AccountSecureRouter).toBeDefined();
  });

  it('OperationSecureRouter should be defined', () => {
    expect(OperationSecureRouter).toBeDefined();
  });
});
