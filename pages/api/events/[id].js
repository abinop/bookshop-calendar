import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db("bookshop");
    const collection = db.collection("events");
    const { id } = req.query;

    switch (req.method) {
      case 'PUT':
        const updateData = req.body;
        const updateResult = await collection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updateData },
          { returnDocument: 'after' }
        );
        if (!updateResult.value) {
          return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(updateResult.value);
        break;

      case 'DELETE':
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}