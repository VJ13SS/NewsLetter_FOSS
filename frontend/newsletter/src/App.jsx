import { useState } from "react";
import "./app.css";
import emailjs from '@emailjs/browser';  // Import the EmailJS library

export default function App() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');  // For status messages

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const sentMail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");  // Reset status message before submitting

    // Sending email using EmailJS
    emailjs.send(
      "service_y5k1dek",  // Your service ID
      "template_x4y24z2",  // Your template ID
      { email: email },  // Email template data
      "2srNbRzVtV1tOYDda"  // Your user ID
    )
    .then(
      (response) => {
        setEmail('');  // Clear the email input after successful submission
        setStatusMessage("Thanks for subscribing! A confirmation email has been sent.");
        setIsSubmitting(false);
      },
      (error) => {
        setStatusMessage("Oops! Something went wrong. Please try again.");
        console.error(error);  // Log the error for debugging
        setIsSubmitting(false);
      }
    );
  };

  const subscribe = async (e) => {
    e.preventDefault();  // Fix: Pass the event object

    setIsSubmitting(true);
    const url = 'http://localhost:3000/sent-mail';

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverMail: email }),  // Correct structure: send as an object with receiverMail key
      });

      if (!response.ok) {
        alert('Request Failed...Try after some time');
        return;
      }

      alert('Thankyou for reaching to us.Check your inbox for the details.');
    } catch (error) {
      setStatusMessage('Error Occurred... Try Again Later');
      console.error(error);
    } finally {
      setEmail('');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <div className="newsletter">
        <span>Newsletter</span>
        <h1>Reach to our newsletter</h1>
        <p>
          "Your dose of must-know updates, trends, and insights—straight to your inbox."
        </p>
        <form onSubmit={subscribe}>
          <input
            type="email"  // Email input field
            value={email}
            onChange={handleChange}
            placeholder="Enter your Email"
            required
          />
          <button type="submit" disabled={isSubmitting} style={{ pointerEvents: isSubmitting ? 'none' : '' }}>
            {isSubmitting ? 'Submitting...' : 'Reach us'}
          </button>
        </form>
      </div>
    </div>
  );
}
