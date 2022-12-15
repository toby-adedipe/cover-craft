import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = "write me an amazing cover letter for a";
const generateAction = async (req, res) => {
  // Run first prompt
  let prompt;
  if (req.body.skills && !req.body.jobDescription){
    //if there is skills and no jobdescription
    prompt = `${basePromptPrefix} ${req.body.jobRole} role at ${req.body.companyName} taking into
      consideration my following skills: ${req.body.skills} \n`
    console.log('token size(s): ', Math.floor(prompt.length/4));
  } else if (req.body.jobDescription && !req.body.skills){
    //if there is a job description but no skills
    prompt = `${basePromptPrefix} ${req.body.jobRole} role at ${req.body.companyName} with the following 
      job description: ${req.body.skills} \n`
    console.log('token size(d): ', Math.floor(prompt.length/4));
  } else if (req.body.skills && req.body.jobDescription){
    //if user added both skills and job description
    prompt = `${basePromptPrefix} ${req.body.jobRole} role at ${req.body.companyName} taking into consideration
      the following skills and job description. job description: ${req.body.jobDescription}. \n skills: ${req.body.skills}. \n`
    console.log('token size(sd): ', Math.floor(prompt.length/4));
  } else {
    //if user doesn't add any
    prompt = `${basePromptPrefix} ${req.body.jobRole} role at ${req.body.companyName}`;
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