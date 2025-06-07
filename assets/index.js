// Burger Menu Toggle
const burger = document.querySelector(".burger");
const navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("nav-active");
  burger.classList.toggle("toggle");
});

// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
    if (navLinks.classList.contains("nav-active")) {
      navLinks.classList.remove("nav-active");
      burger.classList.remove("toggle");
    }
  });
});

// Contact Form Submission
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const formMessageSuccess = contactForm.querySelector("#form-message-success");
  const formMessageError = contactForm.querySelector("#form-message-error");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Hide messages on new submission
    formMessageSuccess.style.display = "none";
    formMessageSuccess.textContent = "";
    formMessageError.style.display = "none";
    formMessageError.textContent = "";

    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch("https://api.code-commerce.fr/v1/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        formMessageSuccess.textContent = "Message envoyé avec succès !";
        formMessageSuccess.style.display = "block";
        this.reset();
      } else {
        let errorResult = { message: "Une erreur inconnue s'est produite." };
        try {
          errorResult = await response.json();
        } catch (parseError) {
          // If parsing fails, use the generic error message
        }
        formMessageError.textContent = errorResult.message || "Erreur lors de l'envoi du message.";
        formMessageError.style.display = "block";
      }
    } catch (error) {
      formMessageError.textContent = "Erreur réseau. Veuillez réessayer.";
      formMessageError.style.display = "block";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}
