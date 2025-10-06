const votes = {
    javascript : 0,
    Python : 0,
    Java : 0
};

function vote(language){
      votes[language]++;
      updateVotes();
}

function updateVotes(){
    document.getElementById('js-count').textContent = votes.javascript;
    document.getElementById('py-count').textContent = votes.python;
    document.getElementById('js-count').textContent = votes.java;
}

setInterval(() => {
        const language = ['javaScript', 'python', 'java'];
        const randomLanguage = language[Math.floor(Math.random() * language.length)];
        votes[randomLanguage]++;
        updateVotes();
    }, 3000);   