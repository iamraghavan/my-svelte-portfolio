<!-- ServicesSection.svelte -->

<script>
    let services = [
      {
        icon: 'bi-globe',
        bgColor: 'bg-1',
        title: 'Web Design',
        description: 'Delivering top-notch web design services that turn ideas into stunning digital experiences.'
      },
      {
        icon: 'bi-brush',
        bgColor: 'bg-2',
        title: 'Graphic Design',
        description: 'Unlocking creativity through captivating visuals, I offer the finest Graphic Design services for your brands visual identity.'
      },
      {
        icon: 'bi-palette2',
        bgColor: 'bg-3',
        title: 'UX / UI Design',
        description: 'Elevate your digital experience with stunning UX/UI designs tailored to your needs.'
      },
      {
        icon: 'bi-graph-up',
        bgColor: 'bg-4',
        title: 'Business Consulting',
        description: 'Unlocking growth and success through my strategic business consulting.'
      },
      
    ];
  </script>
  
  <section data-scroll-index="1" class="section services-section bg-gray" style="background-image: url(assets/img/effect/bg-effect-1.png); background-repeat: no-repeat; background-size: cover;">
      <div class="container">
          <div class="row section-heading justify-content-center">
              <div class="col-lg-6 text-center">
                  <h3><span>My Services</span></h3>
              </div>
          </div>
          <div class="row gy-4">
              {#each services as service, index}
                  <div class="col-md-6" key={index}>
                      <div class="feature-box-01 {service.bgColor}">
                          <div class="icon"><i class="bi {service.icon}"></i></div>
                          <div class="feature-content">
                              <h5>{service.title}</h5>
                              <p>{service.description}</p>
                          </div>
                      </div>
                  </div>
              {/each}
          </div>
      </div>
  </section>
  