import express from 'express';
import { PrismaClient } from '@prisma/client';
//import { MSSQLAdapter } from '@prisma/adapter-mssql';
import cors from 'cors';
import 'dotenv/config';

//const adapter = new MSSQLAdapter(process.env.DATABASE_URL!);
const prisma = new PrismaClient();//{ adapter }

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await prisma.stock.findMany();
    res.json(stocks);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// ➕ අලුත් Stock එකක් ඇතුළත් කිරීම
app.post('/api/stocks', async (req, res) => {
  const { symbol, lastPrice, changePercentage } = req.body;
  try {
    const newStock = await prisma.stock.create({
      data: {
        symbol,
        lastPrice: parseFloat(lastPrice),
        changePercentage: parseFloat(changePercentage),
      },
    });
    res.json(newStock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "දත්ත ඇතුළත් කිරීමට නොහැකි විය." });
  }
});

// 🗑️ Stock එකක් මකා දැමීම (Delete)
app.delete('/api/stocks/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    await prisma.stock.delete({
      where: { symbol: symbol },
    });
    res.json({ message: "සාර්ථකව මකා දැමුවා!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "දත්ත මකා දැමීමට නොහැකි විය." });
  }
});

// 🔄 Stock එකක මිල හෝ වෙනස්වීම් Update කිරීම
app.put('/api/stocks/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const { lastPrice, changePercentage } = req.body;
  try {
    const updatedStock = await prisma.stock.update({
      where: { symbol: symbol },
      data: {
        lastPrice: parseFloat(lastPrice),
        changePercentage: parseFloat(changePercentage),
      },
    });
    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ error: "දත්ත යාවත්කාලීන කිරීමට නොහැකි විය." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend එක http://localhost:${PORT} හි සාර්ථකව run වේ!`);
});