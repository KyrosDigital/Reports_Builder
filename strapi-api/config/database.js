module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        client: 'mongo',
				host: env('DATABASE_HOST', 'localhost'),
				port: env.int('DATABASE_PORT', 3001),
				database: env('DATABASE_NAME', 'meteor')
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
