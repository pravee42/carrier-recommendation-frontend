import React from "react";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../components/DynamicForm";
import formFields from "../config/formConfig";

const FormPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {

    const submitResponse = await fetch("http://localhost:4870/api/form/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${(localStorage.getItem('token'))}` },
      body: JSON.stringify(formData),
    });

    const analyzeData = await submitResponse.json();

    if (analyzeData.message) {
      navigate("/result", { state: { summary: analyzeData.message, role: analyzeData.jobName, location: "India" } });
    } else {
      console.error("Failed to get career recommendations.");
    }
  };

  return <DynamicForm fields={formFields} onSubmit={handleSubmit} />;
};

export default FormPage;
