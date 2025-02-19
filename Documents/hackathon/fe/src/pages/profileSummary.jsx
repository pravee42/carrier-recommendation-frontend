import React, {useState, useEffect} from "react";
import { useLocation, Link } from "react-router-dom";
import Markdown from "react-markdown";

const ProfileSummary = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const summary = location.state?.summary || "No summary available.";
  const jobName = location.state?.role


  const fetchJobs = async () => {
    console.log(jobName)
    try {
      const url = 'https://linkedin-api11.p.rapidapi.com/search-job-postings';
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '5a404082famshd487581aecce0d5p1f574fjsnec3b14ccb79d',
          'x-rapidapi-host': 'linkedin-api11.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keywords: jobName,
          location: 'India',
          page: 1
        })
      };

      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data.job_postings)
      setJobs(data.job_postings || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!jobName) return;

  
    fetchJobs();
  }, [jobName]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Career Recommendation</h2>
      <div className="prose">
        <Markdown>{summary}</Markdown>
      </div>
      <Link to="/" className="mt-4 block text-blue-500 hover:underline">
        Back to Form
      </Link>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Recommended Jobs for {jobName}</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job, index) => (
            <li key={index} className="border p-4 rounded-lg">
              <h3 className="font-bold">{job.title}</h3>
              <p>{job.company_name} - {job.location}</p>
              <a href={job.job_posting_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Apply Now
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
      <button onClick={fetchJobs}>get Data</button>
    </div>
  );
};

export default ProfileSummary;
