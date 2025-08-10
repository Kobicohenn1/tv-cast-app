const app = require('./app');
const { PORT } = require('./config/default');

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
