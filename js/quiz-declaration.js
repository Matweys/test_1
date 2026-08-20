/* Quiz B — « déclaration d'aujourd'hui » */
window.QUIZ_DATA = {
  questions: [
    {
      text: "On vous dit que « tout le monde a été choqué par la déclaration d'aujourd'hui ». Votre réflexe ?",
      options: [
        { letter: "A", text: "Je veux la citation exacte, pas l'écho." },
        { letter: "B", text: "Je me méfie déjà du « tout le monde »." },
        { letter: "C", text: "Je regarde d'abord le climat autour de moi." },
        { letter: "D", text: "Je vérifie si ça m'oblige à faire quoi que ce soit." },
      ],
    },
    {
      text: "La déclaration arrive en une ligne, sans date ni interlocuteur. Vous…",
      options: [
        { letter: "A", text: "Cherchez qui a parlé, où, et dans quel cadre." },
        { letter: "B", text: "Repérez les mots trop larges (« choqué », « tout le monde »)." },
        { letter: "C", text: "Attendez une seconde source avant de commenter." },
        { letter: "D", text: "Classez ça en « bruit du jour » jusqu'à preuve contraire." },
      ],
    },
    {
      text: "Au bureau ou en famille, le sujet monopolise la table. Vous…",
      options: [
        { letter: "A", text: "Récapitulez calmement ce qui a été dit, si vous le savez." },
        { letter: "B", text: "Signalez que le résumé et la déclaration, ce n'est pas pareil." },
        { letter: "C", text: "Écoutez. Vous n'avez pas besoin de prendre position tout de suite." },
        { letter: "D", text: "Changez de sujet si ça n'aide personne." },
      ],
    },
    {
      text: "En fin de journée, la déclaration s'avère plus banale que le titre. Vous…",
      options: [
        { letter: "A", text: "Mettez à jour votre lecture sans vous fâcher." },
        { letter: "B", text: "Retenez comment le packaging a fonctionné." },
        { letter: "C", text: "Vous dites merci d'avoir attendu." },
        { letter: "D", text: "Vous aviez déjà rangé le dossier." },
      ],
    },
    {
      text: "Demain, une autre « déclaration choc » fera le tour. Votre méthode ?",
      options: [
        { letter: "A", text: "Citation + contexte avant opinion." },
        { letter: "B", text: "Poids des mots avant émotion." },
        { letter: "C", text: "Temps de pose avant jugement." },
        { letter: "D", text: "Impact personnel d'abord, reste ensuite." },
      ],
    },
  ],
  profiles: {
    A: {
      eyebrow: "Profil 1 sur 4",
      title: "Traqueur de citation",
      desc: "Une déclaration ne vous suffit pas en résumé. Vous voulez les mots exacts, le cadre, l'interlocuteur.",
      strengths: "Rigueur, curiosité, goût du détail.",
      tip: "Gardez un réflexe : « Qui a dit quoi, exactement ? » avant de partager.",
    },
    B: {
      eyebrow: "Profil 2 sur 4",
      title: "Détecteur d'emphase",
      desc: "« Tout le monde », « choqué », « aujourd'hui » : vous entendez d'abord l'amplification.",
      strengths: "Sens critique, attention au langage, distance utile.",
      tip: "Remplacez mentalement le titre par une version neutre. Souvent, l'effet s'évapore.",
    },
    C: {
      eyebrow: "Profil 3 sur 4",
      title: "Spectateur patient",
      desc: "Vous n'avez pas besoin d'avoir un avis dans la demi-heure. Vous regardez, puis vous décidez.",
      strengths: "Sang-froid, écoute, timing.",
      tip: "Donnez-vous une règle : pas de commentaire public avant une deuxième source.",
    },
    D: {
      eyebrow: "Profil 4 sur 4",
      title: "Tri sélectif",
      desc: "Vous filtrez vite. Si la déclaration ne change rien à votre journée, elle perd sa priorité.",
      strengths: "Focus, limites, pragmatisme.",
      tip: "Posez la question : « Est-ce que je dois agir ? » Sinon, laissez le fil défiler.",
    },
  },
};
