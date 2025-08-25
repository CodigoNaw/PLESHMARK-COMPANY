import mongoose from "mongoose";

let isConnected = false; // evita conexiones múltiples en dev

export default async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "pleshmark", // 👈 pon el nombre de tu base
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err);
    throw err;
  }
}
