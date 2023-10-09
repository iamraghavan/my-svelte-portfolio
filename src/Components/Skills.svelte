<!-- SkillsSection.svelte -->

<script>
    let skills = [
      { iconClass: 'fab fa-html5', bgColor: 'bg-1', skillName: 'HTML' },
      { iconClass: 'fab fa-css3', bgColor: 'bg-2', skillName: 'CSS' },
      { iconClass: 'fab fa-js', bgColor: 'bg-3', skillName: 'Javascript' },
      { iconClass: 'fab fa-figma', bgColor: 'bg-4', skillName: 'Figma' },
      { iconClass: 'bi bi-palette', bgColor: 'bg-5', skillName: 'Adobe Photoshop / illustrator ' },
      { iconClass: 'fab fa-aws', bgColor: 'bg-6', skillName: 'AWS' },
    ];


    let skillImg = {
        logo_src : './assets/img/Programming-cuate.svg',
        logo_title : 'My Skills Raghavan',
        logo_alt : 'Raghavan Skills'
        
    }
  </script>
  
  <section data-scroll-index="2" class="section experience-section pb-0">
      <div class="container">
          <div class="row gy-5">
              <div class="col-lg-6">
                  <div class="section-heading">
                      <h3 class="m-0"><span>My Skills</span></h3>
                  </div>
                  <div class="skill-box">
                      <div class="row g-3">
                          {#each skills as skill, index}
                              <div class="col-6 col-md-4 col-lg-6" key={index}>
                                  <div class="feature-box-02 {skill.bgColor}">
                                      <div class="icon">
                                          <i class="{skill.iconClass}"></i>
                                      </div>
                                      <h6>{skill.skillName}</h6>
                                  </div>
                              </div>
                          {/each}
                      </div>
                  </div>
              </div>
              <div class="col-lg-6 text-center">
                  <img src={skillImg["logo_src"]} title={skillImg["logo_title"]} alt={skillImg["logo_alt"]}>
              </div>
          </div>
      </div>
  </section>
  