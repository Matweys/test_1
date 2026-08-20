/* Quiz A — « hier soir à l'antenne » */
window.QUIZ_DATA = {
  questions: [
    {
      text: "On vous dit : « Ce qui s'est passé hier soir à l'antenne a choqué toute la France. » Votre premier mouvement ?",
      options: [
        { letter: "A", text: "Je cherche ce qui a vraiment été dit, pas le résumé alarmiste." },
        { letter: "B", text: "Je note déjà l'exagération : « toute la France », vraiment ?" },
        { letter: "C", text: "Je regarde d'abord comment les autres réagissent autour de moi." },
        { letter: "D", text: "Je me demande si ça change quelque chose concrètement pour moi." },
      ],
    },
    {
      text: "Un message arrive sans contexte, juste cette phrase. Vous…",
      options: [
        { letter: "A", text: "Demandez le replay ou une source fiable." },
        { letter: "B", text: "Répondez en questionnant le ton de la phrase." },
        { letter: "C", text: "Laissez reposer. Vous y reviendrez peut-être demain." },
        { letter: "D", text: "Rangez ça dans « à vérifier si besoin » et passez à autre chose." },
      ],
    },
    {
      text: "La conversation de groupe s'emballe. Vous êtes plutôt du genre à…",
      options: [
        { letter: "A", text: "Poster un lien clair, si vous en avez trouvé un." },
        { letter: "B", text: "Rappeler que le titre et le fond, ce n'est pas la même chose." },
        { letter: "C", text: "Lire en silence et attendre que la poussière retombe." },
        { letter: "D", text: "Couper les notifs si ça devient trop bruyant." },
      ],
    },
    {
      text: "Plus tard, l'émission s'avère moins spectaculaire que le buzz. Votre réaction habituelle ?",
      options: [
        { letter: "A", text: "Vous ajustez ce que vous en pensiez, sans drame." },
        { letter: "B", text: "Vous vous dites que le packaging avait fait le travail." },
        { letter: "C", text: "Vous êtes content d'avoir attendu avant de vous emballer." },
        { letter: "D", text: "Peu importe — ça n'avait aucun impact pratique." },
      ],
    },
    {
      text: "La prochaine fois qu'une « nuit choc à l'antenne » fait le tour des fils, vous…",
      options: [
        { letter: "A", text: "Allez d'abord à la source originale." },
        { letter: "B", text: "Pesez chaque mot du titre avant de croire." },
        { letter: "C", text: "Observez le climat, puis vous formez un avis." },
        { letter: "D", text: "Filtrez : utile pour vous, ou simple bruit ?" },
      ],
    },
  ],
  profiles: {
    A: {
      eyebrow: "Profil 1 sur 4",
      title: "Chercheur de contexte",
      desc: "Avant de vous indigner, vous voulez savoir ce qui a réellement été dit à l'antenne. Le buzz vous intéresse moins que le fond.",
      strengths: "Curiosité, patience, résistance aux résumés tronqués.",
      tip: "Gardez une habitude simple : deux minutes pour la source, ensuite seulement vous réagissez.",
    },
    B: {
      eyebrow: "Profil 2 sur 4",
      title: "Lecteur de formulation",
      desc: "Vous entendez d'abord comment la phrase est construite. « Toute la France » vous met déjà la puce à l'oreille.",
      strengths: "Oreille fine, sens du détail, scepticisme utile.",
      tip: "Une question discrète suffit souvent : « Qu'est-ce qui est exactement affirmé ici ? »",
    },
    C: {
      eyebrow: "Profil 3 sur 4",
      title: "Observateur posé",
      desc: "Vous laissez d'abord le bruit circuler. L'avis vient après, quand la température retombe.",
      strengths: "Calme, distance, bon timing.",
      tip: "Remarquez les moments où ne rien dire vaut mieux qu'une réaction à chaud.",
    },
    D: {
      eyebrow: "Profil 4 sur 4",
      title: "Filtre pratique",
      desc: "Vous tranchez vite : est-ce que ça touche votre journée, ou c'est juste du spectacle médiatique ?",
      strengths: "Efficacité, limites claires, sens des priorités.",
      tip: "Une seule question : « Est-ce que ça change quelque chose pour moi aujourd'hui ? » Si non, vous avancez.",
    },
  },
};
