import Head from 'next/head';
import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';

const Home = () => {
  const tagManagerArgs = {
    gtmId: 'G-7Q8WJ2V31B'
  }

  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [skills, setSkills] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyName,  jobRole, skills, jobDescription}),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }
  
  const onChangeJobRole = (e) => {
    setJobRole(e.target.value);
  }

  const onChangeCompanyName = (e) => {
    setCompanyName(e.target.value);
  }

  const onChangeSkills = (e) => {
    setSkills(e.target.value);
  };

  const onChangeJobDescription = (e) => {
    setJobDescription(e.target.value);
  };

  useEffect(()=>{
    TagManager.initialize(tagManagerArgs);
  }, [])

  const copyText = () => {navigator.clipboard.writeText(apiOutput)}

  return (
    <div className="root">
      <Head>
        <title>Cover Craft</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Cover Craft</h1>
          </div>
          <div className="header-subtitle">
            <h2>Discover the Power of GPT3 with Covercraft: An Automated Cover Letter Writing Tool</h2>
          </div>
        </div>
        <div className="prompt-container">
          <div className="prompt-div">
            <label>Company name: </label>
            <input 
              type="text" 
              className="prompt-input"
              maxLength={200}
              placeholder='Company Name (e.g. Microsoft)' 
              onChange={onChangeCompanyName}
            />
          </div>
          <div className="prompt-div">
            <label>Role:</label>
            <input 
              type="text" 
              className="prompt-input" 
              maxLength={200}
              placeholder="Role you're applying for(e.g. software developer)"
              onChange={onChangeJobRole}
            />
          </div>
          <div className='prompt-div'>
            <label>Skills:</label>
            <p 
              className='word-count'
              style={{
                color: skills.length> 950 ? '#FF4F12' : '#fff'
              }}
            > 
              ({1000-skills.length}) 
            </p>
            <textarea
              maxLength={1000}
              className="prompt-box"
              placeholder="Let's show off your awesome skills! Tell us what you do and what skills you bring to the table!"
              onChange={onChangeSkills}
            />
          </div>
          <div className='prompt-div'>
            <label>Job Description:</label>
            <p 
              className='word-count'
              style={{
                color: skills.length> 950 ? '#FF4F12' : '#fff'
              }}
            > 
              ({ 1000-jobDescription.length }) 
            </p>
            <textarea
              maxLength={1000}
              className="prompt-box"
              placeholder="Let's get the job description for the job you're applying to in here!"
              onChange={onChangeJobDescription}
            />
          </div>
          <div className="prompt-buttons">
            <a className="generate-button" onClick={callGenerateEndpoint}>
              <div className="generate">
                {isGenerating ? <span class="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {
            apiOutput && (
              <div className="output">
                <div className="output-header-container">
                  <div className="output-header">
                    <h3>Cover Letter</h3>
                  </div>
                </div>
                <div className="output-content">
                  <p>{apiOutput}</p>
                </div>
                <a className="generate-button" onClick={copyText}>
                  <div className="generate">
                    <p>Copy</p>
                  </div>
                </a>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
