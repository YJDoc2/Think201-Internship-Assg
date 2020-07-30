// Get connection string from env vars (when deployed) or use local (for dev test)
const connstr =
  process.env.MONGO_URI || 'mongodb://localhost:27017/Think201_Assg';

module.exports = {
  db: connstr,
  secret: 'MY_SECRETE',
};
