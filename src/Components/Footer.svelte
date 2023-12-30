<script>
    let currentYear = new Date().getFullYear();
  
    let socialMediaLinks = [
      { name: 'Facebook', iconClass: 'fab fa-facebook-f', link: 'https://www.facebook.com/iamragahvan' },
      { name: 'Twitter', iconClass: 'fab fa-twitter', link: 'https://twitter.com/iraghavan_ceo' },
      { name: 'Instagram', iconClass: 'fab fa-instagram', link: 'https://www.instagram.com/iam.raghavan/' },
      { name: 'LinkedIn', iconClass: 'fab fa-linkedin-in', link: 'https://www.linkedin.com/in/jsraghavan/' },
      { name: 'Github', iconClass: 'fab fa-github', link: 'https://github.com/iamraghavan' },
    ];

   

  </script>
  
  <footer class="footer">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 py-2">
          <div class="nav justify-content-center justify-content-md-start">
            {#each socialMediaLinks as link}
              <a href={link.link}><i class={link.iconClass}></i></a>
            {/each}
          </div>
        </div>
        <div class="col-md-6 py-2 text-center text-md-end">
          <p class="m-0"> 2020 - {currentYear} <span style="font-size: 1.4rem;">&copy;</span> Copyright - All Right Reserved</p>
        </div>
      </div>
    </div>
  </footer>
  