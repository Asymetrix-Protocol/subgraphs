import { Delegated, NewUserTwab, Ticket, Transfer } from '../../generated/Ticket/Ticket';

import { setBalance, setDelegatee, setTicket } from '../helpers/account';
import { loadOrCreateAccount } from '../helpers/loadOrCreateAccount';
import { loadOrCreateTicket } from '../helpers/loadOrCreateTicket';
import { generateCompositeId, ZERO } from '../helpers/common';
import { createTwab } from '../helpers/createTwab';
import { setTwab } from '../helpers/twab';

export function handleDelegated(event: Delegated): void {
  const delegate = event.params.delegator;
  const delegatee = event.params.delegate;

  const ticketAddress = event.address.toHexString();
  loadOrCreateTicket(ticketAddress);

  const delegateAccount = loadOrCreateAccount(delegate.toHexString());
  setTicket(ticketAddress, delegateAccount);

  const delegateeAccount = loadOrCreateAccount(delegatee.toHexString());
  setTicket(ticketAddress, delegateeAccount);

  setDelegatee(delegateAccount, delegateeAccount.id);

  delegateAccount.save();
  delegateeAccount.save();
}

export function handleNewUserTwab(event: NewUserTwab): void {
  const delegate = event.params.delegate;

  const ticketAddress = event.address.toHexString();
  loadOrCreateTicket(ticketAddress);

  const account = loadOrCreateAccount(delegate.toHexString());
  setTicket(ticketAddress, account);

  const ticketContract = Ticket.bind(event.address);
  const delegateAccountDetails = ticketContract.getAccountDetails(delegate);
  setBalance(account, ticketContract, delegate, delegateAccountDetails);

  const timestamp = event.block.timestamp;
  const twab = createTwab(generateCompositeId(delegate.toHexString(), timestamp.toHexString()));
  setTwab(twab, account, delegateAccountDetails, event.params.newTwab.amount, timestamp);

  twab.save();
  account.save();
}

export function handleTransfer(event: Transfer): void {
  const from = event.params.from;
  const to = event.params.to;

  const ticketAddress = event.address.toHexString();
  loadOrCreateTicket(ticketAddress);

  const fromAccount = loadOrCreateAccount(from.toHexString());
  setTicket(ticketAddress, fromAccount);

  const toAccount = loadOrCreateAccount(to.toHexString());
  setTicket(ticketAddress, toAccount);

  const ticketContract = Ticket.bind(event.address);

  const fromAccountDetails = ticketContract.getAccountDetails(from);
  setBalance(fromAccount, ticketContract, from, fromAccountDetails);

  const toAccountDetails = ticketContract.getAccountDetails(to);
  setBalance(toAccount, ticketContract, to, toAccountDetails);

  fromAccount.save();
  toAccount.save();
}
