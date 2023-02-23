import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
  const basePromptPrefix = "write me an amazing cover letter for a";

  const { jobRole, skills, companyName, jobDescription } = req.body;
  // Run first prompt
  let prompt;
  if (skills && !jobDescription){
    //if there is skills and no jobdescription
    prompt = `${basePromptPrefix} ${jobRole} role at ${companyName} taking into
      consideration my following skills: ${skills} \n`
    console.log('token size(s): ', Math.floor(prompt.length/4));
  } else if (jobDescription && !skills){
    //if there is a job description but no skills
    prompt = `${basePromptPrefix} ${jobRole} role at ${companyName} with the following 
      job description: ${skills} \n`
    console.log('token size(d): ', Math.floor(prompt.length/4));
  } else if (skills && jobDescription){
    //if user added both skills and job description
    prompt = `${basePromptPrefix} ${jobRole} role at ${companyName} taking into consideration
      the following skills and job description. job description: ${jobDescription}. \n skills: ${skills}. \n`
    console.log('token size(sd): ', Math.floor(prompt.length/4));
  } else {
    //if user doesn't add any
    prompt = `${basePromptPrefix} ${jobRole} role at ${companyName}`;
    console.log('token size(def): ', Math.floor(prompt.length/4));
  }

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0.8, //give users ability to adjust
    max_tokens: 500, //also check this
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;