import { TWABRewards__getPromotionResultValue0Struct } from '../../generated/TWABRewards/TWABRewards';

import { Promotion } from '../../generated/schema';

import { BigInt } from '@graphprotocol/graph-ts';

export function setPromotion(
  promotion: Promotion,
  promotionInfo: TWABRewards__getPromotionResultValue0Struct,
): void {
  promotion.creator = promotionInfo.creator.toHexString();
  promotion.createdAt = promotionInfo.createdAt;
  promotion.startTimestamp = promotionInfo.startTimestamp;
  promotion.numberOfEpochs = BigInt.fromI32(promotionInfo.numberOfEpochs);
  promotion.epochDuration = promotionInfo.epochDuration;
  promotion.tokensPerEpoch = promotionInfo.tokensPerEpoch;
  promotion.rewardsUnclaimed = promotionInfo.rewardsUnclaimed;
  promotion.token = promotionInfo.token;
}

export function setPromotionEndedAt(promotion: Promotion, endedAt: BigInt): void {
  promotion.endedAt = endedAt;
}

export function setPromotionDestroyedAt(promotion: Promotion, destroyedAt: BigInt): void {
  promotion.destroyedAt = destroyedAt;
}
