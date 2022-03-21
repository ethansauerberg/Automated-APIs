<div id="top"></div>

<br />
<div align="center">

<h3 align="center">Automated APIs</h3>

  <p align="center">
    Unlimited, free (Node.js/Express.js/MongoDB) REST API's with custom user-defined types.
    <br><br>
    I recently finished the software for this project! GUI and full usage guide coming soon on my personal website!
  
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![AutoAPI](https://github.com/ethansauerberg/Automated-APIs) -->


### Built With

* [MongoDB]
* [NodeJS]
* [ExpressJS]

<!-- <p align="right">(<a href="#top">back to top</a>)</p> -->

<!-- GETTING STARTED -->
## Getting Started

If you want to use this before I finish and release a GUI, start by cloning the repo. You'll then need to fill in configs.json with appropriate data. The majority should be obvious, but you'll need to have a MongoDB Cloud database (free teirs available <a href="https://www.mongodb.com/pricing"> here</a>) that is set up with a user able to edit the database (mongoUser/mongoPass) and network access for wherever you wish to run your server. The part that might be confusing about configs.json is the objects array. This is an array of the objects you want to be able to store in your database. See configsTest.json for an example. Finally, running python buildTheApi.py will build the API code in /newAPICode. cd into newAPICode, run npm install, and then node server.js should get you up and running!


<!-- USAGE EXAMPLES -->
## Usage

Sample uses could include a calendar application, a music saving site, and much more!

<!-- <p align="right">(<a href="#top">back to top</a>)</p> -->

<!-- LICENSE -->
## License

To be honest, I know almost nothing about licenses. I have little interest in selling this code. Feel free to use it as you wish (provided it is in good faith), but I am not responsible for any use or misuse of it that leads to unintended effects. I would strongly reccommend adding more advanced security (OAuth for example) than I have provided, as sending passwords in plaintext tends to be an extremely vulnerable security scheme. 

<!-- <p align="right">(<a href="#top">back to top</a>)</p> -->





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
