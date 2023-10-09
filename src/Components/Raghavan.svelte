
<script>

    let aboutMessage = 'Raghavan, a tech enthusiast and entrepreneur, possesses an exceptional work ethic and a keen eye for spotting opportunities even in challenging situations. His unique blend of tech expertise, creative flair, and a dash of fun makes him a formidable presence in any industry. Connect with Raghavan to experience this exciting mix firsthand.';
    let aboutImage = {
        logo_src : './assets/img/aboutme-banner1.png',
        logo_title : 'About Raghavan',
        logo_alt : 'Raghavan About Img'
        
    }
    
</script>


<section class="section about-section">
    <div class="container">
        <div class="row gy-5 align-items-center">
            <div class="col-lg-6 text-center">
                <img src={aboutImage.logo_src} title={aboutImage.logo_title} alt={aboutImage.logo_alt}>
            </div>
            <div class="col-lg-6 ps-lg-5">
                <div class="about-text">
                    <h3 class="h1">I'm a Entrepreneur & Business Strategist with over 4 years of experience.</h3>
                    <p>{aboutMessage}</p>
                    <div class="row pt-2">
                        <div class="col-6 col-md-4">
                            <h5>35+</h5>
                            <span>Projet Completed</span>
                        </div>
                        <div class="col-6 col-md-4">
                            <h5>40+</h5>
                            <span>Happy Clients</span>
                        </div>
                    </div>
                    <div class="btn-bar pt-4">
                        <a class="px-btn px-btn-theme me-4" href="#contactus">Contact Me</a>
                        <a class="px-btn px-btn-dark" href="#work">Portfolio</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>