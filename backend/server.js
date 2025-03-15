const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");


const app = express();

const PORT = 3000;

// Function to fetch information from multiple endpoints and format it
const fetchInformation = async () => {
  const urls = [
    "https://foss-backend-josf.onrender.com/get-internships",
    "https://foss-backend-josf.onrender.com/get-scholarships",
    "https://foss-backend-josf.onrender.com/get-hackathons",
  ];

  const data = {
    internships: [],
    scholarships: [],
    hackathons: [],
  };

  for (let url of urls) {
    try {
      const response = await fetch(url);
      const jsonData = await response.json();

      if (url.includes("internships")) {
        data.internships = jsonData;
      } else if (url.includes("scholarships")) {
        data.scholarships = jsonData;
      } else if (url.includes("hackathons")) {
        data.hackathons = jsonData;
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  }
  return data;
};

// Function to generate a table HTML for each type of data
const generateTableFromJson = (data, title) => {
  if (!data || data.length === 0) return `<p>No data available for ${title}.</p>`;

  let tableHtml = `<h3>${title}</h3><table border="1" cellpadding="5" cellspacing="0">`;
  // Assuming each item in the array has similar fields
  const keys = Object.keys(data[0]);

  // Add table headers
  tableHtml += "<tr>";
  keys.forEach(key => {
    tableHtml += `<th>${key}</th>`;
  });
  tableHtml += "</tr>";

  // Add table rows
  data.forEach(item => {
    tableHtml += "<tr>";
    keys.forEach(key => {
      tableHtml += `<td>${item[key]}</td>`;
    });
    tableHtml += "</tr>";
  });

  tableHtml += "</table>";
  return tableHtml;
};

// Function to send the email
const sentEmail = async (receiver) => {
  const data = await fetchInformation(); // Fetch the data from APIs

  // Build the email body with formatted tables for internships, scholarships, and hackathons
  let emailBody = "<h2>Weekly Update</h2>";

  emailBody += generateTableFromJson(data.internships, "Internships");
  emailBody += generateTableFromJson(data.scholarships, "Scholarships");
  emailBody += generateTableFromJson(data.hackathons, "Hackathons");

  // Create a transporter to send email
  let transporter = nodemailer.createTransport({
    service: "gmail", // You can replace this with another service (e.g., 'outlook', 'yahoo', etc.)
    auth: {
      user: "simhathinevtlvalathunnanjn@gmail.com", // Your email address
      pass: "jmxgtosodlljnqyg", // Your email password or app password (for Gmail with 2FA enabled)
    },
  });

  let mailOptions = {
    from: "simhathinevtlvalathunnanjn@gmail.com", // Sender's address
    to: receiver, // Receiver's address
    subject: "Weekly Newsletter: Internships, Scholarships, and Hackathons", // Subject line
    text: "Please check the HTML content for updates on internships, scholarships, and hackathons.", // Plain text body
    html: emailBody, // HTML body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

// Middleware to handle CORS and parse JSON
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Change to POST to handle the request body
app.post("/sent-mail", (req, res) => {
  const { receiverMail } = req.body; // Extract receiverMail from the request body

  if (!receiverMail) {
    return res.status(400).json({ error: "Receiver email is required" });
  }

  sentEmail(receiverMail) // Call the function to send the email
    .then(() => {
      res.status(200).json({ message: "Email sent successfully!" });
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending the email." });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
