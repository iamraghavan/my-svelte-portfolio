<script>
    import Contact from "./Components/Contact.svelte";
    import Cta from "./Components/Cta.svelte";
    import Header from "./Components/Header.svelte";
    import Home from "./Components/Home.svelte";
    import Project from "./Components/Project.svelte";
    import Raghavan from "./Components/Raghavan.svelte";
    import Services from "./Components/Services.svelte";
    import Skills from "./Components/Skills.svelte";
    import Footer from "./Components/Footer.svelte";
 

    let name = "Raghavan";

  

</script>

<div>
    <Header/>
    <main class="wrapper">

        
        <Home name={name}/>
        <Raghavan name={name}/>
        <Services />
        <Skills />

        <Cta/>
        <Project/>
        <Contact/>
    </main>
    <Footer/>
</div>

