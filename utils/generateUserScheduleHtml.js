const generateUserScheduleHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Training Schedule</title>
  <style>
    /* Container styling */
    .container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      font-weight: bold;
    }
    .header h1 {
      font-size: 24px;
    }
    .header h3, .header h5 {
      font-size: 18px;
      margin-top: 8px;
      text-transform: uppercase;
    }
    /* Table styling */
    table {
      width: 100%;
      background-color: white;
      border-collapse: collapse;
      border: 2px solid black;
      margin-top: 20px;
    }
    th, td {
      padding: 8px;
      border: 2px solid black;
      text-align: center;
    }
    th {
      background-color: #e5e5e5;
    }
    .topic-list {
      text-align: left;
      margin-top: 8px;
    }
    .topic-list p {
      border-top: 2px solid black;
      padding: 4px 0;
      margin: 0;
    }
    .footer {
      padding: 10px;
      border: 2px solid black;
      text-align: center;
      margin-top: 20px;
      font-weight: bold;
    }
  </style>
</head>
<body>

<div class="container">
  <div class="header">
    <h1>LUCAS - TVS TRAINING CENTRE, TVK, PONDICHERRY</h1>
    <h3>INDUCTION SCHEDULE FOR TRAINEES</h3>
    <h5>Syllabus I</h5>
  </div>

  <table id="scheduleTable">
    <thead>
      <tr>
        <th>S.NO</th>
        <th>Subject</th>
        <th>Faculty</th>
        <th>Date</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody id="scheduleTableBody"></tbody>
  </table>

  <div class="footer">SKILL LEVEL2 PRACTICAL</div>

  <table id="skillLevel2Table">
    <thead>
      <tr>
        <th>S.NO</th>
        <th>Subject</th>
        <th>Faculty</th>
        <th>Date</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody id="skillLevel2TableBody"></tbody>
  </table>
</div>

<script>
  // Function to generate dates excluding Sundays
  function generateDatesExcludingSundays(count) {
    const dates = [];
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    while (dates.length < count) {
      if (today.getDay() !== 0) {
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = String(today.getFullYear()).slice(2);
        dates.push(${day}-${month}-${year});
      }
      today.setDate(today.getDate() + 1);
    }
    return dates;
  }

  // Populate the training schedule tables
  const dates = generateDatesExcludingSundays(10);
  const scheduleData = [
    { id: 1, subject: "HR Joining Formalities, Corporate Responsibility Policies", faculty: "HR Head, Team Members", date: dates[0], time: "08:30 am to 12:30 pm", topics: ["Understanding of PF, ESI, Salary Structure, CCA, allotment.", "Understanding of Time Office - Function, Leave Policy, Final Settlement System.", "Understanding of welfare system (ID Card, Safety Shoes, Uniform, Snacks coupon/barcode).", "HR Discipline Adherence of Proper - Tucking, Uniform, Shoes, Dress code, etc.", "Understanding of HR Canteen - Function & Discipline.", "Understanding of HR Medical Function & Medical formalities.", "Basic Awareness on First Aid, Health and hygienic Related Training."] },
    { id: 2, subject: "Induction scheduled for new trainees", faculty: "HR Training Incharge & Team Members", date: dates[0], time: "01:00 pm to 05:00 pm", topics: ["About company, TVK culture & Understanding of HR Training Function.", "Awareness on SOP & Covid-19 SOP.", "Awareness on Basic Discipline (Time management, communication, team work)."] },
    // Additional rows omitted for brevity
  ];
  const a2 = [
    { id: 9, subject: "Skill Level-2 Practical / On the Job Training", faculty: "HR-Training Incharge/HR Line Captain & Team Members", date: dates[2], time: "08:30 am to 12:30 pm", topics: ["Dexterity Training - Memory Exercises - Switch & Wiper.", "Dexterity Training - Segregation of color ball.", "Dexterity Training - Assemble & Disassemble.", "Understanding of Cycle Time Achievement Exercises - Eye & Two Hand Coordination Exercises.", "Understanding of Assembly Sequences & Orientation.", "Understanding of Wiper Motors & Switch Working Principles through videos."] },
    { id: 10, subject: "Practical Training on PDI Station & Safety", faculty: "HR-Training Incharge/HR Line Captain & Team Members", date: dates[3], time: "01:00 pm to 05:30 pm", topics: ["Understanding of PDI Station in wiper & switch.", "Understanding of Exploded view - Switch & wiper.", "Understanding of Assembly Sequence & Process Flow in Switch & Wiper.", "Practical Training on Poison case test / Defects Identification.", "Practical Training on Instruments & Gauges - Basic Level.", "Practical Training on PPEs.", "Understanding of Fire Safety - Exploded View."] }
  ];

  function populateTable(data, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    data.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = 
        <td>${index + 1}</td>
        <td>
          <p class="font-semibold">${item.subject}</p>
          <div class="topic-list">
            ${item.topics.map(topic => `<p>${topic}</p>`).join('')}
          </div>
        </td>
        <td>${item.faculty}</td>
        <td>${item.date}</td>
        <td>${item.time}</td>
      ;
      tableBody.appendChild(row);
    });
  }

  populateTable(scheduleData, "scheduleTableBody");
  populateTable(a2, "skillLevel2TableBody");
</script>

</body>
</html>

`;

module.exports = {generateUserScheduleHtml};
