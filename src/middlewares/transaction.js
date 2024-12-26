import * as transactionService from '../services/transaction.js';

export async function getMaxTransactionDataAndCreateMeta(_req, res, next) {
  const filter = res.locals.filter;
  const page = res.locals.page;
  const userId = res.locals.user.id;

  const meta =
    await transactionService.countTransactionDataWithFilterAndCreateMeta(
      filter,
      page,
      userId
    );

  res.locals.meta = meta;

  next();
}
