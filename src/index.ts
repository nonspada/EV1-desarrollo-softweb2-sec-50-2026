import { Hono } from "hono";
import { serve } from "@hono/node-server";

// Definición del tipo de dato Transaction
type Transaction = {
    id: number
    description: string
    amount: number
    type: 'income' | 'expense'
}

const transactions: Transaction[] = [
    { id: 1, description: "Salary", amount: 5000, type: "income" },
    { id: 2, description: "Groceries", amount: 150, type: "expense" },
    { id: 3, description: "Freelance Project", amount: 1200, type: "income" },
    { id: 4, description: "Rent", amount: 1000, type: "expense" },
];

const app = new Hono();


/* Rutas*/
// GET
app.get("/", (c) => {
    return c.text("Hello, Hono!");
});

app.get("/transactions", (c) => {
    return c.json(transactions);
});

app.get("/transactions/:id", (c) => {
    const id = parseInt(c.req.param("id"));
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
        return c.json(transaction);
    } else {
        return c.text("Transaction not found", 404);
    }
});

// // POST
app.post("/transactions", async (c) => {
    const { description, amount, type } = await c.req.json();
    const newTransaction: Transaction = {
        id: transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1,
        description,
        amount,
        type,
    };
    transactions.push(newTransaction);
    return c.json(newTransaction, 201);
});


// // PUT
app.put("/transactions/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();

    const transactionIndex = transactions.findIndex((t) => t.id === id);
    if (transactionIndex === -1) {
        return c.text("Transaction not found", 404);
    }

    const updatedTransaction = {
        ...transactions[transactionIndex],
        description: body.description ?? transactions[transactionIndex].description,
        amount: body.amount ?? transactions[transactionIndex].amount,
        type: body.type ?? transactions[transactionIndex].type,
    };
    transactions[transactionIndex] = updatedTransaction;
    return c.json(updatedTransaction);
});

// DELETE
app.delete("/transactions/:id", (c) => {
    const id = parseInt(c.req.param("id"));
    const transactionIndex = transactions.findIndex((t) => t.id === id);

    if (transactionIndex === -1) {
        return c.text("Transaction not found", 404);
    }

    transactions.splice(transactionIndex, 1);
    return c.text("Transaction deleted");
});


serve({ fetch: app.fetch, port: 3000 }, () => {
    console.log("Server is running on http://localhost:3000");
});

