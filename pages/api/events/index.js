import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("bookshop");

    if (req.method === 'GET') {
      const events = await db.collection('events').find({}).toArray();
      return res.json(events);
    }

    if (req.method === 'POST') {
      const { title, description, start, end } = req.body;
      const result = await db.collection('events').insertOne({
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        createdAt: new Date()
      });
      return res.status(201).json(result);
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Error connecting to database' });
  }
} 