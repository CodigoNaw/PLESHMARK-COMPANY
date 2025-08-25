import mongoose from "mongoose";

const uri = "mongodb+srv://202429aragongka:Kevin1925@pleshmark.9reifto.mongodb.net/pleshmark";

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Conexión a MongoDB Atlas exitosa");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error conectando a MongoDB Atlas:", err);
    process.exit(1);
  });
