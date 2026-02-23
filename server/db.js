import path from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON "database" file in the server folder (no native build tools needed)
const dbPath = path.join(__dirname, 'crop_yield.json');
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, { farmers: [], predictions: [], feedback: [] });

// Initialize db structure
await db.read();
if (!db.data) {
  db.data = { farmers: [], predictions: [], feedback: [] };
  await db.write();
}

// --- Helper functions used by the API ---

export async function savePrediction(prediction) {
  await db.read();
  const id = Date.now(); // simple unique id
  const created_at = new Date().toISOString();

  db.data.predictions.push({
    id,
    created_at,
    ...prediction
  });

  await db.write();
  return id;
}

export async function createFarmer(farmer) {
  await db.read();
  const id = Date.now();
  const created_at = new Date().toISOString();

  const record = { id, created_at, ...farmer };
  db.data.farmers.push(record);
  await db.write();
  return record;
}

export async function getFarmerById(id) {
  await db.read();
  return db.data.farmers.find((f) => f.id === id) || null;
}

export async function getPredictionsByFarmerId(farmerId) {
  await db.read();
  return db.data.predictions
    .filter((p) => p.farmer_id === farmerId)
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function addFeedback(predictionId, feedback) {
  await db.read();
  const id = Date.now();
  const created_at = new Date().toISOString();

  const record = { id, prediction_id: predictionId, created_at, ...feedback };
  db.data.feedback.push(record);
  await db.write();
  return record;
}


