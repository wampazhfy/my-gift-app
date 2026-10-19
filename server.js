process.on('uncaughtException', (err) => {
  console.error('КРИТИЧЕСКАЯ ОШИБКА НА СТАРТЕ:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('НЕОБРАБОТАННЫЙ PROMISE:', reason);
  process.exit(1);
});
