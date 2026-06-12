import mongoose from 'mongoose'

interface MongooseCache {
  conn: typeof mongoose | null // 연결된 인스턴스
  promise: Promise<typeof mongoose> | null // 연결 진행중 프로미스
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }
global.mongooseCache = cached

// 커넥션 전역 캐싱한 뒤 재사용
export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI 환경 변수가 설정되지 않았습니다')
    }
    cached.promise = mongoose.connect(uri, { bufferCommands: false })
  }

  cached.conn = await cached.promise
  return cached.conn
}
