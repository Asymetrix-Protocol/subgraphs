import { Account, Draw, AccountDraw } from '../../generated/schema';

import { generateCompositeId } from '../helpers/common';

import { BigInt } from '@graphprotocol/graph-ts';

export function loadOrCreateAccountDraw(
  account: Account,
  draw: Draw,
  payout: BigInt,
  timestamp: BigInt,
): AccountDraw {
  const id = generateCompositeId(account.id.toString(), draw.id);

  let accountDraw = AccountDraw.load(id);

  if (accountDraw == null) {
    accountDraw = new AccountDraw(id);
    accountDraw.account = account.id.toString();
    accountDraw.claimed = payout;
    accountDraw.draw = draw.id.toString();
    accountDraw.claimedAtTimestamp = timestamp;
  }

  // Just save
  accountDraw.save();

  return accountDraw as AccountDraw;
}
