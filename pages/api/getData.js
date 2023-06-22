import { Redis } from "@upstash/redis"
const redis = Redis.fromEnv()

export default async function getDataAction(req, res) {

  const { hashId } = req.body;

  const data = await redis.hgetall(`user:${hashId}`);
  if(data){
    return res.status(200).json({ data });
  }
  return res.status(200).json({ data: {} })
}