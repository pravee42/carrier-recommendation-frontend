import React, { useState } from "react";
import InputField from "./InputField";

const DynamicForm = ({ fields, onSubmit }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false)

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-lg rounded-lg max-w-md mx-auto">
            {fields.map((field, index) => (
                <InputField key={index} field={field} onChange={handleChange} />
            ))}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{loading ? "Analyzing" : "Submit"}</button>
        </form>
    );
};

export default DynamicForm;
