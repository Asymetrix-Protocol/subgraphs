import { ClaimedDraw } from '../../generated/PrizeDistributor/PrizeDistributor';

import { loadOrCreateAccountDraw } from '../helpers/loadOrCreateAccountDraw';
import { loadOrCreateAggregate } from '../helpers/loadOrCreateAggregate';
import { loadOrCreateAccount } from '../helpers/loadOrCreateAccount';
import { loadOrCreateDraw } from '../helpers/loadOrCreateDraw';

import { ONE } from '../helpers/common';

export function handleClaimedDraw(event: ClaimedDraw): void {
  const user = event.params.user;
  const drawId = event.params.drawId;
  const payout = event.params.payout;

  const timestamp = event.block.timestamp;
  const draw = loadOrCreateDraw(drawId.toString(), timestamp);
  const account = loadOrCreateAccount(user.toHexString());
  const aggregate = loadOrCreateAggregate(ONE.toString());

  // Many-to-many join table
  loadOrCreateAccountDraw(account, draw, payout, timestamp);

  // Increment
  draw.totalClaimed = draw.totalClaimed.plus(payout);
  draw.save();

  // Increment
  account.totalClaimed = account.totalClaimed.plus(payout);
  account.save();

  // Increment
  aggregate.totalClaimed = aggregate.totalClaimed.plus(payout);
  aggregate.save();
}
