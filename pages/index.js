import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import TagManager from 'react-gtm-module';
const crypto = require('crypto');

const Home = ({ hashId, userName, userSkills, userWorkHistory }) => {
  const tagManagerArgs = {
    gtmId: 'G-7Q8WJ2V31B'
  }

  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState(userName);
  const [jobRole, setJobRole] = useState('');
  const [skillStr, setSkill] = useState('');
  const [skillSet, setSkillSet] = useState(userSkills);
  const [workHistory, setWorkHistory] = useState(userWorkHistory);
  const [jobDescription, setJobDescription] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    
    let skills = skillSet.length> 0 ? skillSet.join(', ') : "";


    await updateInfo();
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, skills, workHistory, companyName,  jobRole, jobDescription}),
      });
  
      const data = await response.json();
      const { output } = data;
  
      setApiOutput(`${output}`);
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
    }
  }
  
  const onChangeJobRole = (e) => {
    setJobRole(e.target.value);
  }

  const onChangeName = (e) => {
    setName(e.target.value);
  }

  const onSkillChange = (e)=> {
    setSkill(e.target.value);
  }

  const onChangeWorkHistory = (e)=> {
    setWorkHistory(e.target.value);
  }

  const onChangeCompanyName = (e) => {
    setCompanyName(e.target.value);
  }

  const onChangeJobDescription = (e) => {
    setJobDescription(e.target.value);
  };

  const deleteSkill = (skill) => {
    const prevSkills = skillSet;

    const newSkills = prevSkills.filter(item => item !== skill);

    setSkillSet(newSkills)
  }

  const getRandomColor = (() => {
    const colors = ['#F1DBC9', '#E3E2E0', '#F1E1E9', '#ECE0DB', '#D6E4EE', '#E6DEED', '#F5DFCC', '#FAEDCC'];
    let currentIndex = 0;
  
    return () => {
      if (currentIndex >= colors.length) {
        currentIndex = 0;
        // Shuffle the colors array to ensure each color appears at least once
        colors.sort(() => Math.random() - 0.5);
      }
  
      const color = colors[currentIndex];
      currentIndex++;
      return color;
    };
  })();

  const updateInfo = async() => {

    let skills = skillSet.length> 0 ? skillSet.join(', ') : "";

    const response = await fetch('/api/store', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({ hashId, name, skills, workHistory }),
    });

    const data = await response.json();

    // console.log('saved?: ', data.result? 'true' : 'false');
  }

  const addSkill = (skill) => {
    const prevSkills = skillSet;
    prevSkills.push(skill);
    setSkillSet(prevSkills);
    setSkill("");
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addSkill(skillStr)
    }
  };

  useEffect(()=>{
    TagManager.initialize(tagManagerArgs);
  }, [])

  const copyText = () => {navigator.clipboard.writeText(apiOutput)}
  const year = useMemo(() => new Date().getFullYear(), []);

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
            <label>Name:</label>
            <input 
              type="text" 
              className="prompt-input" 
              value={name}
              maxLength={200}
              placeholder="Please tell us your full name so we can make it more personalized."
              onChange={onChangeName}
            />
          </div>
          <div className="prompt-div">
            <label>Skills:</label>
            {skillSet.length > 0 && (
              <div className='skill-set'>
                {skillSet.map((skill) => (
                  <div
                    key={skill}
                    style={{ backgroundColor: getRandomColor(skill) }}
                  >
                    {`${skill}   `}
                    <span className='deleteBtn' onClick={() => deleteSkill(skill)}>
                      X
                    </span>
                  </div>
                ))}
              </div>
            )}
            <input 
              type="text" 
              className="prompt-input" 
              maxLength={200}
              onKeyDown={handleKeyPress}
              value={skillStr}
              placeholder="please enter as many skills as possible, we will incoperate them into the cover letter"
              onChange={onSkillChange}
            />
          </div>             
          <div className='prompt-div'>
            <label>Work History:</label>
            <p 
              className='word-count'
              style={{
                color: workHistory.length> 950 ? '#FF4F12' : '#fff'
              }}
            > 
              ({1000-workHistory.length}) 
            </p>
            <textarea
              maxLength={1000}
              value={workHistory}
              className="prompt-box"
              placeholder="Tell us about your work history"
              onChange={onChangeWorkHistory}
            />
          </div>
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
            <label>Job Description:</label>
            <p 
              className='word-count'
              style={{
                color: jobDescription.length> 950 ? '#FF4F12' : '#fff'
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
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
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
      <div className='footer'>
        <p>Made with ❤️ by <a href='https://www.linkedin.com/in/oluwatobi-adedipe/' target="_blank" >Tobi Adedipe</a></p>
        <p>© {year} Cover Craft.</p>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  let ip = req.headers["x-real-ip"];
  if (!ip) {
    const forwardedFor = req.headers["x-forwarded-for"];
    if (Array.isArray(forwardedFor)) {
      ip = forwardedFor.at(0);
    } else {
      ip = forwardedFor?.split(",").at(0) ?? "Unknown";
    }
  }

  

  function generateHash(ipAddress) {
    const hash = crypto.createHash('sha256');
    hash.update(ipAddress);
    return hash.digest('hex');
  }
  
  const hashId = generateHash(String(ip));
 
  const response = await fetch(`${process.env.URL}/api/getData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hashId }),
  });

  const json = await response?.json();

  const { data } = json;

  return {
    props: {
      hashId,
      userName: data?.name ? data?.name : "",
      userSkills: data?.skills ? data?.skills.split(",") : [],
      userWorkHistory: data?.workHistory ? data?.workHistory : ""
    },
  };
};

export default Home;
