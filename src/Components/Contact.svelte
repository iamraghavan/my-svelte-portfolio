<script>

import { onMount } from "svelte";
  import { initializeApp } from "firebase/app";
  import { getDatabase, ref, push } from "firebase/database";
  import emailjs from "emailjs-com"; // Import the Email.js library

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

  let name = "";
  let email = "";
  let phone = "";
  let selectedService = "";
  let subject = "";
  let message = "";

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

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

      alert("Message sent to Raghavan Mail!");

      // Clear the form fields after submission
      name = "";
      email = "";
      phone = "";
      selectedService = "";
      subject = "";
      message = "";
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Message could not be sent. Please try again later.");
    }
  };
  
  
    let phoneds = "tel:+919942502245";
    let emailds = "mailto:sayhello@jsraghavan.me?cc=raghavanofficials@gmail.com&bcc=contact.archanaraghvan@gmail.com&subject=Hi%20!%20%7C%20Enquire%20Mail%20Form%20Raghvan%20Portfolio%20Website";
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
                                    <label class="form-label" for="name">First name</label>
                                      <input bind:value={name} placeholder="Name *" class="form-control" type="text">
                                  </div>
                              </div>
                              <div class="col-md-6">
                                  <div class="form-group">
                                      <label class="form-label" for="email">Your Email</label>
                                      <input bind:value={email} placeholder="Email *" class="form-control" type="email">
                                  </div>
                              </div>
                              <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label" for="phone">Your Phone Number</label>
                                    <input bind:value={phone} placeholder="Phone Number *" class="form-control" type="tel">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label" for="service">Select Service</label>
                                    <select bind:value={selectedService} class="form-control" id="service">
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
                                      <input bind:value={subject} placeholder="Subject *" class="form-control" type="text">
                                  </div>
                              </div>
                              <div class="col-md-12">
                                  <div class="form-group">
                                      <label class="form-label" for="message">Your message</label>
                                      <textarea bind:value={message} placeholder="Your message *" rows="4" class="form-control"></textarea>
                                  </div>
                              </div>
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
                    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15676.776020866566!2d79.8326072!3d10.7964483!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a556c64ffffffff%3A0xb5436ef14c8555d3!2sBUMBLE%20BEES!5e0!3m2!1sen!2sin!4v1696772629044!5m2!1sen!2sin" width="350" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
                              <p> <a href={emailds}>sayhello@jsraghavan.me</a></p>
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
  
  <style>
    /* Add any custom styles specific to this component */
  </style>
  