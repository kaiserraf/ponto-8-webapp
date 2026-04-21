import express from 'express';
import path from 'path';
import router from './routes';

const PORT = process.env.PORT;
const app = express();

app.use(express.static(path.join(__dirname, '../../frontend')));

app.use(express.json());
app.use('/', router);

app.get('/', (_req, res) => {
    res.redirect('/html/home.html');
});

app.listen(PORT, () => {
    console.log(`server launch at http://localhost:${PORT}/`);
});