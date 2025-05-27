
let current = 1;
let team = '';

function selectTeam(color) {
  team = color;
  document.querySelector('.team-selection').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  document.querySelectorAll('.question').forEach(q => q.classList.remove('active'));
  document.getElementById('q1').classList.add('active');
}

function nextQuestion() {
  if (current < 4) {
    document.getElementById('q' + current).classList.remove('active');
    current++;
    document.getElementById('q' + current).classList.add('active');
  } else {
    showResult();
  }
}

document.querySelectorAll('.qcm-option').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
  });
});

function showResult() {
  document.getElementById('quiz').classList.add('hidden');
  const answers = document.querySelectorAll('.qcm-option.selected');

  if (answers.length === 0) {
    document.getElementById('result').innerHTML = '<h2>Aucune réponse sélectionnée.</h2><p>Veuillez répondre aux questions pour voir votre score.</p><button onclick="location.reload()">Recommencer</button>';
    document.getElementById('result').classList.remove('hidden');
    return;
  }

  let score = 0;
  answers.forEach(ans => score += parseInt(ans.dataset.value));

  const percent = Math.round((score / 10) * 100);
  let feedback = `<h2>Résultat : ${percent}% de bonnes réponses</h2>`;

  if (score === 10) {
    let message = {
      green: 'Mot de votre énigme : <strong>Operating</strong>',
      yellow: 'Mot de votre énigme : <strong>System to</strong>',
      red: 'Mot de votre énigme : <strong>Lift up</strong>',
      blue: 'Mot de votre énigme : <strong>Our<br>World</strong>'
    };
    feedback += `<p>Bravo ! Toutes les réponses sont justes.</p><div class="team-feedback">${message[team]}</div>`;
  } else {
    feedback += `<p>Vous pouvez recommencer pour tenter d’améliorer votre score.</p><button onclick="location.reload()">Recommencer</button>`;
  }

  feedback += `
    <h3>Corrigé et ressources :</h3>
    <ul>
      <li><strong>Domaine PIX :</strong> <a class="link" href="https://pix.unilim.fr/wp-content/uploads/sites/28/2018/06/Referentiel-Vue_generale-Referentiels-PIX-2018-04-04.pdf" target="_blank">Référentiel</a></li>
      <li><strong>IA & Texte :</strong> <a class="link" href="https://www.perplexity.ai/search/comment-reperer-un-texte-ecrit-3BPU1KpxTiK1phudih21Mg" target="_blank">Reconnaître un texte d’IA</a></li>
      <li><strong>Créer avec IA :</strong>
        <a class="link" href="https://www.perplexity.ai/search/quelle-ia-pour-generer-des-ima-55CF2caaSdexJ1kyun7S3g" target="_blank">Images gratuites</a> -
        <a class="link" href="https://www.wooclap.com/fr/quiz-wizard/" target="_blank">Quiz Wizard</a> -
        <a class="link" href="https://fr.vittascience.com/ia/" target="_blank">Vittascience</a>
      </li>
      <li><strong>Compétences humaines & IA :</strong>
        <a class="link" href="https://www.intelligence-artificielle-school.com/alternance-et-entreprises/les-secteurs-impactes/" target="_blank">Métiers impactés</a> -
        <a class="link" href="https://www.jobillico.com/blog/5-competences-que-lintelligence-artificielle-ne-pourra-jamais-remplacer/" target="_blank">Compétences irremplaçables</a> -
        <a class="link" href="https://www.youtube.com/watch?v=y2a2ItHVz0A" target="_blank">IA au service de la personne</a>
      </li>
    </ul>`;

  document.getElementById('result').innerHTML = feedback;
  document.getElementById('result').classList.remove('hidden');
}
