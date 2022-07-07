import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.scss';

function App() {
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [projects, setProjects] = useState([]);
  
  
  useEffect(() => {
    axios
    .get('http://localhost:1337/api/home?populate=*')
    .then(({ data }) => setContent(data.data.attributes))
    .catch((error) => setError(error))
  }, [])
  
  useEffect(() => {
    axios
    .get('http://localhost:1337/api/projects?populate=*')
    .then(({ data }) => setProjects(data.data))
    .catch((error) => setError(error))
  }, [])
  
  if (error) {
    // Log errors if any
    console.log('An error occured:' + error.message)
  }
  
  //Duplicate Content for background
  useEffect(() => {
    let ContentEl = document.getElementById('mainContent');
    let ClonedEl = document.getElementById('clonedContent');
    ClonedEl.innerHTML = ContentEl.innerHTML;
  }, [content])

  //Mouse tracking
  let mousetimer;
  let mousePosition = [0, 0];
  let maskPosition = [0, 0];
  let ContentEl = document.getElementById('mainContent');

  var updatepos = function () {
    var speedX, distanceX;
    distanceX = Math.abs(mousePosition[0] - maskPosition[0]);
    if (distanceX < 1) {
      maskPosition[0] = mousePosition[0];
    }
    else {
      speedX = Math.round( distanceX / 10, 0 );
      speedX = speedX >= 1 ? speedX : 1;
      maskPosition[0] = (maskPosition[0] < mousePosition[0]) ? maskPosition[0] + speedX : maskPosition[0] - speedX;
    }
    
    var speedY, distanceY;
    distanceY = Math.abs(mousePosition[1] - maskPosition[1]);
    if (distanceY < 1) {
      maskPosition[1] = mousePosition[1];
    }
    else {
      speedY = Math.round( distanceY / 10, 0 );
      speedY = speedY >= 1 ? speedY : 1;
      maskPosition[1] = (maskPosition[1] < mousePosition[1]) ? maskPosition[1] + speedY : maskPosition[1] - speedY;
    }

    ContentEl.style.clipPath = 'circle(250px at ' + maskPosition[0] + 'px ' + maskPosition[1] + 'px)';
  }

  mousetimer = setInterval(updatepos, 5);

  const onMouseMove = (e) => {
    mousePosition = [e.pageX, e.pageY];
  }

  document.addEventListener('mousemove', onMouseMove);
  

  return (
    <div id="App">
      <div id="mainContent">
        <header className="App-header">
          <h1>{content.intro}</h1>
          <p>
            {content.biography}
          </p>
          {content.links && content.links.map((link) => 
            <a href={link.url} target="_blank" rel="noreferrer">{link.name}</a>
          )}
        </header>
        <section id="projects">
          {projects.map(({attributes}) => 
            <div className="project">
              <div className="thumbnail">
              </div>
              <h2>{attributes.title}</h2>
              <a>Read More -{'>'}</a>
            </div>

            )}
          </section>
      </div>
      <div id="clonedContent"></div>
    </div>
  );
}

export default App;
