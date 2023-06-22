import { Redis } from "@upstash/redis"
const redis = Redis.fromEnv()

function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${day}-${month}-${year}`;
}

export default async function handler(req, res) {

  const { name, skills, workHistory, hashId } = req.body;
  const date = getFormattedDate();
  try {
    const incr = await redis.hincrby("request_counts", date, 1); //count how many requests have been made so far 
    const setResult = await redis.hset(`user:${hashId}`, { name, skills, workHistory });
    res.status(200).json({ result: setResult }) 
  } catch (error) {
    res.status(404).json({ error: error });
  }
}