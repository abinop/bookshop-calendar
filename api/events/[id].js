import clientPromise from '../db/connect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
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