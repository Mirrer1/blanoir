import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI 환경 변수가 설정되지 않았어요')
}

interface MongooseCache {
  conn: typeof mongoose | null // 연결된 인스턴스
  promise: Promise<typeof mongoose> | null // 연결 진행중 프로미스
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }
global.mongooseCache = cached

// 서버리스 환경에서 커넥션을 전역 캐싱해 재사용 (커넥션 누수 방지)
export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }

  cached.conn = await cached.promise
  return cached.conn
}
