import clientPromise from '../db/connect';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("bookshop");
    const collection = db.collection("events");

    switch (req.method) {
      case 'GET':
        const events = await collection.find({}).toArray();
        res.status(200).json(events);
        break;

      case 'POST':
        const newEvent = req.body;
        const result = await collection.insertOne(newEvent);
        res.status(201).json({ ...newEvent, _id: result.insertedId });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 