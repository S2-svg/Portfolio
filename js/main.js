// Mobile Navigation Toggle
document.querySelector(".hamburger").addEventListener("click", function () {
  document.querySelector(".nav-links").classList.toggle("active");
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });

      // Close mobile menu if open
      document.querySelector(".nav-links").classList.remove("active");
    }
  });
});

// Add scroll effect to header
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
  }
});

// Add fade-in animation to elements when they come into view
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
    }
  });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});

// Contact form submission
document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = this;
  const submitBtn = form.querySelector(".submit-btn");
  const originalBtnText = submitBtn.textContent;

  // Get form data
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // --- CONFIGURATION ---
  // 1. Telegram Config (Replace with your own credentials)
  const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";
  const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID_HERE";

  // 2. Formspree Config (Replace with your Formspree ID or Email)
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORMSPREE_ID_HERE";
  // ---------------------

  // UI State: Loading
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    // 1. Send to Telegram
    const telegramMessage = `
🚀 *New Portfolio Message*
👤 *Name:* ${name}
📧 *Email:* ${email}
📌 *Subject:* ${subject}
💬 *Message:* ${message}
    `;

    const telegramPromise = fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: "Markdown",
      }),
    });

    // 2. Send to Formspree (Email)
    const formspreePromise = fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: subject,
        message: message,
      }),
    });

    // Wait for both to finish (or at least attempt)
    await Promise.all([telegramPromise, formspreePromise]);

    alert("Thank you! Your message has been sent to my Email and Telegram.");
    form.reset();
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Oops! There was a problem sending your message. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});
