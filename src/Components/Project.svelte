<!-- ProjectsSection.svelte -->

<script>

    let projects = [
      {
        imgSrc: "assets/img/project1.jpg",
        title: "Website Design for EGSPJ International School",
        category: "Web Design",
        description: "Crafting visually stunning and user-friendly website design for EGSPJ International School.",
        project_link :"https://egspschools.com/"
    },
      {
        imgSrc: "assets/img/project2.jpg",
        title: "Website Design for Adhitya Builders",
        category: "Web Design",
        description: "Crafting captivating online experiences for Adhitya Builders, Nagapattinams leading construction company, by me.",
        project_link :"https://adhityabuilders.netlify.app/"
    },
      {
        imgSrc: "assets/img/project3.jpg",
        title: "Website Design for Waggy Tails Pet Care Clinic",
        category: "Web Design",
        description: "Crafting an intuitive and appealing website design for Waggy Tails Pet Care Clinic to enhance user experience and showcase their exceptional pet care services.",
        project_link :"https://waggytailspetclinic.com/"
    },
      {
        imgSrc: "assets/img/project5.jpg",
        title: "Website Design for Vanshavali Foundation",
        category: "Web Design",
        description: "I created a visually captivating and user-friendly website design for Vanshavali Foundation.",
        project_link :"https://vanshavalifoundations.com/"
    }
    ];
  </script>
  
  <section data-scroll-index="3" class="section work-section bg-gray">
    <div class="container">
      <div class="row section-heading justify-content-center">
        <div class="col-lg-6 text-center">
          <h3><span>Latest Projects</span></h3>
        </div>
      </div>
      <div class="lightbox-gallery portfolio-box">
        {#each projects as project, index}
          <div class="row gx-3 pb-3 mb-5 pb-lg-3 mb-lg-3 gy-4 portfolio-box justify-content-around align-items-center"  key={index}>
            <div class="col-md-6 col-lg-5">
              <div class="portfolio-img">
                <img src={project.imgSrc} title="" alt="">
                <a href={project.imgSrc} class="gallery-link gallery-link-icon">
                  <i class="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
            <div class="col-md-6 col-lg-5">
              <div class="portfolio-text">
                <h6><span>{project.category}</span></h6>
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <div class="btn-bar">
                  <a class="px-btn px-btn-theme" target="_blank" href={project.project_link}>View Project</a>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  