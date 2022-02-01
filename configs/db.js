import mongoose from 'mongoose';
import log from '../logger/log.js';

const connect = (url = process.env.DB_URL_LOCAL || process.env.DB_URL_REMOTE , opts = {}) => {
  mongoose.connect(url, {
    ...opts,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('error', err => {
    log.error('err', err);
  });
  mongoose.connection.on('connected', (err, res) => {
    log.info('Connection establish');
  });
};

export default connect;