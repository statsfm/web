module.exports = {
  apps: [
    {
      name: 'next',
      cwd: './',
      script: 'yarn',
      args: 'start --port 8080',
      instances: 12,
      time: true,
    },
  ],
};
