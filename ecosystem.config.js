module.exports = {
  apps: [
    {
      name: 'next',
      cwd: './',
      script: 'yarn',
      args: 'start --port 80',
      instances: 12,
      time: true,
    },
  ],
};
