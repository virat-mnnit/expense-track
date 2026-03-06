import Expense from '../models/Expense.model.js';
import { getIdempotencyKey } from '../utils/idempotency.js';

export const createExpense = async (req, res, next) => {
  try {
    const key = getIdempotencyKey(req);

    const existing = await Expense.findOne({ idempotencyKey: key });
    if (existing) {
      return res.status(200).json(existing);
    }

    const expense = await Expense.create({
      ...req.body,
      idempotencyKey: key,
    });

    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function getExpenses(req, res, next) {
  try {
    const { category, sort } = req.query;

    const query = {};

    if (category) {
      query.category = {
        $regex: new RegExp(`^${escapeRegex(category.trim())}$`, 'i') // exact match, case-insensitive
      };
    }

    let q = Expense.find(query);

    if (sort === 'date_desc') {
      q = q.sort({ date: -1 });
    } else if (sort === 'date_asc') {
      q = q.sort({ date: 1 });
    }

    const expenses = await q.exec();
    res.json(expenses);
  } catch (err) {
    next(err);
  }
}

