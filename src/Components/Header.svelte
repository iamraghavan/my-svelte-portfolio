<script>

    import { Link } from "svelte-routing"; 
    let portfolioLogo = {
        logo_src : './assets/img/logo.svg',
        logo_title : 'Raghavan',
        logo_alt : 'Raghavan Portfolio',
        logo_class : "brand-img"
    }
    let menuData = ['Home', 'Services','Skills','Portfolio','Contact']


</script>



<header class="main-header">
    <nav class="navbar header-nav navbar-expand-lg one-page-nav">
        <div class="container">
            <!-- Brand -->
            <a class="navbar-brand" href="/">
                <img src={portfolioLogo.logo_src} class={portfolioLogo.logo_class} title="" alt="">
            </a>
            <!-- / -->
            <!-- Mobile Toggle -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-collapse-toggle" aria-controls="navbar-collapse-toggle" aria-expanded="false" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <!-- / -->
            <!-- Top Menu -->
            <div class="collapse navbar-collapse justify-content-end" id="navbar-collapse-toggle">
                <ul class="navbar-nav mx-auto">
                    <li><a class="nav-link" data-scroll-nav="0" href="#home"><span>{menuData[0]}</span></a></li>
                    <li><a class="nav-link" data-scroll-nav="1" href="#services"><span>{menuData[1]}</span></a></li>
                    <li><a class="nav-link" data-scroll-nav="2" href="#skill"><span>{menuData[2]}</span></a></li>
                    <li><a class="nav-link" data-scroll-nav="3" href="#work"><span>{menuData[3]}</span></a></li>
                    <li><a class="nav-link" data-scroll-nav="4" href="#contactus">{menuData[4]}<span></span></a></li>
                </ul>
            </div>
            <!-- / -->
            <!-- Top Menu -->
            <div class="ms-auto d-none d-lg-block">
                <div class="powered-by">
                    <a href="https://bumblebees.co.in/">
                        <p class="mb-2 mb-lg-0">Powered by </p>
                        <img src="./assets/img/Bumble Bees.svg" alt="Bumble Bees It Solution">
                    </a></div>
            </div>
            <!-- / -->
        </div><!-- Container -->
    </nav> <!-- Navbar -->
</header>