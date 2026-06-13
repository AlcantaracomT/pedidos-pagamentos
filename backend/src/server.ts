import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { pool } from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/products", async (req, res) => {
  const storeId = req.query.storeId ? Number(req.query.storeId) : 1;

  const [rows] = await pool.query(
    `
    SELECT
      p.COD_PRODUTO AS id,
      p.DCR_PRODUTO AS name,
      p.VLR_PRODUTO AS price,
      p.FLAG_DISPONIVEL AS available,
      p.COD_CATEGORIA AS categoryId,
      c.DCR_CATEGORIA AS category,
      p.COD_EMPREEDIMENTO AS storeId,
      e.DCR_NOME_FANTASIA AS storeName
    FROM PRODUTO p
    INNER JOIN CATEGORIA c
      ON c.COD_CATEGORIA = p.COD_CATEGORIA
    INNER JOIN EMPREENDIMENTO e
      ON e.COD_EMPREEDIMENTO = p.COD_EMPREEDIMENTO
    WHERE p.FLAG_DISPONIVEL = 'S'
      AND p.COD_EMPREEDIMENTO = ?
    ORDER BY c.DCR_CATEGORIA, p.DCR_PRODUTO
    `,
    [storeId]
  );

  res.json(rows);
});

app.get("/payment-methods", async (_req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      COD_FORMA_PAGTO AS id,
      DCR_FORMA_PAGTO AS name
    FROM FORMA_PAGTO
    ORDER BY COD_FORMA_PAGTO
    `
  );

  res.json(rows);
});

app.post("/orders", async (req, res) => {
  const {
    clientId = 1,
    paymentMethodId,
    paymentDetails = "",
    delivery = 5,
    discount = 10,
    items,
  } = req.body;

  if (!paymentMethodId) {
    return res.status(400).json({ message: "Forma de pagamento obrigatória." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "O pedido precisa ter itens." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [pedidoIdRows] = await connection.query<any[]>(
      "SELECT COALESCE(MAX(COD_PEDIDO), 0) + 1 AS nextId FROM PEDIDO"
    );

    const orderId = pedidoIdRows[0].nextId;

    const productIds = items.map((item: any) => Number(item.productId));

    const [products] = await connection.query<any[]>(
      `
      SELECT COD_PRODUTO, VLR_PRODUTO
      FROM PRODUTO
      WHERE COD_PRODUTO IN (?)
      `,
      [productIds]
    );

    let subtotal = 0;

    for (const item of items) {
      const product = products.find(
        (p) => Number(p.COD_PRODUTO) === Number(item.productId)
      );

      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado.`);
      }

      subtotal += Number(product.VLR_PRODUTO) * Number(item.quantity);
    }

    const total = Math.max(0, subtotal + Number(delivery) - Number(discount));

    await connection.query(
      `
      INSERT INTO PEDIDO
      (
        COD_PEDIDO,
        TIP_PEDIDO,
        DATA_PEDIDO,
        VLR_PEDIDO,
        COD_CLIENTE,
        COD_FORMA_PAGTO,
        DCR_DADOS_PAGTO
      )
      VALUES (?, 'P', NOW(), ?, ?, ?, ?)
      `,
      [orderId, total, clientId, paymentMethodId, paymentDetails]
    );

    for (const item of items) {
      const product = products.find(
        (p) => Number(p.COD_PRODUTO) === Number(item.productId)
      );

      const unitPrice = Number(product.VLR_PRODUTO);
      const quantity = Number(item.quantity);
      const itemTotal = unitPrice * quantity;

      const [itemIdRows] = await connection.query<any[]>(
        "SELECT COALESCE(MAX(COD_ITEM_PEDIDO), 0) + 1 AS nextId FROM ITEM_PEDIDO"
      );

      const itemId = itemIdRows[0].nextId;

      await connection.query(
        `
        INSERT INTO ITEM_PEDIDO
        (
          COD_ITEM_PEDIDO,
          VLR_PRODUTO,
          QTD_PRODUTO,
          VLR_TOTAL,
          COD_PEDIDO,
          COD_PRODUTO
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [itemId, unitPrice, quantity, itemTotal, orderId, item.productId]
      );
    }

    await connection.commit();

    res.status(201).json({
      orderId,
      subtotal,
      delivery,
      discount,
      total,
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      message: "Erro ao criar pedido.",
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    connection.release();
  }
});

const port = Number(process.env.PORT ?? 3001);

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});