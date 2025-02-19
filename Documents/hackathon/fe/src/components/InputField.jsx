import React from "react";

const InputField = ({ field, onChange }) => {
    const { label, type, placeholder, options, name } = field;

    const handleChange = (e) => {
        onChange(name, e.target.value);
    };

    return (
        <div>
            <label className="block text-gray-700">{label}</label>
            {type === "text" || type === "email" || type === "number" ? (
                <input type={type} placeholder={placeholder} onChange={handleChange} className="w-full p-2 border rounded" />
            ) : type === "textarea" ? (
                <textarea placeholder={placeholder} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
            ) : type === "radio" ? (
                options.map((option, i) => (
                    <label key={i} className="inline-flex items-center space-x-2">
                        <input type="radio" name={label} value={option} onChange={handleChange} />
                        <span>{option}</span>
                    </label>
                ))
            ) : type === "select" ? (
                <select onChange={handleChange} className="w-full p-2 border rounded">
                    {options.map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                    ))}
                </select>
            ) : null}
        </div>
    );
};

export default InputField;
