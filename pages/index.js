import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('');
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
      body: JSON.stringify({ companyName,  jobRole}),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  // const onUserChangedText = (event) => {
  //   setUserInput(event.target.value);
  // };
  
  const onChangeJobRole = (e) => {
    setJobRole(e.target.value);
  }

  const onChangeCompanyName = (e) => {
    setCompanyName(e.target.value);
  }

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
              placeholder='Company Name (e.g. Microsoft)' 
              onChange={onChangeCompanyName}
            />
          </div>
          <div className="prompt-div">
            <label>Role:</label>
            <input 
              type="text" 
              className="prompt-input" 
              placeholder="Role you're applying for(e.g. software developer)"
              onChange={onChangeJobRole}
            />
          </div>
          {/* <textarea
            className="prompt-box"
            placeholder="start typing here"
            value={userInput}
            onChange={onUserChangedText}
          /> */}
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
