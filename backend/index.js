// backend/index.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Initialize the OpenAI client with your API key.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

/**
 * Endpoint to generate a test paper.
 * Expects form-data with:
 * - difficulty
 * - questionStyle
 * - additionalDetails
 * - pastPaper (optional file upload)
 */
app.post('/api/generate-paper', upload.single('pastPaper'), async (req, res) => {
  try {
    const { difficulty, questionStyle, additionalDetails } = req.body;
    let pastPaperText = '';
    if (req.file) {
      pastPaperText = req.file.buffer.toString('utf-8');
    }

    // Build the prompt for generating a mock test paper.
    const prompt = `
Generate a mock test paper with the following requirements:
- Difficulty: ${difficulty}
- Question Style: ${questionStyle}
- Base it on this past paper: ${pastPaperText}
- Additional Details: ${additionalDetails}

Please provide a clear, numbered list of questions.
    `;

    // Use the new completions.create method
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 1500,
      temperature: 0.7,
    });

    // Access the text from the first choice
    const paper = response.choices[0].text.trim();
    res.json({ paper });
  } catch (error) {
    console.error('Error generating paper:', error);
    res.status(500).json({ error: 'Failed to generate paper' });
  }
});

/**
 * Endpoint to process the user’s answers.
 * Expects JSON with:
 * - paper (the original test paper)
 * - userAnswers (the student’s answers)
 */
app.post('/api/process-answers', async (req, res) => {
  try {
    const { paper, userAnswers } = req.body;

    const prompt = `
You are an examiner. Given the following test paper and the student's answers,
mark the answers and provide detailed feedback on the questions the student got wrong.

Test Paper:
${paper}

Student Answers:
${userAnswers}

Provide clear feedback and corrections for each question.
    `;

    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 1500,
      temperature: 0.7,
    });

    const feedback = response.choices[0].text.trim();
    res.json({ feedback });
  } catch (error) {
    console.error('Error processing answers:', error);
    res.status(500).json({ error: 'Failed to process answers' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
