import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateCoverLetter = async (req, res) => {

  const { name, skills, workHistory, jobRole, companyName, jobDescription } = req.body;

  const basePrompt = `name: ${name}
  skills: ${skills},
  workhistory: ${workHistory}
  jobrole: ${jobRole}
  companyname: ${companyName}
  job description: ${jobDescription}
  
  Write a conversational cover letter for a job application as a [jobrole] at [companyname] using my [workhistory] to show how i am prepared for the position, mention my relevant [skills] and how they match the job description"`

  
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "you are a brilliant cover letter writer that writes personalized cover letters."},
        {"role": "user", "content": basePrompt },
      ]
    })
  
    const completionOutput = completion.data.choices[0].message.content;  
    res.status(200).json({ output: completionOutput });
  } catch (error) {
    res.status(404).json({ error: error });
  }
}

export default generateCoverLetter;