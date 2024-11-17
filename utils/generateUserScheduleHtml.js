const generateUserScheduleHtml = (day1, day2, day3, day4, day5) => `<div class="container" style="max-width: 1200px; margin: 2rem auto; padding: 1rem;">
  <div class="flex flex-col" style="font-weight: bold; display: flex; justify-content: center; align-items: center; gap: 0.5rem;">
    <h1 style="font-size: 1.5rem;">LUCAS - TVS TRAINING CENTRE, TVK, PONDICHERRY</h1>
    <h3 style="font-size: 1.25rem; font-weight: 600; text-align: center; text-transform: uppercase;">INDUCTION SCHEDULE FOR TRAINEES</h3>
    <h5 style="font-weight: 600; margin-bottom: 1rem; text-align: center; text-transform: uppercase;">Syllabus I</h5>
  </div>
  <table style="width: 100%; background-color: white; border: 2px solid black;">
    <thead>
      <tr style="background-color: #E5E5E5;">
        <th style="padding: 0.5rem; border: 2px solid black;">S.NO</th>
        <th style="padding: 0.5rem; border: 2px solid black;">Subject</th>
        <th style="padding: 0.5rem; border: 2px solid black;">Faculty</th>
        <th style="padding: 0.5rem; border: 2px solid black;">Date</th>
        <th style="padding: 0.5rem; border: 2px solid black;">Time</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">1</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">HR Joining Formalities, Corporate Responsibility Policies</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">Understanding of PF, ESI, Salary Structure, CCA, allotment.</p>
            <p style="border-top: 2px solid black;">Understanding of Time Office - Function, Leave Policy, Final Settlement System.</p>
            <p style="border-top: 2px solid black;">Understanding of welfare system (ID Card, Safety Shoes, Uniform, Snacks coupon/barcode).</p>
            <p style="border-top: 2px solid black;">HR Discipline Adherence of Proper - Tucking, Uniform, Shoes, Dress code, etc.</p>
            <p style="border-top: 2px solid black;">Understanding of HR Canteen - Function &amp; Discipline.</p>
            <p style="border-top: 2px solid black;">Understanding of HR Medical Function &amp; Medical formalities.</p>
            <p style="border-top: 2px solid black;">Basic Awareness on First Aid, Health and hygienic Related Training.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">HR Head, Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day1}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">08:30 am to 12:30 pm</td>
      </tr>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">2</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">Induction scheduled for new trainees</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">About company, TVK culture &amp; Understanding of HR Training Function.</p>
            <p style="border-top: 2px solid black;">Awareness on SOP &amp; Covid-19 SOP.</p>
            <p style="border-top: 2px solid black;">Awareness on Basic Discipline (Time management, communication, team work).</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">HR Training Incharge &amp; Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day1}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">01:00 pm to 05:00 pm</td>
      </tr>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">3</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">HR Security Discipline, Emergency Points &amp; Contact Number</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">Fire Safety theory and practical training/precautions.</p>
            <p style="border-top: 2px solid black;">Dos and Don'ts During Mock Drill, Emergency Situation.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">HR Security Officers &amp; Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day2}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">08:30 am to 09:30 am</td>
      </tr>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">4</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">Quality Function/Activities</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">Understanding of Quality Policy/Management System.</p>
            <p style="border-top: 2px solid black;">Understanding of Control Plan, SOP, Process &amp; Product Knowledge.</p>
            <p style="border-top: 2px solid black;">Understanding of NG Parts/Abnormalities &amp; Fallen Parts Handling.</p>
            <p style="border-top: 2px solid black;">Understanding of Poka Yoke, First Off/Last Off Verification/Concepts.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">Quality Head &amp; Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day2}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">09:30 am to 11:30 am</td>
      </tr>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">5</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">CSR Customer Specific Requirements</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">Instruments Handling - Basic Level, Understanding of Attribute vs. Variable Instruments.</p>
            <p style="border-top: 2px solid black;">Understanding of Calibration &amp; Due Date updation procedure of instruments.</p>
            <p style="border-top: 2px solid black;">Understanding of procedure: instruments Replacement in case of damage/Drop Gauge of its on shop floor.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">Standards Room Head &amp; Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day2}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">11:30 am to 12:30 pm</td>
      </tr>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">6</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">Basic Industrial Safety &amp; PPE's Training, MSDS</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">SHE/ESG Policy/Awareness.</p>
            <p style="border-top: 2px solid black;">Understanding of breakdown raising procedure &amp; WED Function.</p>
            <p style="border-top: 2px solid black;">Machine Safety/OCP/Work Place Safety, Electrical safety.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">Safety Head &amp; Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day2}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">01:00 pm to 02:00 pm</td>
      </tr>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">7</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">Methods Function, Tool Handling &amp; Changeover</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">Understanding of Methods Function, Handling of Tool Related/Process Related - Safety &amp; Quality Training.</p>
            <p style="border-top: 2px solid black;">Understanding of tools, JIGS, &amp; fixture, Tool life monitoring.</p>
            <p style="border-top: 2px solid black;">Understanding of setting changeover and procedure.</p>
            <p style="border-top: 2px solid black;">Understanding of tool related losses &amp; recording in log book.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">Methods Head &amp; Tool Head</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day2}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">03:00 pm to 04:00 pm</td>
      </tr>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">8</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">Review of Knowledge through Examination</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">Review the knowledge through the examination.</p>
            <p style="border-top: 2px solid black;">Evaluation Status updation.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">HR-Training Incharge &amp; Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day2}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">04:00 pm to 05:00 pm</td>
      </tr>
    </tbody>
  </table>
  <p style="width: 100%; border-bottom: 2px solid black; display: flex; align-items: center; justify-content: center;">SKILL LEVEL2 PRACTICAL</p>
  <table style="width: 100%; background-color: white; border: 2px solid black;">
    <thead>
      <tr style="background-color: #E5E5E5;">
        <th style="padding: 0.5rem; border: 2px solid black;">S.NO</th>
        <th style="padding: 0.5rem; border: 2px solid black;">Subject</th>
        <th style="padding: 0.5rem; border: 2px solid black;">Faculty</th>
        <th style="padding: 0.5rem; border: 2px solid black;">Date</th>
        <th style="padding: 0.5rem; border: 2px solid black;">Time</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">1</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">Skill Level-2 Practical / On the Job Training</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">Dexterity Training - Memory Exercises - Switch &amp; Wiper.</p>
            <p style="border-top: 2px solid black;">Dexterity Training - Segregation of color ball.</p>
            <p style="border-top: 2px solid black;">Dexterity Training - Assemble &amp; Disassemble.</p>
            <p style="border-top: 2px solid black;">Understanding of Cycle Time Achievement Exercises - Eye &amp; Two Hand Coordination Exercises.</p>
            <p style="border-top: 2px solid black;">Understanding of Assembly Sequences &amp; Orientation.</p>
            <p style="border-top: 2px solid black;">Understanding of Wiper Motors &amp; Switch Working Principles through videos.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">HR-Training Incharge/HR Line Captain &amp; Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day3}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">08:30 am to 12:30 pm</td>
      </tr>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">2</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">Practical Training on PDI Station &amp; Safety</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">Understanding of PDI Station in wiper &amp; switch.</p>
            <p style="border-top: 2px solid black;">Understanding of Exploded view - Switch &amp; wiper.</p>
            <p style="border-top: 2px solid black;">Understanding of Assembly Sequence &amp; Process Flow in Switch &amp; Wiper.</p>
            <p style="border-top: 2px solid black;">Practical Training on Poison case test / Defects Identification.</p>
            <p style="border-top: 2px solid black;">Practical Training on Instruments &amp; Gauges - Basic Level.</p>
            <p style="border-top: 2px solid black;">Practical Training on PPEs.</p>
            <p style="border-top: 2px solid black;">Understanding of Fire Safety - Exploded View.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">HR-Training Incharge/HR Line Captain &amp; Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day4}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">01:00 pm to 05:30 pm</td>
      </tr>
      <tr style="border: 2px solid black;">
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">3</td>
        <td style="padding: 0.5rem; border: 2px solid black;">
          <p style="font-weight: 600;">Production Function Activities &amp; Safety</p>
          <div style="margin-top: 0.5rem; color: #4A4A4A;">
            <p style="border-top: 2px solid black;">Understanding of Production - Function/Activities.</p>
            <p style="border-top: 2px solid black;">Practical Training on Control Plan, SOP, JI Training.</p>
            <p style="border-top: 2px solid black;">Practical Training: production related documents updation (log book, 4m updation sheet, producer maintenance check sheet, process audit check sheet, hourly output monitoring sheet, Setting Change over check sheet).</p>
            <p style="border-top: 2px solid black;">Practical Training on Quality - First Off/Last Off, Poka-Yoke Verification/Updation, NG Parts Handling, Identification &amp; Traceability.</p>
            <p style="border-top: 2px solid black;">Practical Training on Dock Audit, Tags Identification/Systems.</p>
            <p style="border-top: 2px solid black;">Practical Training on Safety Checking &amp; 5S cleaning procedures.</p>
            <p style="border-top: 2px solid black;">Review the Skill &amp; knowledge through the examination.</p>
            <p style="border-top: 2px solid black;">Evaluation Status updation.</p>
          </div>
        </td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">Production Head / Supervisors / Quality Team &amp; Team Members</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">${day5}</td>
        <td style="padding: 0.5rem; border: 2px solid black; text-align: center;">24 Hrs / 3 Mandays</td>
      </tr>
    </tbody>
  </table>
</div>`

module.exports = {generateUserScheduleHtml}