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

const generateAction = async( req, res ) => {

  const { name, skills, workHistory, jobRole, companyName, jobDescription } = req.body;

  const basePrompt = `my name is [${name.length>0?name:"name"}] Write a conversational cover letter for a job application as a [${jobRole.length>0?jobRole:"job role"}] at [${companyName.length>0?companyName:"company name"}] using my [${skills.length>0?skills:"skills"}] and [${workHistory.length>0?workHistory:"name"}] to show how i am prepared for the position, mention my relevant  javscript typescript and how they match the [${jobDescription.length>0?jobDescription:"name"}] \n`

  try {
    const baseCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: basePrompt,
      temperature: 0.8,
      max_tokens: 3000, 
    });

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: basePrompt,
      temperature: 1,
      max_tokens: 3813,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
  
    const basePromptOutput = response.data.choices.pop();

    console.log('basecompletion: ', response.data);
    return res.status(200).json({ output: basePromptOutput });

  } catch (error) {
    console.log('error: ', error)
    return res.status(404).json({ error: error });
  }
  
}

export default generateCoverLetter;