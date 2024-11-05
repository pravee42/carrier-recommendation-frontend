t1 = "Rk1SACAyMAAAAAD8AAABLAGQAMUAxQEAAAA+JUCUACR7AECpADnoAEA8AD0VAEBTAECUAEBkAFGWAEB+AG2UAEAxAG+uAICFAIKNAEBUAISzAEDYAIfRAICGAI2uAECJAJPWAEBmAJQwAIDEAJrFAIB8AJ6/AECJAJ7RAEAyAKW1AICmAK5CAEAjAK84AEBFALC9AIDWALHMAEDPALXDAIBoALbAAIB0ALzMAICgAL9sAECvAMaeAIDIAOClAECWAOp7AEDMAO4sAEB8APP1AECPAPd7AECQAQIGAEBSAQVaAECeARCDAEC1ARANAECkAREUAEB/ARV4AAAA"


const axios = require('axios');

const matchPayload = {
    licstr: "",
    Template1: t1,
    Template2: "Rk1SACAyMAAAAAD8AAABLAGQAMUAxQEAAABYJYDNAF5xAECbAI9zAEBDAJwNAEBYAKSQAECwAKbkAEBnALaRAEAlAL+nAEAzAM+uAECAANSKAEBTAOexAICFAOiMAEDsAOrZAEBmAPMoAICFAPSoAEDYAPfQAECHAPjUAIB5AQPAAECHAQTQAEAxAQSzAIDBAQfFAEAiAQszAEBDAQ+7AICjARdCAIBkARvDAIBvAR7JAIDHASLCAECYASNaAEDYASTKAECoATGXAEDQAUSzAIDGAUalAECOAVF4AEByAVbuAEDFAVgoAECHAV51AECHAWgAAEB4AXpzAAAA",
    Templateformat: "ISO"
};

const fingerServer = "https://192.168.0.113:8443"; // Your server URL
const matchPath = "/SGIMatchScore"; // Your match endpoint
const headers = {
    "Content-Type": "application/json" // Adjust headers as needed
};

axios.post(`${fingerServer}${matchPath}`, matchPayload, {
    headers: headers,
    httpsAgent: new (require('https').Agent)({  
        rejectUnauthorized: false // This disables SSL verification
    })
})
.then(response => {
    console.log('Success:', response.data);
})
.catch(error => {
    console.error('Error:', error);
});