
<script>
    import { onMount } from "svelte";
    import { initializeApp } from "firebase/app";
    import { getDatabase, ref, push } from "firebase/database";
    import emailjs from "emailjs-com"; // Import the Email.js library
    import Swal from 'sweetalert2';
  
    let name = "";
    let email = "";
    let phone = "";
    let selectedService = "";
    let subject = "";
    let message = "";
  
    onMount(() => {
      // Load reCAPTCHA widget script
      const recaptchaScript = document.createElement("script");
      recaptchaScript.src = "https://www.google.com/recaptcha/api.js";
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.head.appendChild(recaptchaScript);
    });
  
    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent the default form submission
  
      // Verify reCAPTCHA
      const recaptchaResponse = grecaptcha.getResponse();
  
      if (!recaptchaResponse) {
        // Show an error message to the user if reCAPTCHA is not verified
        Swal.fire({
          icon: 'error',
          title: 'reCAPTCHA Verification Failed',
          text: 'Please complete the reCAPTCHA verification to submit the form.',
          timer: 6000,
          showConfirmButton: true,
        });
        return; // Exit the function if reCAPTCHA is not verified
      }
  
      // Proceed with form submission
  
      // Firebase configuration (replace with your own config)
      const firebaseConfig = {
        apiKey: "AIzaSyDVVWLah77CZOVjBqBweWbuPJpnhrHVg_Y",
  authDomain: "portfolio-4bf1c.firebaseapp.com",
  databaseURL: "https://portfolio-4bf1c-default-rtdb.firebaseio.com",
  projectId: "portfolio-4bf1c",
  storageBucket: "portfolio-4bf1c.appspot.com",
  messagingSenderId: "296534124626",
  appId: "1:296534124626:web:133b828c2ecffa7d4f978b",
  measurementId: "G-EQ2J4C5ZGP"
      };
  
      // Initialize Firebase
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getDatabase(firebaseApp);
      const dbRef = ref(db, "contactForms");
  
      const formData = {
        name,
        email,
        phone,
        selectedService,
        subject,
        message,
        timestamp: new Date().toString(),
      };
  
      try {
        await push(dbRef, formData);
  
        // Send an email using Email.js
        const emailData = {
          name,
          email,
          phone,
          selectedService,
          subject,
          message,
        };
  
        const emailResponse = await emailjs.send(
          "service_myfc0dj",
          "template_v8hsakk",
          emailData,
          "pJwMrOQHE7viiRAtn"
        );
  
        console.log("Email sent successfully:", emailResponse);
  
        Swal.fire({
          icon: 'success',
          title: 'Message Sent successfully!',
          text: `Your message to Raghavan has been sent successfully, ${name}!`,
          timer: 5000,
          showConfirmButton: true,
        });
  
        // Clear the form fields after submission
        name = "";
        email = "";
        phone = "";
        selectedService = "";
        subject = "";
        message = "";
      } catch (error) {
        console.error("Error sending message:", error);
        Swal.fire({
          icon: 'error',
          title: `${name} Oops! Something went wrong`,
          text: `Please reach out to Raghavan at +91 99425 02245 for a helping hand! 😊`,
          timer: 6000,
          showConfirmButton: true,
        });
      }
    };


    export const bot_email1 = "sayhello" + String.fromCharCode(64) + "jsraghavan.me";
    export const bot_email2 = "raghavanofficials" + String.fromCharCode(64) + "gmail.com";
    

    let phoneds = "tel:+919942502245";
    let emailds = `mailto:${bot_email1}?cc=${bot_email2}&bcc=contact.archanaraghvan@gmail.com&subject=Hi%20!%20%7C%20Enquire%20Mail%20Form%20Raghvan%20Portfolio%20Website`;
    let addressds = "183/2 Dhermer Street Collector Office Post, Nagapattinam - Tamil nadu";
  

  </script>


  
  <section data-scroll-index="4" id="contactus" class="section contactus-section bg-dark" style="background-image: url(assets/img/effect/bg-effect-3.png); background-repeat: no-repeat; background-size: cover; background-position: center;">
    <div class="container">
      <div class="row gy-5">
        <div class="col-lg-6">
          <div class="contact-form">
            <h6>Get in touch</h6>
            <p class="lead">Our friendly team would love to hear from you.</p>
            <form on:submit={handleSubmit}>
              <div class="row gx-3 gy-4">
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="name">Name</label>
                    <input bind:value={name} placeholder="Name *" class="form-control" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="email">Email</label>
                    <input bind:value={email} placeholder="Email *" inputmode="email" class="form-control" type="email" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="phone">Phone Number</label>
                    <input bind:value={phone} placeholder="Phone Number *" class="form-control" type="tel" inputmode="numeric" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label class="form-label" for="service">Select Service</label>
                    <select bind:value={selectedService} class="form-control" id="service" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                      <option value="">--Please choose Services--</option>
                      <option value="Website Development">Website Development</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                    </select>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <label class="form-label" for="subject">Subject</label>
                    <input bind:value={subject} placeholder="Subject *" class="form-control" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="form-group">
                    <label class="form-label" for="message">Message</label>
                    <textarea bind:value={message} placeholder="Your message *" rows="4" class="form-control" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
                  </div>
                </div>
                <div class="g-recaptcha" data-sitekey="6LffvikiAAAAAM0YMePlJ5Opyckwh-VvGCQQ24eM"></div>
                <div class="col-md-12">
                  <div class="send">
                    <button class="px-btn px-btn-theme2" type="submit">Send Message</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="col-lg-5 ms-auto col-xl-4">
          <div class="pb-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15676.776020866566!2d79.8326072!3d10.7964483!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a556c64ffffffff%3A0xb5436ef14c8555d3!2sBUMBLE%20BEES!5e0!3m2!1sen!2sin!4v1696772629044!5m2!1sen!2sin"
              width="350"
              height="400"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Bumble Bees Location on Google Maps"
            ></iframe>
          </div>
          <ul class="contact-infos">
            <li>
              <div class="icon bg-1">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="col">
                <h5>Phone</h5>
                <p><a href={phoneds}>+91 99425 02245</a></p>
              </div>
            </li>
            <li>
              <div class="icon bg-2">
                <i class="fas fa-phone-alt"></i>
              </div>
              <div class="col">
                <h5>Mail</h5>
                <p><a href={emailds}>{bot_email1}</a></p>
              </div>
            </li>
            <li>
              <div class="icon bg-3">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="col">
                <h5>Visit My Office</h5>
                <p>{addressds}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  