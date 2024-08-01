import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { OpenAI } from 'openai';

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || 'random';
const openai = new OpenAI({ apiKey });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX',
    });
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0,
            max_tokens: 35,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].message.content,
        });
    } catch (error) {
        console.error('Error creating chat completion:', error.response ? error.response.data : error.message);
        res.status(500).send({ error: error.message });
    }
});

app.listen(5000, () => console.log('Server is running on port 5000'));
