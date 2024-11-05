import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  const client = await clientPromise;
  const db = client.db("bookshop");

  switch (method) {
    case 'GET':
      try {
        const event = await db.collection('events').findOne({ 
          _id: new ObjectId(id)
        });
        
        if (!event) {
          return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching event' });
      }
      break;

    case 'PUT':
      try {
        const { title, description, start, end } = req.body;
        
        const updateData = {
          title,
          description,
          start: new Date(start),
          end: new Date(end),
          updatedAt: new Date()
        };

        const result = await db.collection('events').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully' });
      } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Error updating event' });
      }
      break;

    case 'DELETE':
      try {
        const result = await db.collection('events').deleteOne({
          _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
      } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Error deleting event' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}