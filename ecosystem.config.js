module.exports = {
  apps: [
    {
      name: 'boteticaret',
      script: 'npm',
      args: 'start',
      cwd: 'C:/Users/Administrator/boteticaret',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'telegram-bot',
      script: 'npm',
      args: 'run bot',
      cwd: 'C:/Users/Administrator/boteticaret',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}

