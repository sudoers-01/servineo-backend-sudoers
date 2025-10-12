import Server from './config/server.config';
import _connect from './database';

import { SERVER_PORT } from './config/env.config';

async function startServer() {
  try {
    Server.listen(SERVER_PORT, () => {
      console.info(`Server running on http://localhost:${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('Error starting server', error);
  }
}

_connect();
startServer();