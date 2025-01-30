import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const expenseSchema = z.object({
  name: z.string().min(3).max(20),
  amount: z.number().positive(),
  id: z.number().int().min(1).positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const expenses: Expense[] = [
  { id: 1, name: "Groceries", amount: 50.75 },
  { id: 2, name: "Rent", amount: 1200.0 },
  { id: 3, name: "Utilities", amount: 200.5 },
  { id: 4, name: "Subscription", amount: 15.99 },
  { id: 5, name: "Transport", amount: 30.0 },
];

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: expenses });
  })

  .post("/", zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json");
    expenses.push({ ...expense, id: expenses.length + 1 });
    return c.json({ expense });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = expenses.find((expense) => expense.id == id);
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const index = expenses.findIndex((expense) => expense.id == id);
    if (!index) {
      return c.notFound();
    }
    const deletedExpense = expenses.splice(index, 1)[0];
    return c.json({ expenses: deletedExpense });
  })
  .get("/total-spent", (c) => {
    const totalSpent: number = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    return c.json({ totalSpent });
  });
