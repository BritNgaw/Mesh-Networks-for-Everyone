let currentPage = 'case';
let map = null;
let mapReady = false;
let mapMode = 'outages';
let selectedIdea = 0;
let peopleStory = 'pam';
let tutorialStep = 0;
let tutorialChoice = '';
let outageFilter = 'All';
const mapLayers = [];

function byId(id){ return document.getElementById(id); }
function esc(s){ return String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function nextPage(id){ setPage(id); }

function init(){
  renderNav();
  renderDots();
  renderCase();
  renderTutorial();
  renderMapPage();
  renderPeople();
  renderSurvey();
  renderTakeaways();
  setPage('case');
}

function renderNav(){
  byId('nav').innerHTML = SITE_DATA.pages.map(p => `<button class="nav-btn" id="nav-${p.id}" onclick="setPage('${p.id}')">${p.label}</button>`).join('');
}

function renderDots(){
  const dots = document.createElement('div');
  dots.className = 'step-dots';
  dots.innerHTML = SITE_DATA.pages.map(p => `<span data-dot="${p.id}"></span>`).join('');
  document.body.appendChild(dots);
}

function setPage(id){
  currentPage = id;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  byId('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  byId('nav-' + id).classList.add('active');
  document.querySelectorAll('[data-dot]').forEach(d => d.classList.toggle('on', d.dataset.dot === id));
  const ix = SITE_DATA.pages.findIndex(p => p.id === id) + 1;
  byId('progressText').textContent = Math.round(ix / SITE_DATA.pages.length * 100) + '%';
  byId('progressBar').style.width = (ix / SITE_DATA.pages.length * 100) + '%';
  if(id === 'map') setTimeout(initMap, 80);
  if(id === 'survey') setTimeout(animateSurveyBars, 120);
}

function animateSvgPath(path, dur='3s', color='green'){
  return `<circle r="8" class="moving-dot ${color}"><animateMotion dur="${dur}" repeatCount="indefinite" path="${path}" /></circle>`;
}

function renderCase(){
  const path = 'M105 390 L255 310 L405 240 L560 295 L705 170';
  byId('page-case').innerHTML = `
    <div class="kicker">1. Ukraine case study</div>
    <h1 class="hero-title">StarMesh++: How a Mesh Extends One Working Connection</h1>
    <p class="lede">By the end of this experience, you will see how communities can keep local Wi-Fi available when normal infrastructure fails, where mesh networks are useful, and what people need to consider before deploying them.</p><div class="mission-strip"><b>Learning path</b><span>Read a wartime case study</span><span>Make design choices in a blackout simulation</span><span>Explore outage data</span><span>Compare community examples</span></div><p class="lede">A mesh network is a group of nearby connection points, called nodes, that work together as one network. Instead of every person depending on one tower or one router, connectivity can move from node to node until it reaches a working internet connection. This is useful when power, cell towers, cables, or other communications infrastructure are damaged.</p>
    <div class="path-cards">
      <div><span>Problem</span><b>Infrastructure fails</b><p>Cell towers, antennas, power, or cables can be damaged or unreachable.</p></div>
      <div><span>Constraint</span><b>People still need Wi-Fi</b><p>Residents and aid workers need local communication, records, and updates.</p></div>
      <div><span>Mesh response</span><b>Nodes share the working link</b><p>Several small nodes extend one connection across a wider local area.</p></div>
    </div>
    <div class="grid cols-2 case-grid">
      <div class="card photo-card">
        <img src="assets/mariupol-cell-tower.webp" alt="Damaged apartment buildings in Mariupol, Ukraine">
        <div class="caption"><b>The Last Cell Tower in Mariupol</b><br>For weeks, a lone mobile base station allowed thousands in the besieged Ukrainian city to stay connected-until Russian troops arrived. Photograph: Alexey Kudenko/AP.</div>
      </div>
      <div class="card">
        <h2>What MITRE built and why it matters</h2>
        <p>MITRE describes how communications were damaged in Ukraine through attacks on antennas, jamming of frequencies, and destruction of facilities. As part of its Quick Ukraine Response Initiative, MITRE combined commercially available technologies into Starlink Advantage kits for the Ukrainian Red Cross Society. The goal was not a single new invention. It was a practical kit that people could carry, set up quickly, and repair with replaceable parts.</p>
        <p>The later StarMesh++ design adds mesh networking to make the local coverage area bigger and more flexible. The article says a fully loaded kit costs less than $20,000, weighs less than 10 pounds, can be carried by one person, runs for more than five hours on battery, and can charge from solar power. It also describes VPNs for cybersecurity, point-to-point radios to keep users away from a visible antenna, and portable printers and scanners for important records.</p>
        <p>The key idea is this: the satellite or other backhaul gets internet to the area, but the mesh nodes spread that connection locally. If one node is too far away, blocked, or down, nearby nodes can help route traffic around the problem.</p>
        <p class="cite">Read the full story: <a href="https://www.mitre.org/news-insights/impact-story/ukraine-us-starmesh-system-ready-connect" target="_blank" rel="noopener">MITRE, "From Ukraine to the U.S., StarMesh++ System Is Ready to Connect," Oct. 2, 2024.</a></p>
      </div>
    </div>
    <div class="card animation-card">
      <div class="starmesh-scene large-anim">
        <svg viewBox="0 0 820 520" aria-label="StarMesh style deployment animation">
          <defs><filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          <rect width="820" height="520" rx="22" fill="#081b2e"/>
          <path d="M0 405 C110 360 190 420 310 365 C475 285 610 395 820 315 L820 520 L0 520Z" fill="#102b3f"/>
          <path d="M40 410 L780 410" stroke="#173852" stroke-width="2"/>
          <text x="68" y="70" class="svgLabel">Aid site and local users</text>
          <text x="605" y="70" class="svgLabel">Working internet connection</text>
          <text x="260" y="485" class="svgLabel">A message hops through the mesh nodes before reaching backhaul</text>
          <path class="meshPath" d="${path}"/>
          <path class="meshPath faint" d="M255 310 L350 405 L560 295"/>
          <g class="site" transform="translate(105,390)"><circle r="34"/><text y="5">Aid</text></g>
          <g class="nodeSvg" transform="translate(255,310)"><circle r="24"/><text y="6">1</text></g>
          <g class="nodeSvg" transform="translate(405,240)"><circle r="24"/><text y="6">2</text></g>
          <g class="nodeSvg" transform="translate(560,295)"><circle r="24"/><text y="6">3</text></g>
          <g class="nodeSvg" transform="translate(350,405)"><circle r="21"/><text y="6">P2P</text></g>
          <g class="backhaul" transform="translate(705,170)"><rect x="-72" y="-34" width="144" height="68" rx="14"/><text y="6">Backhaul</text></g>
          ${animateSvgPath(path, '3.2s')}
        </svg>
      </div>
      <p class="caption">One working internet connection enters the area, and nearby mesh nodes extend that connection so aid workers and residents do not depend on a single access point. The P2P node represents the point-to-point radio link described in the article: a direct relay that can keep users a safer distance from the visible uplink while still carrying traffic across the local mesh.</p>
      <div class="metric-row"><div class="metric"><b>&lt; 10 lb</b><span>Portable kit</span></div><div class="metric"><b>&lt; $20k</b><span>Commercial parts</span></div><div class="metric"><b>5+ hr</b><span>Battery life</span></div><div class="metric"><b>3 receivers</b><span>Large local coverage</span></div></div>
    </div>
    <div class="card quiz" id="ukraineQuiz"></div>`;

  quiz('ukraineQuiz', [
    {q:'In the article, why were portable connectivity kits needed in Ukraine?', a:['Communications infrastructure was attacked, jammed, and damaged.','Everyone already had reliable internet.','The kits were only for entertainment.','They replaced all emergency workers.'], correct:0},
    {q:'What is the purpose of mesh nodes?', a:['They spread a connection locally by passing messages from node to node.','They make every phone become a satellite.','They only work in permanent office buildings.','They stop batteries from being needed.'], correct:0},
    {q:'Why were commercial, replaceable parts important?', a:['They made the system easier to repair when parts broke or were destroyed.','They made the system impossible to carry.','They removed the need for training.','They only worked in one country.'], correct:0},
    {q:'What does the animated backhaul represent?', a:['A working connection, such as satellite or another network link, that the local mesh can share.','A decorative square with no network role.','A failed router.','A phone charger only.'], correct:0}
  ], 'Next: simulate a rescue', () => setPage('tutorial'));
}

const QUIZ_STATE = {};
function quiz(target, questions, doneText, done){
  QUIZ_STATE[target] = {
    index: 0,
    score: 0,
    answered: false,
    selected: null,
    questions: questions,
    doneText: doneText,
    done: done
  };
  drawQuiz(target);
}
function drawQuiz(target){
  const st = QUIZ_STATE[target];
  const host = byId(target);
  if(!st || !host) return;
  if(st.index >= st.questions.length){
    host.innerHTML = `<div class="kicker">Quiz complete</div><h3>You scored ${st.score} out of ${st.questions.length}.</h3><button type="button" class="btn" onclick="quizDone('${target}')">${esc(st.doneText)}</button>`;
    return;
  }
  const q = st.questions[st.index];
  host.innerHTML = `
    <div class="quiz-head">
      <div><div class="kicker">Check your understanding</div><h3>${st.index + 1}. ${esc(q.q)}</h3></div>
      <div class="score">Score: <b id="score-${target}">${st.score}</b> / ${st.questions.length}</div>
    </div>
    <div class="answers">
      ${q.a.map((x,k) => `<button type="button" class="answer" id="${target}-answer-${k}" onclick="quizAnswer('${target}', ${k})">${esc(x)}</button>`).join('')}
    </div>
    <div class="quiz-foot">
      <span class="small quiz-message" id="message-${target}">Choose an answer to continue.</span>
      <button type="button" class="btn ghost quiz-next" id="next-${target}" onclick="quizNext('${target}')">Next</button>
    </div>`;
}
function quizAnswer(target, idx){
  const st = QUIZ_STATE[target];
  if(!st || st.answered) return;
  const q = st.questions[st.index];
  st.answered = true;
  st.selected = idx;
  if(idx === q.correct) st.score += 1;
  q.a.forEach((_, k) => {
    const btn = byId(`${target}-answer-${k}`);
    if(!btn) return;
    btn.disabled = true;
    if(k === q.correct) btn.classList.add('good');
    if(k === idx && k !== q.correct) btn.classList.add('bad');
  });
  const scoreEl = byId(`score-${target}`);
  if(scoreEl) scoreEl.textContent = st.score;
  const msg = byId(`message-${target}`);
  if(msg){
    if(idx === q.correct){
      msg.textContent = q.explanation ? 'Correct. ' + q.explanation : 'Correct. Click Next to continue.';
    } else {
      const correctText = q.a[q.correct];
      msg.textContent = q.explanation
        ? 'Not quite. ' + q.explanation
        : 'Not quite. The better answer is: "' + correctText + '". The other option does not match the evidence from this module; mesh networks help by restoring local Wi-Fi through multiple nodes instead of depending on one fragile connection.';
    }
  }
  const next = byId(`next-${target}`);
  if(next) next.textContent = st.index === st.questions.length - 1 ? 'Finish' : 'Next';
}
function quizNext(target){
  const st = QUIZ_STATE[target];
  if(!st) return;
  if(!st.answered){
    const msg = byId(`message-${target}`);
    if(msg) msg.textContent = 'Choose an answer first, then click Next.';
    return;
  }
  st.index += 1;
  st.answered = false;
  st.selected = null;
  drawQuiz(target);
}
function quizDone(target){
  const st = QUIZ_STATE[target];
  if(st && typeof st.done === 'function') st.done();
}
window.quizAnswer = quizAnswer;
window.quizNext = quizNext;
window.quizDone = quizDone;

function renderTutorial(){
  tutorialStep = 0;
  tutorialChoice = '';
  byId('page-tutorial').innerHTML = `
    <div class="kicker">2. Interactive tutorial</div>
    <h1 class="hero-title">Simulate a Mesh Rescue During a Blackout</h1>
    <p class="lede">Make placement decisions, compare the outcome, and see how a mesh network can restore local Wi-Fi connectivity when the usual connection is unavailable.</p>
    <div class="before-after">
      <div><span>Before</span><b>No local path</b><p>One person needs help, but the normal route to the rescue hub is down.</p></div>
      <div><span>After</span><b>Shared local Wi-Fi</b><p>Nodes create overlapping coverage and a route to the rescue hub.</p></div>
    </div>
    <div class="grid cols-2 tutorial-grid">
      <div class="card"><div class="sim-scene"><svg id="tutorialSvg" viewBox="0 0 860 520" role="img" aria-label="Blackout mesh rescue simulation"></svg></div></div>
      <div class="card decision-card">
        <div class="kicker">Design mission</div>
        <h2 id="missionTitle"></h2>
        <p id="missionText" class="lede"></p>
        <div id="choicePanel" class="choice-panel"></div>
        <div class="grid cols-2"><button class="btn" id="nextDecision" onclick="tutorialAction()">Start mission</button><button class="btn ghost" onclick="resetTutorial()">Reset</button></div>
        <div class="status-list" id="missionStatus"></div>
      </div>
    </div>
    <div class="module-next"><button class="btn primary" onclick="setPage('map')">Next: 3. Map and Examples</button></div>`;
  drawTutorial();
}
function resetTutorial(){
  tutorialStep = 0;
  tutorialChoice = '';
  window.tutorialFeedback = '';
  window.tutorialFailedChoice = '';
  drawTutorial();
}
function chooseTutorialChoice(choice){
  tutorialChoice = choice;
  window.tutorialFeedback = '';
  window.tutorialFailedChoice = '';
  drawTutorial();
}
function tutorialChoices(){
  return {
    1:[
      {key:'rooftop', label:'Place Node A on a rooftop near the person', good:true, why:'Elevation and short distance create reliable local Wi-Fi coverage.', result:'Good choice: the person can reach a nearby Wi-Fi node because it is elevated and close enough.'},
      {key:'alley', label:'Place Node A in a narrow alley', good:false, why:'Buildings block the signal path.', result:'That placement fails because walls and corners weaken the signal before it reaches the person. Try a higher, clearer location.'},
      {key:'far', label:'Place Node A far from the person', good:false, why:'Distance makes the connection unreliable.', result:'That placement fails because the person is outside reliable Wi-Fi range. Try placing the first node closer.'}
    ],
    2:[
      {key:'shelter', label:'Place Node B toward a shelter or community site', good:true, why:'Trusted sites often have power, staff, and visibility.', result:'Good choice: the connection now moves toward a staffed community location that can support people during a blackout.'},
      {key:'water', label:'Place Node B by the waterfront', good:false, why:'Flood exposure can take the relay offline.', result:'That placement is risky because flooding or saltwater exposure could disable the relay when it is needed most.'},
      {key:'hidden', label:'Hide Node B indoors with no line of sight', good:false, why:'Poor line of sight weakens the relay.', result:'That placement fails because the relay is shielded from the other nodes. Try a location with a clearer signal path.'}
    ],
    3:[
      {key:'backup', label:'Add a lower backup route with its own power', good:true, why:'Redundancy keeps Wi-Fi available if one route fails.', result:'Good choice: the mesh now has a second route and backup power, so one failed link does not cut off the hub.'},
      {key:'single', label:'Use only one long route', good:false, why:'One break can stop the entire connection.', result:'That design is fragile because one failed node or link would cut off the rescue hub. Add redundancy.'},
      {key:'dense', label:'Cluster all nodes together', good:false, why:'Coverage does not expand to the hub.', result:'That design leaves distant areas uncovered. Spread nodes so their coverage overlaps while still extending toward the hub.'}
    ],
    4:[
      {key:'send', label:'Test both routes, then send the emergency update', good:true, why:'Testing confirms the hub is reachable before help is needed.', result:'Good choice: the mesh has enough verified connectivity for the rescue hub to receive the update.'},
      {key:'rush', label:'Send before the route is complete', good:false, why:'The update may not reach the hub.', result:'That action fails because the network has not been checked end-to-end. Finish and test the route before relying on it.'},
      {key:'wait', label:'Wait for normal service only', good:false, why:'Waiting delays help during the outage.', result:'That action delays response. A mesh backup is useful because it can restore local Wi-Fi before normal service returns.'}
    ]
  };
}
function tutorialAction(){
  if(tutorialStep === 0){
    tutorialStep = 1;
    tutorialChoice = '';
    window.tutorialFeedback = '';
    window.tutorialFailedChoice = '';
    drawTutorial();
    return;
  }
  if(tutorialStep >= 6){ resetTutorial(); return; }
  const current = tutorialChoices()[tutorialStep];
  if(current){
    if(!tutorialChoice){
      const panel = byId('choicePanel');
      if(panel) panel.classList.add('nudge');
      return;
    }
    const selected = current.find(c => c.key === tutorialChoice);
    if(selected && !selected.good){
      window.tutorialFailedChoice = tutorialChoice;
      window.tutorialFeedback = selected.result;
      tutorialChoice = '';
      drawTutorial();
      return;
    }
    window.tutorialFeedback = selected ? selected.result : '';
  }
  tutorialStep = Math.min(6, tutorialStep + 1);
  tutorialChoice = '';
  window.tutorialFailedChoice = '';
  drawTutorial();
}
function drawTutorial(){
  const titles = ['Step 1: blackout begins','Step 2: choose the first Wi-Fi node','Step 3: extend toward a trusted site','Step 4: add redundancy','Step 5: verify and send','Step 6: main route fails','Saved: rescue hub received the update'];
  const texts = [
    'Regular internet is down. The person who needs help has no direct Wi-Fi path to the rescue hub.',
    'Choose where to place Node A so the person can reach a nearby local Wi-Fi signal.',
    'Choose where Node B should go so the connection can move toward a shelter or community site.',
    'Choose whether the network should include a second powered route before it is used for help.',
    'Choose the safest way to restore Wi-Fi connectivity to the rescue hub.',
    'The upper route fails. The lower backup route keeps the rescue hub connected.',
    'Because you placed nodes with distance, elevation, redundancy, and power in mind, the rescue hub receives the update.'
  ];
  byId('missionTitle').textContent = titles[tutorialStep];
  byId('missionText').textContent = texts[tutorialStep];
  const choices = tutorialChoices();
  let choiceHtml = '';
  if(choices[tutorialStep]){
    choiceHtml = '<div class="kicker">Choose a placement</div>' + choices[tutorialStep].map(c => '<button class="choice '+(tutorialChoice===c.key?'selected':'')+' '+(window.tutorialFailedChoice===c.key?'badChoice':'')+'" onclick="chooseTutorialChoice(&quot;'+c.key+'&quot;)"><b>'+c.label+'</b><span>'+(tutorialChoice===c.key?c.why:(window.tutorialFailedChoice===c.key?'Try a different choice':'Click to test this choice'))+'</span></button>').join('');
  } else if(tutorialStep === 0) {
    choiceHtml = '<p class="small">Click Start mission to begin.</p>';
  } else {
    choiceHtml = '<p class="small">The simulation is now showing the current network state.</p>';
  }
  if(window.tutorialFeedback){
    choiceHtml += '<div class="decision-feedback '+(window.tutorialFailedChoice?'fail':'success')+'">'+esc(window.tutorialFeedback)+'</div>';
  }
  byId('choicePanel').innerHTML = choiceHtml;
  byId('choicePanel').classList.remove('nudge');
  byId('nextDecision').textContent = tutorialStep === 0 ? 'Start mission' : (tutorialStep >= 6 ? 'Restart mission' : (window.tutorialFailedChoice ? 'Try another placement' : 'Apply choice'));
  byId('nextDecision').onclick = tutorialStep >= 6 ? resetTutorial : tutorialAction;
  const statuses = ['Person reaches local Wi-Fi','Community site connected','Backup route added','Emergency update sent','Main link failed','Rescue hub received update'];
  byId('missionStatus').innerHTML = statuses.map((x,i) => '<div class="check '+(tutorialStep >= i + 1 ? 'on' : '')+' '+(tutorialStep >= 6 && i === 5 ? 'final-on' : '')+'">'+x+'</div>').join('');
  const mainPath = 'M105 375 L225 310 L380 245 L560 170 L735 160';
  const altPath = 'M105 375 L225 310 L380 245 L560 360 L735 160';
  const routePath = tutorialStep >= 5 ? altPath : mainPath;
  const broken = tutorialStep >= 5;
  const fail = window.tutorialFailedChoice || '';
  const failShapes = {
    alley:'<g class="failedNode" transform="translate(190,405)"><circle r="22"/><text y="6">A?</text></g><path class="failedPath" d="M105 375 L190 405"/>',
    far:'<g class="failedNode" transform="translate(350,410)"><circle r="22"/><text y="6">A?</text></g><path class="failedPath" d="M105 375 L350 410"/>',
    water:'<g class="failedNode" transform="translate(410,430)"><circle r="22"/><text y="6">B?</text></g><path class="failedPath" d="M225 310 L410 430"/>',
    hidden:'<g class="failedNode" transform="translate(405,330)"><circle r="22"/><text y="6">B?</text></g><path class="failedPath" d="M225 310 L405 330"/>',
    single:'<path class="failedPath" d="M380 245 L645 120 L735 160"/><text x="555" y="105" class="failLabel">No backup</text>',
    dense:'<g class="failedNode" transform="translate(415,270)"><circle r="20"/><text y="6">C?</text></g><g class="failedNode" transform="translate(450,285)"><circle r="20"/><text y="6">D?</text></g>',
    rush:'<path class="failedPath" d="M105 375 L225 310 L380 245"/><text x="410" y="235" class="failLabel">Route incomplete</text>',
    wait:'<text x="430" y="250" class="failLabel">No backup used</text>'
  };
  byId('tutorialSvg').innerHTML = `
    <defs><filter id="glow2"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect width="860" height="520" rx="22" fill="#081b2e"/>
    <path d="M0 405 C120 350 240 445 365 360 C520 270 680 420 860 320 L860 520 L0 520Z" fill="#102b3f"/>
    <text x="58" y="62" class="svgLabel">Blackout area: regular internet is down</text>
    <text x="58" y="94" class="svgLabel smallSvg">Coverage circles show where Wi-Fi becomes available again.</text>
    <circle cx="105" cy="375" r="54" class="coverage ${tutorialStep>=1?'on':''}"/>
    <circle cx="225" cy="310" r="68" class="coverage ${tutorialStep>=1?'on':''}"/>
    <circle cx="380" cy="245" r="70" class="coverage ${tutorialStep>=2?'on':''}"/>
    <circle cx="560" cy="170" r="65" class="coverage ${tutorialStep>=3?'on':''}"/>
    <circle cx="560" cy="360" r="65" class="coverage ${tutorialStep>=3?'on':''}"/>
    <path class="meshPath ${tutorialStep < 1 ? 'hide' : ''}" d="M105 375 L225 310"/>
    <path class="meshPath ${tutorialStep < 2 ? 'hide' : ''}" d="M225 310 L380 245"/>
    <path class="meshPath ${tutorialStep < 3 ? 'hide' : ''} ${broken ? 'broken' : ''}" d="M380 245 L560 170 L735 160"/>
    <path class="meshPath ${tutorialStep < 3 ? 'hide' : ''}" d="M380 245 L560 360 L735 160"/>
    <g class="personSvg" transform="translate(105,375)"><circle r="30"/><text y="5">SOS</text></g>
    <g class="nodeSvg ${tutorialStep >= 1 ? '' : 'off'}" transform="translate(225,310)"><circle r="23"/><text y="6">A</text></g>
    <g class="nodeSvg ${tutorialStep >= 2 ? '' : 'off'}" transform="translate(380,245)"><circle r="23"/><text y="6">B</text></g>
    <g class="nodeSvg ${tutorialStep >= 3 ? '' : 'off'}" transform="translate(560,170)"><circle r="23"/><text y="6">C</text></g>
    <g class="nodeSvg ${tutorialStep >= 3 ? '' : 'off'}" transform="translate(560,360)"><circle r="23"/><text y="6">D</text></g>
    <g class="site ${tutorialStep >= 6 ? 'saved' : ''}" transform="translate(735,160)"><circle r="38"/><text y="6">HQ</text></g>
    ${failShapes[fail] || ''}
    ${tutorialStep >= 4 ? animateSvgPath(routePath, '2.6s') : ''}
    ${broken ? '<text x="525" y="220" class="failLabel">Link down</text>' : ''}`;
}
window.chooseTutorialChoice = chooseTutorialChoice;

function renderMapPage(){
  byId('page-map').innerHTML = `
    <div class="kicker">3. Map and examples</div>
    <h1 class="hero-title">Explore Outages, Then Design Mesh Coverage</h1>
    <p class="lede">Explore mapped 2025 country and locality outages, filter by cause, then compare example mesh placements with geographic reasoning.</p>
    <div class="tabs"><button class="tab active" id="tab-outages" onclick="setMapMode('outages')">Outage map</button><button class="tab" id="tab-examples" onclick="setMapMode('examples')">Example mesh networks</button></div>
    <div id="mapPane"></div>`;
  renderMapPane();
}
function setMapMode(m){
  mapMode = m;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  byId('tab-' + m).classList.add('active');
  renderMapPane();
  setTimeout(initMap, 80);
}
function renderMapPane(){
  if(mapMode === 'outages'){
    const causes = ['All'].concat(Array.from(new Set(SITE_DATA.locations.map(l => l.topCause || 'Unknown'))).sort());
    byId('mapPane').innerHTML = `<div class="map-layout outages"><div class="card"><h3>Outage explorer</h3><p><b>${SITE_DATA.locations.length}</b> mapped country and locality outage areas.</p><p><b>${SITE_DATA.countries.length}</b> countries represented.</p><label class="small" for="causeFilter">Filter by cause</label><select id="causeFilter" class="select" onchange="setOutageFilter(this.value)">${causes.map(c => `<option value="${esc(c)}" ${c===outageFilter?'selected':''}>${esc(c)}</option>`).join('')}</select><p class="small">Click any marker to inspect dates, cause, network type, and summaries.</p><button class="btn" onclick="setMapMode('examples')">Next: view mesh examples</button><div class="list scroll">${SITE_DATA.countries.map(c => `<button onclick="focusCountry('${esc(c.country)}')"><b>${esc(c.country)}</b><br><span class="small">${c.count} incidents, ${c.localities} mapped areas</span></button>`).join('')}</div></div><div id="map"></div></div>`;
  } else {
    byId('mapPane').innerHTML = `<div class="map-layout"><div class="card"><div class="list" id="ideaList"></div></div><div id="map"></div><div class="card" id="ideaDetail"></div></div>`;
    byId('ideaList').innerHTML = SITE_DATA.meshIdeas.map((m,i) => `<button onclick="selectIdea(${i})" id="idea-${i}"><b>${esc(m.name)}</b><br><span class="small">${esc(m.risk)}</span></button>`).join('');
    renderIdeaDetail();
  }
}
function setOutageFilter(value){ outageFilter = value || 'All'; if(mapMode === 'outages'){ setTimeout(initMap, 20); } }
window.setOutageFilter = setOutageFilter;
function initMap(){
  const mapDiv = byId('map');
  if(!mapDiv) return;
  if(map){ map.remove(); map = null; mapReady = false; }
  map = L.map('map').setView([22,20],2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'OpenStreetMap contributors'}).addTo(map);
  mapReady = true;
  if(mapMode === 'outages') renderOutageMap(); else renderIdeaMap();
}
function renderOutageMap(){
  if(!mapReady) return;
  const group = L.layerGroup().addTo(map);
  SITE_DATA.locations.filter(l => outageFilter === 'All' || (l.topCause || 'Unknown') === outageFilter).forEach(l => {
    const r = Math.max(5, Math.min(20, 4 + Math.sqrt(l.count) * 4));
    const mk = L.circleMarker([l.lat,l.lng], {radius:r, color:'#fff', weight:1, fillColor:l.count>5?'#ff6666':(l.count>2?'#ffd166':'#3bc8ff'), fillOpacity:.82}).addTo(group);
    const events = l.events.map(e => `<li><b>${esc(e.start)}${e.end ? ' to ' + esc(e.end) : ''}</b>: ${esc(e.cause || 'Unknown')} - ${esc(e.summary || 'No summary available.')}</li>`).join('');
    mk.bindPopup(`<b>${esc(l.country)}</b><br>${esc(l.area)}<br><b>${l.count}</b> incident${l.count===1?'':'s'}<br>Top cause: ${esc(l.topCause)}<br>Network: ${esc(l.topType)}<ul>${events}</ul>`);
  });
  const bounds = group.getBounds();
  if(bounds.isValid()) map.fitBounds(bounds, {padding:[20,20]});
}
function focusCountry(country){
  if(mapMode !== 'outages' || !mapReady) return;
  const pts = SITE_DATA.locations.filter(l => l.country === country).map(l => [l.lat,l.lng]);
  if(pts.length) map.fitBounds(pts, {padding:[50,50], maxZoom:7});
}
function selectIdea(i){ selectedIdea = i; renderIdeaDetail(); renderIdeaMap(); }
function renderIdeaDetail(){
  if(!byId('ideaDetail')) return;
  const m = SITE_DATA.meshIdeas[selectedIdea];
  document.querySelectorAll('#ideaList button').forEach((b,i) => b.classList.toggle('active', i === selectedIdea));
  byId('ideaDetail').innerHTML = `<div class="kicker">Mesh idea</div><h2>${esc(m.name)}</h2><p class="small"><b>Risk:</b> ${esc(m.risk)}</p><p>${esc(m.idea)}</p><button class="btn" onclick="setPage('people')">Continue to case studies</button>`;
}
function renderIdeaMap(){
  if(!mapReady || !map) return;
  const m = SITE_DATA.meshIdeas[selectedIdea];
  const pts = m.nodes.map(n => [n[0],n[1]]);
  L.polyline(pts, {color:'#44d3ff', weight:4, dashArray:'8 8'}).addTo(map);
  pts.forEach((p,i) => L.circleMarker(p, {radius:i===0?11:9, color:'#fff', weight:1, fillColor:i===0?'#7bea77':'#3bc8ff', fillOpacity:.9}).addTo(map).bindPopup((i===0?'Gateway':'Relay node') + '<br>' + esc(m.name)));
  if(pts.length) map.fitBounds(pts, {padding:[50,50], maxZoom:10});
}

function renderPeople(){
  byId('page-people').innerHTML = `<div class="kicker">4. Community case studies</div><h1 class="hero-title">Everyone Benefits When Connectivity Has Local Paths</h1><p class="lede">These stories show the everyday side of mesh networking: technicians restoring service, residents finding resources, farms protecting food, and neighborhoods sharing trusted information.</p><div class="tabs"><button class="tab active" id="tab-pam" onclick="showStory('pam')">Pam Weaver interview</button><button class="tab" id="tab-redhook" onclick="showStory('redhook')">Red Hook, Brooklyn</button></div><div id="story"></div>`;
  showStory('pam');
}
function showStory(which){
  peopleStory = which;
  document.querySelectorAll('#page-people .tab').forEach(t => t.classList.remove('active'));
  byId('tab-' + which).classList.add('active');
  if(which === 'pam'){
    const p = 'M95 390 L235 315 L410 235 L585 300 L745 205';
    byId('story').innerHTML = `<div class="grid cols-2"><div class="card"><h2>Pam Weaver: technician knowledge meets a Hawaii community backup plan</h2><p>Pam Weaver, a former Hawaiian Telephone Company technician, described outage repair as a practical sequence of steps: receive the call, travel to the site, isolate whether the problem came from the central office or the field, inspect cables, and check or replace circuit cards. In Hawaii, some repair work can involve driving to mountain sites, so restoration depends on skilled technicians, road access, and working equipment.</p><p>She also explained that shared telecommunications buildings can house infrastructure for multiple providers. That matters for mesh planning because a neighborhood backup should not pretend to replace professional telecom repair. It should provide a simple, temporary local path while crews diagnose and restore the main service.</p><p>Pam said many outages could be resolved in roughly one and a half to two hours when crews could reach and isolate the issue. A community mesh network is useful during that gap: residents could receive local updates from a community hub, check whether neighbors need help, and keep essential information moving even when the primary internet path is unavailable.</p><p>The design lesson from Pam's interview is trust. A proposed Hawaii mesh should use familiar community sites, clear host agreements, backup power, and plain-language instructions so residents understand what the network is for, where nodes are located, and when it should be used.</p></div><div class="card"><div class="starmesh-scene large-anim full-frame-anim"><svg viewBox="0 0 860 560"><defs><filter id="glow3"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="860" height="560" rx="22" fill="#081b2e"/><path d="M0 405 C150 315 280 470 430 340 C570 230 700 360 860 250 L860 560 L0 560Z" fill="#12364d"/><path d="M0 448 C170 385 300 505 455 395 C610 300 720 430 860 345" fill="none" stroke="#1a5372" stroke-width="24" opacity=".55"/><text x="50" y="58" class="svgLabel">Proposed Hawaii neighborhood backup mesh</text><text x="52" y="92" class="svgLabel smallSvg">Community hub, rooftop relays, mountain-site awareness, and a repair information link</text><path class="meshPath" d="${p}"/><path class="meshPath faint" d="M235 315 L350 430 L585 300"/><g class="site" transform="translate(95,390)"><circle r="38"/><text y="6">Homes</text></g><g class="nodeSvg" transform="translate(235,315)"><circle r="27"/><text y="6">Hub</text></g><g class="nodeSvg" transform="translate(410,235)"><circle r="27"/><text y="6">Roof</text></g><g class="nodeSvg" transform="translate(585,300)"><circle r="27"/><text y="6">Relay</text></g><g class="nodeSvg" transform="translate(350,430)"><circle r="24"/><text y="6">Alt</text></g><g class="backhaul" transform="translate(745,205)"><rect x="-86" y="-38" width="172" height="76" rx="15"/><text y="-4">Repair</text><text y="17">updates</text></g>${animateSvgPath(p,'3s')}</svg></div><p class="caption">While technicians isolate a fault at the central office, field equipment, or a mountain site, trusted local nodes could keep neighborhood updates available until full service returns.</p></div></div><div class="card quiz" id="pamQuiz"></div>`;
    quiz('pamQuiz', [
      {q:"What does Pam Weaver's technician experience show about outages?", a:['Restoring service often requires isolating faults and checking field equipment.','Outages are always caused by weather.','No one needs physical access to equipment.','Cell providers never share facilities.'], correct:0},
      {q:'How should a community mesh network complement main telecom service?', a:['It can provide a temporary backup while crews restore service.','It should claim to make outages impossible.','It should replace all technicians.','It should only serve entertainment traffic.'], correct:0},
      {q:'What would make residents more likely to support a small neighborhood network?', a:['Clear explanation of placement, purpose, and limits.','Hiding all information about the network.','Making the network harder to understand.','Only discussing technical jargon.'], correct:0}
    ], 'Open Red Hook case study', () => showStory('redhook'));
  } else {
    const p = 'M105 355 L240 260 L390 330 L555 240 L705 315';
    byId('story').innerHTML = `<div class="grid cols-2"><div class="card photo-card"><img src="assets/red-hook-channel.jpg" alt="Valentino Pier in Red Hook, Brooklyn"><div class="caption"><b>Facing the Red Hook Channel from Valentino Pier in Red Hook, Brooklyn.</b><br>Photo by Amelia Holowaty Krales / The Verge.</div></div><div class="card"><h2>Red Hook WiFi: disaster response and long-term maintenance</h2><p>After Hurricane Sandy, Red Hook faced damaged power and telecommunications. Residents needed to charge devices, tell people they were safe, and find resources. The Red Hook Initiative community center still had power and internet, and its mesh Wi-Fi became a practical lifeline for communication and coordination.</p><p>The network mattered because it was local. A mesh node at Coffey Park and connectivity at Red Hook Initiative helped residents and responders coordinate relief. FEMA later strengthened the connection with a satellite dish, and the network reportedly jumped to around a thousand users a day as people searched for information and shared resources.</p><p>Over time, Red Hook WiFi grew through youth digital steward programs, local businesses, farms, and community host sites. At its strongest, it reached nearly 20 locations and served hundreds of users each week. The network also supported newer uses, including farm sensors and air-quality monitoring.</p><p>The article also shows the hard part: funding, ownership, maintenance, access to public housing buildings, construction disruptions, and long-term operating costs. The lesson is not just install routers. It is train people, fund maintenance, choose trusted host sites, add backup power, and decide who is responsible when nodes fail.</p><p class="cite"><a href="https://www.theverge.com/c/features/23700677/wifi-mesh-network-disaster-hurricane-sandy-brooklyn" target="_blank" rel="noopener">The Verge, "Red Hook's mesh network survived Hurricane Sandy. Today, it's in limbo."</a></p></div></div><div class="card"><div class="starmesh-scene large-anim full-frame-anim"><svg viewBox="0 0 860 560"><defs><filter id="glow4"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="860" height="560" rx="22" fill="#081b2e"/><path d="M0 420 C130 350 250 455 395 375 C540 300 690 425 860 330 L860 560 L0 560Z" fill="#102b3f"/><path d="M0 455 L860 375" stroke="#1c5a78" stroke-width="22" opacity=".45"/><text x="50" y="58" class="svgLabel">Red Hook after Sandy: community sites keep a local path open</text><text x="50" y="92" class="svgLabel smallSvg">RHI, Coffey Park, farms, shops, and homes can share coverage when larger systems fail</text><path class="meshPath" d="${p}"/><path class="meshPath faint" d="M240 260 L555 240 M390 330 L705 315"/><g class="site" transform="translate(105,355)"><circle r="38"/><text y="6">RHI</text></g><g class="nodeSvg" transform="translate(240,260)"><circle r="27"/><text y="6">Park</text></g><g class="nodeSvg" transform="translate(390,330)"><circle r="27"/><text y="6">Farm</text></g><g class="nodeSvg" transform="translate(555,240)"><circle r="27"/><text y="6">Shop</text></g><g class="site" transform="translate(705,315)"><circle r="38"/><text y="6">Homes</text></g>${animateSvgPath(p,'3s')}</svg></div><p class="caption">This animation reflects the Red Hook story: trusted community host sites create local coverage for residents, responders, farms, and neighborhood information when storms or outages disrupt conventional service.</p></div><div class="card quiz" id="redQuiz"></div>`;
    quiz('redQuiz', [
      {q:'Why did Red Hook WiFi matter after Hurricane Sandy?', a:['It helped residents communicate when major power, phone, and internet systems were down.','It only supported online gaming.','It replaced the need for community centers.','It worked without any host sites.'], correct:0},
      {q:'What made the Red Hook network community-centered?', a:['Local stewards, trusted host sites, and neighborhood uses shaped the network.','It was controlled only by a distant carrier.','Residents never used it.','It had no training component.'], correct:0},
      {q:'What long-term challenge does the article emphasize?', a:['Maintenance, funding, ownership, and building access matter as much as routers.','Routers never fail.','A disaster network needs no budget.','Construction cannot affect wireless links.'], correct:0}
    ], 'View survey insights', () => setPage('survey'));
  }
}

function likelihoodLabel(label){
  const m = {'1':'1 - least likely','2':'2 - unlikely','3':'3 - maybe','4':'4 - likely','5':'5 - very likely'};
  return m[label] || label;
}
function pct(value, total){ return Math.round((Number(value || 0) / (total || 1)) * 100); }
function renderPctRows(items, total){
  return items.map(u => {
    const n = pct(u.value, total);
    return `<div class="survey-row"><p class="small"><span>${esc(u.label)}</span><b>${n}%</b></p><div class="bar"><span data-w="${n}"></span></div></div>`;
  }).join('');
}
function renderSurvey(){
  const s = SITE_DATA.survey;
  const likelihood = s.likelihood.filter(u => String(u.label || '').trim() && String(u.label).toLowerCase() !== 'blank')
    .map(u => ({label: likelihoodLabel(String(u.label)), value: u.value}));
  const likelihoodTotal = likelihood.reduce((sum,u) => sum + Number(u.value || 0), 0) || 1;
  const factorItems = (s.factorsDetailed || []).length ? s.factorsDetailed : (s.factors || []).map(label => ({label, value: 1}));
  const factorTotal = factorItems.reduce((sum,u) => sum + Number(u.value || 0), 0) || 1;
  const useTotal = s.uses.reduce((sum,u) => sum + Number(u.value || 0), 0) || 1;
  const hostTotal = s.hosting.reduce((sum,u) => sum + Number(u.value || 0), 0) || 1;
  const topUse = s.uses.slice().sort((a,b)=>b.value-a.value)[0];
  const topFactor = factorItems.slice().sort((a,b)=>b.value-a.value)[0];
  const yesItem = s.hosting.find(x=>x.label==='Yes');
  const maybeItem = s.hosting.find(x=>x.label==='Maybe');
  const hostSupport = pct((yesItem ? yesItem.value : 0) + (maybeItem ? maybeItem.value : 0), hostTotal);
  byId('page-survey').innerHTML = `<div class="kicker">5. Survey insights</div>
    <h1 class="hero-title">Public Opinions from the Open Mesh WiFi Survey</h1>
    <p class="lede">We sent an online survey primarily to NYU and Cornell Tech students to understand how people think about community mesh networks, outage needs, privacy, reliability, and willingness to support local equipment.</p>
    <div class="insight-strip">
      <div><b>${pct(topUse.value, useTotal)}%</b><span>selected ${esc(topUse.label)} as an outage need</span></div>
      <div><b>${pct(topFactor.value, factorTotal)}%</b><span>of selected concerns mentioned ${esc(topFactor.label)}</span></div>
      <div><b>${hostSupport}%</b><span>answered Yes or Maybe to hosting a small antenna</span></div>
    </div>
    <div class="grid cols-2 survey-grid">
      <div class="card"><h3>Likelihood to use backup Wi-Fi</h3>${renderPctRows(likelihood, likelihoodTotal)}</div>
      <div class="card"><h3>What would you need internet for during a shutdown?</h3>${renderPctRows(s.uses, useTotal)}</div>
    </div>
    <div class="grid cols-2 survey-grid" style="margin-top:18px">
      <div class="card"><h3>What other considerations/factors do you need internet for during a shutdown?</h3>${renderPctRows(factorItems, factorTotal)}</div>
      <div class="card"><h3>Would you allow a small antenna on your building if it helped your neighborhood stay connected?</h3>${renderPctRows(s.hosting, hostTotal)}</div>
    </div>
    <div class="grid cols-2 survey-grid" style="margin-top:18px">
      <div class="card"><h2>What this implies</h2>
        <p>The responses so far suggest that local mesh deployments should be designed around everyday continuity, not only emergency rescue. Work and messaging were the most common shutdown needs, with emergency information and social media also appearing. That means a community network should prioritize simple access to communication, essential updates, and trusted local information.</p>
        <p>Reliability and privacy/security were the strongest considerations. Cost, installation, and uncertainty about how the system works also showed up, so deployment plans should include clear explanations, transparent data practices, visible maintenance responsibilities, and low-burden hosting options. The antenna question shows that many respondents are open to helping if the benefit to the neighborhood is clear.</p>
      </div>
      <div class="card cta"><div class="kicker">Help shape the future</div><h2>Take our quick survey</h2><p>Tell us what matters most for your mesh network deployment.</p><p><a class="btn" href="https://forms.gle/KuvhDk3qp6pf4N4f7" target="_blank" rel="noopener">Take the Survey Now</a></p><p class="small">We will share findings with community partners such as <a href="https://redhookwifi.org/" target="_blank" rel="noopener">Red Hook WiFi</a> and <a href="https://www.nycmesh.net/" target="_blank" rel="noopener">NYC Mesh</a>.</p></div>
    </div><div class="module-next"><button class="btn" onclick="setPage('takeaways')">Finish with deployment takeaways</button></div>`;
}

function renderTakeaways(){
  const host = byId('page-takeaways');
  if(!host) return;
  host.innerHTML = `<div class="kicker">6. Deployment takeaways</div>
    <h1 class="hero-title">What Communities Should Consider Before Deploying Mesh Networks</h1>
    <p class="lede">The case studies and survey point to a practical lesson: resilient Wi-Fi is both technical infrastructure and community coordination.</p>
    <div class="grid cols-3 takeaway-grid">
      <div class="card"><div class="kicker">1</div><h3>Start with trusted sites</h3><p>Community centers, clinics, schools, farms, and local businesses can become anchor points because people already know where to go for help.</p></div>
      <div class="card"><div class="kicker">2</div><h3>Design for failure</h3><p>Use overlapping nodes, backup power, and alternate routes so one damaged link does not erase the whole network.</p></div>
      <div class="card"><div class="kicker">3</div><h3>Explain privacy and reliability</h3><p>Survey responses show that people care about whether the network is dependable and what happens to their information.</p></div>
      <div class="card"><div class="kicker">4</div><h3>Plan maintenance early</h3><p>Red Hook shows that long-term ownership, funding, and repair responsibilities matter as much as the initial installation.</p></div>
      <div class="card"><div class="kicker">5</div><h3>Support professional repair</h3><p>A mesh network can keep local Wi-Fi available while technicians restore the main service. It should complement, not replace, telecom repair.</p></div>
      <div class="card"><div class="kicker">6</div><h3>Ask the community first</h3><p>Deployment should reflect what residents actually need during outages: messaging, work, emergency information, and trusted local updates.</p></div>
    </div>
    <footer class="source-footer card"><h3>Sources and partners</h3><p><a href="https://www.mitre.org/news-insights/impact-story/ukraine-us-starmesh-system-ready-connect" target="_blank" rel="noopener">MITRE StarMesh++ impact story</a> · <a href="https://www.theverge.com/c/features/23700677/wifi-mesh-network-disaster-hurricane-sandy-brooklyn" target="_blank" rel="noopener">The Verge on Red Hook WiFi</a> · <a href="https://redhookwifi.org/" target="_blank" rel="noopener">Red Hook WiFi</a> · <a href="https://www.nycmesh.net/" target="_blank" rel="noopener">NYC Mesh</a> · <a href="https://forms.gle/KuvhDk3qp6pf4N4f7" target="_blank" rel="noopener">Community survey</a></p></footer>`;
}

function animateSurveyBars(){ document.querySelectorAll('.bar span').forEach(el => { el.style.width = el.dataset.w + '%'; }); }

init();
