
<script>
    let greetings = "Hello 👋 I'am"
    export let name;


    let welcomeImage = {
        logo_src : './assets/img/Hello-rafiki.svg',
        logo_title : 'Welcome Home',
        logo_alt : 'Raghavan Welcome Home'
        
    }




</script>

<section data-scroll-index="0" class="home-section bg-gray">
    <div class="container">
        <div class="row gy-5 align-items-center">
            <div class="col-lg-6">
                <div class="home-intro one-page-nav text-center text-lg-start">
                    <!-- <h6>👋, My name is Krinky</h6> -->
                    

                    <h1>{greetings} <span>{name}</span></h1>
                    <p>Unlocking Innovation and Fun in the Tech World with {name}</p>
                    <div class="btn-bar">
                        <a class="px-btn px-btn-theme" href="/">Let's Start</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 pt-4 pt-lg-0">
                <div class="home-image text-center">
                    <img src={welcomeImage.logo_src} title={welcomeImage.logo_title} alt={welcomeImage.logo_alt}>
                </div>
            </div>
        </div>
    </div>
</section>