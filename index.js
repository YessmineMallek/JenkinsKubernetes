import express from 'express';

const app = express();
// Disable 'X-Powered-By' header to prevent version disclosure
app.disable('x-powered-by');

app.get('/', function (req, res) {
    res.send('{ "response": "Hello From DevSecOps" }');
});

app.get('/will', function (req, res) {
    res.send('{ "response": "Hello World" }');
});
app.get('/ready', function (req, res) {
    res.send('{ "response": " Great!, It works!" }');
});
app.listen(process.env.PORT || 3001);

export default app;
