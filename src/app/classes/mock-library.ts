import {Epoc} from './epoc';
import {Content} from './contents/content';
import {Chapter} from './contents/chapter';
import {Assessment, SimpleQuestion} from './contents/assessment';
import {Html} from './contents/html';
import {Video} from './contents/video';


const ZRRContents: (Content | Chapter | Assessment | Html | Video | SimpleQuestion)[] = [
    {
        id: 'a',
        type: 'chapter',
        name: 'Qu\'est-ce que le dispositif de PPST ? (protection du Potentiel Scientifique et Technique de la Nation)',
        image: 'assets/demo/ZRR/zrr-ppst-security.jpg',
        number: '1',
        objectives: ['Apprendre un truc']
    },
    {
        id: 'b',
        type: 'video',
        name: 'Dispositif PPST',
        source: 'assets/demo/ZRR/zrr-inrto.mp4ideo.mp4',
        subtitles: 'assets/demo/VP/soustitre-chapitre-1.vtt',
        summary: 'Qu\'est-ce que le dispositif de PPST (protection du Potentiel Scientifique et Technique de la Nation). ' +
            'Pourquoi toutes ces précautions ? Ce dispositif, est-il nouveau ? Quels sont les risques et comment ça fonctionne ? ' +
            'Les réponses dans cette vidéo.',

    },
    {
        id: 'c',
        type: 'html',
        name: 'Règlement intérieur',
        value: '<h4>Ce que dit le règlement intérieur : </h4>' +
            '<p>Les Zones à Régime Restrictif (ZRR dans le reste du document) constituent l\'un des outils de la PPST ' +
            '(Protection du Potentiel Scientifique et Technique)</p><ul>' +
            '<li>' +
            'Il s\'agit de zones visant à protéger des <strong>éléments essentiels</strong> du potentiel scientifique et technique de ' +
            'la Nation de captations indues. Les ZRR sont créées par Arrêté du Ministre en charge de l\'Enseignement Supérieur et ' +
            'de la Recherche.' +
            '</li>' +
            '<li>' +
            'Les ZRR sont des lieux clos dont l\'accès et la circulation sont règlementés afin d\'assurer la ' +
            'protection des installations, du matériel ou du secret des recherches, études ou fabrication.' +
            '</li>' +
            '</ul>',

    },
    {
        id: 'd',
        type: 'html',
        name: 'A retenir',
        value: '<h4>Ce qu\'il faut retenir :</h4>' +
            '<ul>' +
            '<li>' +
            'Les recherches scientifiques qui sont faites à l\'Inria sont protégées par le dispositif de protection du potentiel ' +
            'scientifique et technique (PPST). La liste des secteurs scientifiques et techniques protégés est publiée dans le ' +
            '<a href="https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000026140136&categorieLien=id" target="_blank">' +
            'journal officiel' +
            '</a>' +
            '</li>' +
            '<li>' +
            'Ce dispositif, qui dans sa version actuelle date de 2012, mais qui existe en fait depuis la fin de la 2ème guerre mondiale, ' +
            'sert à se protéger contre des menaces de puissances étrangères qui cherchent à s\'emparer de nos productions scientifiques ' +
            'les plus sensibles (par exemple, celles qui peuvent concerner la défense nationale)' +
            '</li>' +
            '<li>' +
            'La mise en place du dispositif de PPST se matérialise par la création de Zones à Régime Restrictif (ZRR) qui protègent ' +
            'les recherches particulièrement sensibles.' +
            '</li>' +
            '</ul>',

    },
    {
        id: 'e',
        type: 'assessment',
        name: 'Quiz non noté',
        summary: 'Quiz de compréhension (non noté) lié à la video "Dispositif PPST".',
        items: [
            {
                type: 'drag-and-drop',
                score: 0,
                statement: '',
                label: 'Quelles sont les données qui peuvent être récupérées par notre smartphone ' +
                    'dans le monde physique et le monde virtuel ?',
                responses: [
                    {
                        label: 'Localisation',
                        value: 'A'
                    },
                    {
                        label: 'Empreinte digitale',
                        value: 'B'
                    },
                    {
                        label: 'Reconnaissance faciale',
                        value: 'C'
                    },
                    {
                        label: 'Rythme cardiaque',
                        value: 'D'
                    },
                    {
                        label: 'Nombre de pas par jour',
                        value: 'I'
                    },
                    {
                        label: 'Recherche web',
                        value: 'E'
                    },
                    {
                        label: 'Contact',
                        value: 'F'
                    },
                    {
                        label: 'Temps passé dans une application',
                        value: 'G'
                    },
                    {
                        label: 'Données de formulaire',
                        value: 'H'
                    }
                ],
                correctResponse: [
                    {label: 'Monde physique', values: ['A', 'B', 'C', 'D', 'I']},
                    {label: 'Monde virtuel', values: ['E', 'F', 'G', 'H']}
                ],
                explanation: '' +
                    'Bien que toutes les équipes ne soient pas en ZRR, tous les secteurs de recherche Inria sont potentiellement ' +
                    'sensibles et donc protégés.'
            },
            {
                type: 'choice',
                score: 0,
                statement: '',
                label: 'Quels sont les secteurs scientifiques protégés ?',
                responses: [
                    {
                        label: 'les recherches qui sont liées uniquement aux projets concernant la défense nationale',
                        value: 'A'
                    },
                    {
                        label: 'les recherches qui ne sont liées qu\'aux domaines de l\'informatique',
                        value: 'B'
                    },
                    {
                        label: 'toutes les recherches qui sont effectués à l\'Inria',
                        value: 'C'
                    }
                ],
                correctResponse: 'C',
                explanation: '' +
                    'Bien que toutes les équipes ne soient pas en ZRR, tous les secteurs de recherche Inria sont potentiellement ' +
                    'sensibles et donc protégés.'
            }
        ],

    },
    {
        id: 'f',
        type: 'chapter',
        name: 'Les risques PPST',
        number: '2'
    },
    {
        id: 'g',
        type: 'video',
        name: 'Les 4 risques PPST',
        source: 'assets/demo/ZRR/zrr-inrto.mp4ideo.mp4',
        subtitles: 'assets/demo/VP/soustitre-chapitre-1.vtt',
        summary: 'Au cours de cette vidéo nous verrons les différents risques PPST',

    },
    {
        id: 'h',
        type: 'html',
        name: 'Règlement intérieur',
        value: '<h4>Autorisations : </h4>' +
            '<p>' +
            'Chez Inria, le Chef de la ZRR est le Directeur du Centre de Recherche Inria où la ZRR est localisée et le coordinateur de ' +
            'la PPST (CPPST) est le Délégué à l\'Administration du Centre de Recherche Inria où la ZRR est localisée. Le CPPST est ' +
            'spécialement chargé de la préparation et de l\'exécution des mesures de\n' +
            'protection. Il veille à l\'application des procédures.' +
            '<p>' +
            'Il existe deux types d\'autorisation d\'accès à une ZRR :' +
            '</p>' +
            '<ul>' +
            '<li>' +
            'autorisation d\'accès régulier : Elle est engagée par un personnel permanent d\'Inria et autorisée par le FSD ' +
            '(Fonctionnaire Sécurité Défense) par délégation du PDG d\'Inria' +
            '</li>' +
            '<li>' +
            'autorisation d\'accès ponctuel : l\'autorisation d\'accès ponctuel est délivrée par le chef de la ZRR ou le CPPST ' +
            'à un visiteur de courte durée (- de 5 jours)' +
            '</li>' +
            '</ul>',

    },
    {
        id: 'i',
        type: 'html',
        name: 'A retenir',
        value: '<h4>Ce qu\'il faut retenir :</h4>' +
            '<p>' +
            'Les recherches scientifiques qui sont faites à l\'Inria sont protégées par le dispositif de protection du potentiel ' +
            'scientifique et technique (PPST). La liste des secteurs scientifiques et techniques protégés est publiée dans le ' +
            '<a href="https://www.legifrance.gouv.fr/affichTexte.do?cidTexte=JORFTEXT000026140136&categorieLien=id" target="_blank">' +
            'journal officiel' +
            '</a>' +
            '</li>' +
            '<li>' +
            'Ce dispositif, qui dans sa version actuelle date de 2012, mais qui existe en fait depuis la fin de la 2ème guerre mondiale, ' +
            'sert à se protéger contre des menaces de puissances étrangères qui cherchent à s\'emparer de nos productions scientifiques ' +
            'les plus sensibles (par exemple, celles qui peuvent concerner la défense nationale)' +
            '</li>' +
            '<li>' +
            'La mise en place du dispositif de PPST se matérialise par la création de Zones à Régime Restrictif (ZRR) qui protègent ' +
            'les recherches particulièrement sensibles.' +
            '</li>' +
            '</p>',

    },
    {
        id: 'j',
        type: 'assessment',
        name: 'Quiz non noté',
        summary: 'Quiz de compréhension (non noté) lié à la video "Les 4 risques PPST".',
        items: [
            {
                type: 'choice',
                score: 0,
                statement: 'Les recherches "à caractère sensibles" qui sont faites dans les équipes projets.',
                label: 'Pourquoi sont-elles protégées ?',
                responses: [
                    {
                        label: 'elles sont uniques et ne doivent pas être diffusées en dehors de l\'Inria',
                        value: 'A'
                    },
                    {
                        label: 'elles peuvent, si elles sont volées,  nuires aux intérêts de la nation.',
                        value: 'B'
                    },
                    {
                        label: 'elles peuvent être mises en danger par la nature de leurs publications',
                        value: 'C'
                    }
                ],
                correctResponse: 'B',
                explanation: ''
            }
        ],

    },
    {
        id: 'k',
        type: 'chapter',
        name: 'Accès aux données sensibles, accueil des visiteurs et sanctions',
        number: '3'
    },
    {
        id: 'l',
        type: 'video',
        name: 'Données sensibles, visiteurs et sanctions',
        source: 'assets/demo/ZRR/zrr-inrto.mp4ideo.mp4',
        subtitles: 'assets/demo/VP/soustitre-chapitre-1.vtt',
        summary: 'Accès aux données sensibles, accueil des visiteurs et sanctions',

    },
    {
        id: 'm',
        type: 'html',
        name: 'Règlement intérieur',
        value: '<h4>Autorisations : </h4>' +
            '<p></p>',

    },
    {
        id: 'n',
        type: 'html',
        name: 'A retenir',
        value: '<h4>Ce qu\'il faut retenir :</h4>' +
            '<p></p>',

    },
    {
        id: 'o',
        type: 'assessment',
        name: 'Quiz non noté',
        summary: 'Quiz de compréhension (non noté) lié à la video "Accès aux données sensibles, accueil des visiteurs et sanctions".',
        items: [
            {
                type: 'choice',
                score: 0,
                statement: 'Les recherches "à caractère sensibles" qui sont faites dans les équipes projets.',
                label: 'Pourquoi sont-elles protégées ?',
                responses: [
                    {
                        label: 'elles sont uniques et ne doivent pas être diffusées en dehors de l\'Inria',
                        value: 'A'
                    },
                    {
                        label: 'elles peuvent, si elles sont volées,  nuires aux intérêts de la nation.',
                        value: 'B'
                    },
                    {
                        label: 'elles peuvent être mises en danger par la nature de leurs publications',
                        value: 'C'
                    }
                ],
                correctResponse: 'B',
                explanation: ''
            }
        ],

    },
    {
        id: 'p',
        type: 'chapter',
        name: 'Echelle de sensibilité',
        number: '4'
    },
    {
        id: 'q',
        type: 'video',
        name: 'Echelle de sensibilité',
        source: 'assets/demo/ZRR/zrr-inrto.mp4ideo.mp4',
        subtitles: 'assets/demo/VP/soustitre-chapitre-1.vtt',
        summary: 'Entretien à propos de l\'échelle de sensibilité',

    },
    {
        id: 'r',
        type: 'assessment',
        name: 'Quiz noté: Test final',
        summary: 'Quiz de compréhension (non noté) lié à la video "Accès aux données sensibles, accueil des visiteurs et sanctions".',
        items: [
            {
                type: 'reorder',
                score: 40,
                statement: 'Trier du moins important au plus important les impacts suivants :',
                label: 'Classification des impacts',
                responses: [
                    {
                        label: 'Diffusion restreinte',
                        value: 'A'
                    },
                    {
                        label: 'Confidentiel',
                        value: 'B'
                    },
                    {
                        label: 'Public',
                        value: 'C'
                    },
                    {
                        label: 'Diffusion limitée',
                        value: 'D'
                    },
                ],
                correctResponse: 'CBDA'
            },
            {
                type: 'multiple-choice',
                score: 20,
                statement: '',
                label: 'Qui a participé au développment de cette app  ?',
                responses: [
                    {
                        label: 'Laurence',
                        value: 'A'
                    },
                    {
                        label: 'Benoit',
                        value: 'B'
                    },
                    {
                        label: 'Jean-Marc',
                        value: 'C'
                    }
                ],
                correctResponse: ['B', 'C']
            },
            {
                type: 'choice',
                score: 40,
                statement: 'Les recherches "à caractère sensibles" qui sont faites dans les équipes projets.',
                label: 'Pourquoi sont-elles protégées ?',
                responses: [
                    {
                        label: 'elles sont uniques et ne doivent pas être diffusées en dehors de l\'Inria',
                        value: 'A'
                    },
                    {
                        label: 'elles peuvent, si elles sont volées,  nuires aux intérêts de la nation.',
                        value: 'B'
                    },
                    {
                        label: 'elles peuvent être mises en danger par la nature de leurs publications',
                        value: 'C'
                    }
                ],
                correctResponse: 'B',
                explanation: ''
            }
        ],

    }
];

const VPContents: (Content | Chapter | Assessment | Html | Video | SimpleQuestion)[] = [
    {
        id: 'a',
        type: 'chapter',
        name: 'Pourquoi le smartphone intéresse-t-il tant ?',
        image: 'assets/demo/VP/vp-chapitre-1.png',
        number: '1',
        objectives: ['Identifier des données collectées sur notre portable']
    },
    {
        id: 'b',
        type: 'simple-question',
        name: 'Selon vous ?',
        question: {
            type: 'choice',
            score: 0,
            statement: '',
            label: 'Est-ce que votre smartphone récupère de l’information sur vous dans le monde physique (les déplacements, les paramètres biologiques etc.) ? ',
            responses: [
                {
                    label: 'Oui',
                    value: 'A'
                },
                {
                    label: 'Non',
                    value: 'B'
                }
            ],
            correctResponse: 'A',
            explanation: '<p>La récupération de l’information dans le monde physique est devenue une fonctionnalité incluse dans les smartphones, donc la bonne réponse est oui.</p>' +
                '<p>La question sur vos données personnelles et les autorisations que vous pouvez attribuer aux applications sera vue dans les prochains modules.</p>'
        }
    },
    {
        id: 'c',
        type: 'video',
        name: 'Les données',
        source: 'assets/demo/VP/vp-chapitre-1.mp4',
        subtitles: '',
        summary: '<p>Pourquoi nos assistants personnels, smartphones et tablettes, sont-ils devenus tout naturellement, en une dizaine d\'années seulement, un point de collecte majeur de données personnelles.</p>' +
            '<p>Pourquoi le smartphone intéresse-t-il tant de monde ?</p>' +
            '<p>Regarder cette vidéo pour en savoir plus !</p>',

    },
    {
        id: 'e',
        type: 'assessment',
        name: 'Quiz noté',
        summary: 'Questionnaire noté de fin de chapitre 1.',
        items: [
            {
                type: 'drag-and-drop',
                score: 100,
                statement: '',
                label: 'Quelles sont les données qui peuvent être récupérées par notre smartphone ' +
                    'dans le monde physique et le monde virtuel ?',
                responses: [
                    {
                        label: 'Localisation',
                        value: 'A'
                    },
                    {
                        label: 'Empreinte digitale',
                        value: 'B'
                    },
                    {
                        label: 'Reconnaissance faciale',
                        value: 'C'
                    },
                    {
                        label: 'Rythme cardiaque',
                        value: 'D'
                    },
                    {
                        label: 'Nombre de pas par jour',
                        value: 'I'
                    },
                    {
                        label: 'Recherche web',
                        value: 'E'
                    },
                    {
                        label: 'Contact',
                        value: 'F'
                    },
                    {
                        label: 'Temps passé dans une application',
                        value: 'G'
                    },
                    {
                        label: 'Données de formulaire',
                        value: 'H'
                    }
                ],
                correctResponse: [
                    {label: 'Monde physique', values: ['A', 'B', 'C', 'D', 'I']},
                    {label: 'Monde virtuel', values: ['E', 'F', 'G', 'H']}
                ],
                explanation: '<p>C\'est bien là un des aspects clefs de nos smartphones : étant toujours connectés, toujours avec nous, disposant de multiples capteurs ils récupèrent des données.</p><p>Pour un monde physique cela se réalise à travers une caméra, GPS, capteur d’empreintes, capteurs de rythme cardiaque et les autres outils. Pour un monde virtuel c’est souvent à travers des formulaires à remplir et au travers de notre activité dans les applications que l’information est récoltée.</p>'
            },
            {
                type: 'choice',
                score: 100,
                statement: '"Le smartphone permet de suivre les utilisateurs dans le monde physique, faisant ainsi pour la première fois le lien entre les activités sur Internet et les activités dans le monde physique."',
                label: 'Cette phrase vous parait-elle :',
                responses: [
                    {
                        label: 'Correspondre tout à fait à la réalité ',
                        value: 'A'
                    },
                    {
                        label: 'Être largement abusive',
                        value: 'B'
                    }
                ],
                correctResponse: 'A',
                explanation: '<p>En étant toujours avec vous, un smartphone pourra : vous localiser (à moins de bloquer les autorisations associées), savoir que vous être proche d\'un magasin vendant des articles susceptibles de vous intéresser (car vous avez fait des recherches à ce sujet sur votre navigateur), et donc créer une passerelle entre Internet et monde physique. </p>'
            }
        ],

    },
    {
        id: 'f',
        type: 'chapter',
        name: 'L\'écosystème autour des applications pour smartphones',
        image: 'assets/demo/VP/vp-chapitre-2.png',
        number: '2',
        objectives: ['Identifier les acteurs de cet écosystème autour des applications et leurs fonctions']
    },
    {
        id: 'n',
        type: 'video',
        name: 'Écosystème autour d’une application',
        source: 'assets/demo/VP/vp-chapitre-2.1.mp4',
        subtitles: '',
        summary: 'Résumé de la vidéo Ecosystème',

    },
    {
        id: 'o',
        type: 'assessment',
        name: 'Quiz noté',
        summary: '',
        items: [
            {
                type: 'choice',
                score: 100,
                statement: '',
                label: 'Le développeur d’une application smartphone choisit-il les données personnelles qui seront collectées sur le smartphone des utilisateurs ? ',
                responses: [
                    {
                        label: 'Oui, quand la régie publicitaire leur en fait la demande',
                        value: 'A'
                    },
                    {
                        label: 'Oui, systématiquement, c’est quand même lui le chef',
                        value: 'B'
                    },
                    {
                        label: 'Non, en général',
                        value: 'C'
                    }
                ],
                correctResponse: 'C',
                explanation: '<p>Non. Le développeur inclut un (voire plusieurs) petits logiciels fournis par des régies publicitaires dans son application afin de peut-être avoir un retour financier. Les régies publicitaires étant très discrètes sur la nature des données collectées et la fréquence des collectes, le développeur inclut une boite noire dont il ne sait pas grand chose...</p>'
            },
            {
                type: 'choice',
                score: 100,
                statement: '',
                label: 'L’annonceur collecte-t-il des données à caractère personnel des utilisateurs de smartphones ? ',
                responses: [
                    {
                        label: 'Oui ',
                        value: 'A'
                    },
                    {
                        label: 'Non',
                        value: 'B'
                    },
                    {
                        label: 'Oui, la régie publicitaire lui transmet toutes les données collectées sur l’utilisateur',
                        value: 'C'
                    }
                ],
                correctResponse: 'B',
                explanation: '<p>Non. L\'annonceur est bien sûr fortement impliqué dans l\'écosystème puisqu\'il en sera souvent le financeur. ' +
                    'En revanche l\'annonceur n\'est pas concerné par la phase de collecte menée par la régie publicitaire. ' +
                    'Lors de la phase d\'enchère en temps réel, l\'annonceur obtient uniquement de la régie publicitaire un profil utilisateur  ' +
                    '(que l\'on peut espérer anonyme mais il est difficile d\'être affirmatif du fait du manque de transparence). </p>'
            },
            {
                type: 'multiple-choice',
                score: 100,
                statement: '',
                label: 'De quelle(s) façon(s) la régie publicitaire intervient-t-elle dans le traitement des données à caractère personnel d’un utilisateur de smartphone ? (une ou plusieurs réponses possibles) ',
                responses: [
                    {
                        label: 'Elle utilise les données personnelles que lui transmettent les développeurs d’applications',
                        value: 'A'
                    },
                    {
                        label: 'Elle collecte les données personnelles de l’utilisateur au travers des applications où elle est présente',
                        value: 'B'
                    },
                    {
                        label: 'Elle génère de nouvelles données à caractère personnel lors de l’affinement des profils utilisateurs au moyen des données brutes',
                        value: 'C'
                    },
                    {
                        label: 'Elle crée des messages publicitaires à partir des données personnelles collectées',
                        value: 'D'
                    },
                    {
                        label: 'Elle déclenche l’affichage du message publicitaire de l’annonceur qui a remporté l’enchère',
                        value: 'E'
                    }
                ],
                correctResponse: ['B', 'C', 'E'],
                explanation: '<p>- la proposition a. est fausse, le développeur ne transmet rien à la régie publicitaire ; </p>' +
                    '<p>- la proposition b. est exacte, puisque c\'est le rôle de la régie de collecter des données des utilisateurs. ' +
                    'Elle ne peut le faire qu\'au travers des applications qui intègrent son module de traçage ;</p>' +
                    '<p>- la proposition d. est exacte, et c\'est le travail de la régie que d\'interpréter les données des utilisateurs pour en créer des profils utilisateurs ' +
                    '(catégorie, classe d’âge, centrer d\intérêt, etc.) ;</p>' +
                    '<p>- la proposition e. est fausse, la régie ne forge en aucun cas des messages publicitaires, ce n\'est pas son rôle ;</p>' +
                    '<p>- la proposition f. est exacte, et c\'est par ce biais (déclenchement de l\'affichage de la publicité sur le smartphone) que la régie se rémunère</p>'
            }
        ]
    },
    {
        id: 'p',
        type: 'html',
        name: 'A retenir',
        value: '<h4>Ce qu\'il faut retenir :</h4>' +
            '<p>Le premier travail de la régie publicitaire est d\'exploiter les données personnelles brutes collectées et transmises par toutes les applications du smartphone de l\'utilisateur ' +
            'où elle est présente afin de créer un profil. Dans ce travail de collecte, il n\'y a bien sûr aucune génération de données, toutes les informations étant bel et bien générées sur ' +
            'le smartphone de l\'utilisateur, au quotidien.</p>' +
            '<p>Dans la phase de profilage qui suit, il y a par contre une interprétation des données et création de données supplémentaires (par ex. cet utilisateur est intéressé par les articles ' +
            'de mode). Ces données de profilage, absentes du smartphone, résultent d\'un travail d\'analyse, et étant associées à une personne physique, il s\'agit bien de données personnelles.</p>' +
            '<p>C\'est ce profil qui permet aux annonceurs de sélectionner s\'il est ou non pertinent d\'afficher un message publicitaire, d\'où la notion de publicité ciblée.</p>' +
            '<p>Enfin, la régie publicitaire étant à l\'interface entre annonceurs et smartphones, elle déclenche bien sûr l\'affichage du message publicitaire du gagnant de l\'enchère.</p>',

    },
    {
        id: 'q',
        type: 'video',
        name: 'Exemple des régies publicitaires ',
        source: 'assets/demo/VP/vp-chapitre-2.2.mp4',
        subtitles: '',
        summary: 'Pour aller plus loin : exemple des régies publicitaires',

    },
    {
        id: 'r',
        type: 'simple-question',
        name: 'Selon vous ?',
        question: {
            type: 'choice',
            score: 0,
            statement: '',
            label: 'Quelle est la durée d’une vidéo d’un pétaoctet ? (Nous considérons un débit de 3Go/h pour une vidéo Full HD en streaming) ',
            responses: [
                {
                    label: '38 années',
                    value: 'A'
                },
                {
                    label: '10 années',
                    value: 'B'
                },
                {
                    label: '15 années',
                    value: 'C'
                }
            ],
            correctResponse: 'A',
            explanation: '<p>Nous comptons 3Go par heure pour une vidéo en Full HD. Donc : <ul>' +
                '<li>1Po = 1 000 000 Go / 3 = 333 333 heures</li>' +
                '<li>Soit 333 333 / 24 = 13 888 jours</li>' +
                '<li>Soit 13 888 / 365 = 38 années.</li>' +
                '</ul></p>'
        },

    },
    {
        id: 'g',
        type: 'chapter',
        name: 'Gratuité contre publicité ciblée : où est le problème ?',
        image: 'assets/demo/VP/vp-chapitre-3.jpg',
        number: '3',
        objectives: ['Découvrir des problèmes de fond du modèle économique']
    },
    {
        id: 's',
        type: 'simple-question',
        name: 'Selon-vous',
        question: {
            type: 'choice',
            score: 0,
            statement: '',
            label: 'Qu’est-ce que la phrase « si c\'est gratuit, c\'est que c\'est vous le produit » veut dire :',
            responses: [
                {
                    label: 'Vous « payez » avec vos données personnelles ',
                    value: 'A'
                },
                {
                    label: 'Il y a quelqu’un d’autre qui paie derrière vous ',
                    value: 'B'
                },
                {
                    label: 'La gratitude de l’application peut être expliqué comme une stratégie du marketing, vous ne donnez aucune donnée ',
                    value: 'C'
                }
            ],
            correctResponse: 'A',
            explanation: '<p>Il faut être clair, si les services et applications de grande qualité que nous utilisons sont gratuits ou très peu coûteux, ' +
                'c\'est grâce au modèle économique sous-jacent qui est essentiellement basé sur la publicité ciblée. </p>' +
                '<p>L\'annonceur va payer à la place de l\'utilisateur. Et puisque l\'on parle de publicité ciblée, c\'est-à-dire une publicité qui a une probabilité élevée d\'intéresser ' +
                'l\'utilisateur, c\'est que nécessairement en amont on a réussi à percer les centres d\'intérêt de l\'utilisateur, c\'est la notion de profilage des utilisateurs. </p>'
        },

    },
    {
        id: 't',
        type: 'video',
        name: '3 problèmes majeurs du modèle économique ',
        source: 'assets/demo/VP/vp-chapitre-3.mp4',
        subtitles: '',
        summary: 'Résumé de la vidéo',

    },
    {
        id: 'u',
        type: 'assessment',
        name: 'Quiz noté',
        summary: 'Résumé quiz',
        items: [
            {
                type: 'drag-and-drop',
                score: 100,
                statement: '',
                label: 'Complexité de l’écosystème : Faites glisser les acteurs d’écosystème à leur niveau correspondant :',
                responses: [
                    {
                        label: 'Les régies publicitaires',
                        value: 'A'
                    },
                    {
                        label: 'L\'éditeur du système d\'exploitation (Google ou Apple)',
                        value: 'B'
                    },
                    {
                        label: 'Le gestionnaire du marché d\'applications',
                        value: 'C'
                    },
                    {
                        label: 'Les annonceurs',
                        value: 'D'
                    },
                    {
                        label: 'Les éditeurs et les développeurs d\'applications',
                        value: 'E'
                    },
                    {
                        label: 'Le gestionnaire du marché',
                        value: 'F'
                    }
                ],
                correctResponse: [
                    {label: 'Écosystème le monde visible les acteurs qui captent des données', values: ['B', 'C', 'E', 'F']},
                    {label: 'Écosystème le monde invisible', values: ['A', 'D']}
                ],
                explanation: '<p> Dans le monde invisible, il faut mettre les régies publicitaires et les annonceurs. ' +
                    'Car ils vont également disposer d\'informations personnelles et à aucun moment l\'utilisateur n\'en connaît l\'identité.' +
                    ' Les autres acteurs correspondent au niveau visible car nous pouvons les facilement identifier.</p>'
            },
            {
                type: 'choice',
                score: 100,
                statement: 'Disproportion des données :',
                label: '« Les données de géolocalisation permettent-elles d\'inférer (c\'est à dire déduire) des données sensibles ? » ',
                responses: [
                    {
                        label: 'Oui',
                        value: 'A'
                    },
                    {
                        label: 'Non',
                        value: 'B'
                    },
                    {
                        label: 'Cela dépend de l’usage des données',
                        value: 'C'
                    }
                ],
                correctResponse: 'A',
                explanation: '<p>Les données de géolocalisation sont des données personnelles porteuses de sens. Un acteur qui collecte de façon précise la localisation d\'un utilisateur ' +
                    'pourra souvent en inférer des données sensibles, c\'est à dire des données qui ne peuvent faire l\'objet d\'aucune collecte ou traitement hormis quelques cas très particuliers.' +
                    'Ce sera le cas par exemple si l\'utilisateur fréquente régulièrement un lieu de culte, un hôpital/clinique ou un médecin spécialisé.</p>' +
                    '<p>Bien d\'autres informations sont accessibles tout aussi facilement, tels les lieux de travail et d\'habitation, les points d\'intérêts, les habitudes de consommation ' +
                    '(fréquentation de centres commerciaux par exemple), ou les loisirs. Ces informations, très personnelles, ne font pas pour autant partie de la catégorie des données sensibles.</p>'
            },
            {
                type: 'choice',
                score: 100,
                statement: 'Disproportion des données :',
                label: '« La législation française interdit elle de façon générale les collectes massives de données personnelles ? »',
                responses: [
                    {
                        label: 'Oui toujours',
                        value: 'A'
                    },
                    {
                        label: 'Non',
                        value: 'B'
                    },
                    {
                        label: 'Cela dépend de l\'objectif poursuivi et du service rendu ',
                        value: 'C'
                    }
                ],
                correctResponse: 'C',
                explanation: '<p>La loi informatique et libertés (et maintenant la RGPD) impose une règle de proportionnalité entre l\'intensité de la collecte et les services rendus.' +
                    'Une collecte massive ne peut être justifiée que si le service l\'exige. Ainsi, s\'il est compréhensible qu\'une application de navigation géolocalise en permanence un utilisateur,' +
                    ' ce ne pourra pas être le cas pour une application où la localisation ne joue qu\'un rôle annexe. Voir : https://www.cnil.fr/cnil-direct/question/496</p>'
            },
            {
                type: 'choice',
                score: 100,
                statement: 'Manque d’information sur la collecte ',
                label: '« Il est 20h et un utilisateur de smartphone utilise une application de cartographie. ' +
                    'Tout à coup son smartphone lui propose un message publicitaire pour un restaurant proche. Il s\'agit d\'un restaurant dont il a horreur (il y est allé il y a quelques temps et ' +
                    'ce fut une expérience traumatisante). Que diriez-vous ? »',
                responses: [
                    {
                        label: 'o   Le système de profilage de l\'utilisateur s\'est bien trompé : la régie publicitaire devrait savoir qu\'il a mis une très mauvaise note à ce restaurant et ' +
                            'qu\'il n\'y est jamais retourné ! Depuis il va au restaurant d\'en face... ',
                        value: 'A'
                    },
                    {
                        label: 'C\'est normal, il s\'agit d\'une publicité contextuelle, pas d\'une publicité ciblée',
                        value: 'B'
                    },
                    {
                        label: 'Le système de profilage travaille sur un profil correspondant à l\'ensemble des utilisateurs qui ont noté le restaurant. Les autres avis devaient être très bons ! ',
                        value: 'C'
                    }
                ],
                correctResponse: 'B',
                explanation: '<p>Une publicité ciblée est basée sur un profil utilisateur. Par exemple une régie publicitaire déclenche l\'affichage d\'une publicité qu\'elle sait correspondre ' +
                    'aux centres d\'intérêts de l\'utilisateur du fait de collectes préalables d\'informations personnelles</p>' +
                    '<p>A l\'inverse, une publicité contextuelle est basée uniquement sur un contexte, par exemple la localisation de cet utilisateur et l\'heure courante. ' +
                    'Un message publicitaire pour un restaurant proche est dans ce cas pertinent du fait du contexte, sans qu\'il y ait recours à un profilage préalable. ' +
                    'Les publicités contextuelles sont plus respectueuses de la vie privée de l\'utilisateur dans ce cas, et même si c\'est un peu agaçant il faut aussi se poser la question de ' +
                    'l\'équilibre économique sous-jacent au service gratuit de cartographie.</p>'
            }
        ],

    },
    {
        id: 'v',
        type: 'html',
        name: 'Un fait pour aller plus loin ',
        value: '<h4>La régie publicitaire InMobi</h4>' +
            '<p>A la mi-2016, la régie publicitaire InMobi a été lourdement sanctionnée aux États Unis, un tout petit peu moins qu’un million de dollars pour avoir agi de façon déloyale : ' +
            'on captait la géolocalisation des jeunes utilisateurs et des moins jeunes également, de façon déloyale, c\'est-à-dire, ni informer, ni demander l\'autorisation et en détournant ' +
            'une autorisation d’Android. </p>' +
            '<p>C\'est d\'ailleurs notre équipe qui a les premiers identifié le problème 2 ans plus tôt. Donc, la question de gratuité contre publicité ciblée est plus compliquée qu\'il n\'y ' +
            'parait et c\'est ce que nous allons creuser.</p>',

    },
    {
        id: 'h',
        type: 'chapter',
        name: 'Données personnelles : Gros plan sur les identifiants techniques',
        image: 'assets/demo/VP/vp-chapitre-4.png',
        number: '4'
    },
    {
        id: 'i',
        type: 'chapter',
        name: 'Contrôle utilisateur',
        image: 'assets/demo/VP/vp-chapitre-5.png',
        number: '5'
    },
    {
        id: 'j',
        type: 'chapter',
        name: 'Contrôle d’utilisateur Apple',
        image: 'assets/demo/VP/vp-chapitre-6.jpg',
        number: '6'
    },
    {
        id: 'k',
        type: 'chapter',
        name: 'Contrôle d’utilisateur Android',
        image: 'assets/demo/VP/vp-chapitre-7.png',
        number: '7'
    },
    {
        id: 'l',
        type: 'chapter',
        name: 'Limites du contrôle utilisateur Apple et Google',
        image: 'assets/demo/VP/vp-chapitre-8.png',
        number: '8'
    },
    {
        id: 'm',
        type: 'chapter',
        name: 'Démo: Exodus Privacy',
        image: 'assets/demo/VP/vp-chapitre-9.png',
        number: '9'
    },
    {
        id: 'x',
        type: 'chapter',
        name: 'Conclusion',
        image: 'assets/demo/VP/vp-chapitre-9.png',
        number: '10'
    }
];

export const MockLibrary: Epoc[] = [
    {
        id: 'VP',
        title: 'Smartphone et vie privée',
        image: 'assets/demo/VP/vp-poster.png',
        teaser: 'assets/demo/VP/vp-intro.mp4',
        authors: [
            {
                name: 'Vincent Roca',
                image: 'assets/demo/VP/vincent-rond.png',
                description: 'I\'m permanent researcher, working at Inria, a French public research institute. Since 2013 I am part of the Privatics Inria research team that focuses on privacy.'
            }
        ],
        summary: '<p>Ce parcours sera dédié à la question du respect de la vie privée lorsque l\'on utilise nos assistants personnels, smartphone ou tablette.</p>' +
            '<p>Tout d\'abord, nous allons nous intéresser aux écosystèmes assez complexes qui se sont mis en place ces dernières années autour des smartphones. Qui sont les acteurs, comme interagissent-ils, qui fait quoi, qui gagne quoi ?</p>' +
            '<p>Nous nous intéresserons bien sûr aux problèmes de perte de contrôle de ces données personnelles, auxquels nous sommes tous confrontes. Où est le problème ? </p>' +
            '<p>C\'est vraiment la question fondamentale. Ceci nous permettra d\'aborder la notion de contrôle utilisateur. Que peut-on faire dans ce contexte, quels sont les outils mis à disposition, que peut-on en dire, est-ce qu\'ils remplissent bien leur mission, est-ce que c\'est juste un leurre ?</p>' +
            '<p>Enfin, il faut rester conscient que la gratuité totale n\'existe pas. </p>',
        objectives: [
            'S\'informer sur l’écosystème autour des applications pour smartphones',
            'Découvrir les problèmes de fond du modèle économique',
            'Comparer la politique de confidentialité sur IOS et Android',
            'D’avoir un regard critique sur le monde numérique des smartphones'
        ],
        parts: [{
            title: 'Smartphone',
            outlineTree: [
                {
                    contentId: 'a',
                    children: [
                        {
                            contentId: 'b'
                        },
                        {
                            contentId: 'c'
                        },
                        {
                            contentId: 'e'
                        }
                    ]
                },
                {
                    contentId: 'f',
                    children: [
                        {
                            contentId: 'n'
                        },
                        {
                            contentId: 'o'
                        },
                        {
                            contentId: 'p'
                        },
                        {
                            contentId: 'r'
                        }
                    ]
                },
                {
                    contentId: 'g',
                    children: [
                        {
                            contentId: 's'
                        },
                        {
                            contentId: 't'
                        },
                        {
                            contentId: 'u'
                        },
                        {
                            contentId: 'v'
                        }
                    ]
                },
                {
                    contentId: 'h'
                }
            ]
        },
            {
                title: 'Mise en pratique',
                outlineTree: [
                    {contentId: 'i', children: []},
                    {contentId: 'j', children: []},
                    {contentId: 'k', children: []},
                    {contentId: 'l', children: []},
                    {contentId: 'm', children: []},
                    {contentId: 'x', children: []}
                ]
            }],
        content: VPContents
    },
    {
        id: 'ZRR',
        title: 'Zone à régime restrictif',
        image: 'assets/demo/ZRR/zrr-intro-poster.jpg',
        teaser: 'assets/demo/ZRR/zrr-intro.mp4',
        authors: [
            {
                name: 'Didier Benza',
                image: 'assets/demo/ZRR/benza.jpg',
                description: 'At autem dignissimos dolorem illum molestias quas quod repudiandae saepe.'
            }
        ],
        summary: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices semper libero, ' +
            'sit amet fringilla leo. Donec facilisis volutpat augue, in interdum ligula tincidunt ac. Sed ut ' +
            'volutpat dui, sed fringilla purus. Fusce aliquet eros vel sapien dictum tempor.</p><p>Class aptent taciti ' +
            'sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque sit amet quam ' +
            'ultricies, dignissim leo sit amet, gravida nisi. Fusce id urna quis diam laoreet rutrum. Vivamus porttitor ' +
            'sed ex sit amet finibus. Sed sed ante nisi. Praesent malesuada rutrum eros, sit amet rhoncus dui.</p>',
        objectives: [
            'Apprendre des trucs sur plusieurs ligne car cette phrase est longue',
            'Connaitre des choses',
            'Savoir des machins'
        ],
        parts: [{
            title: 'Formation ZRR',
            outlineTree: [
                {contentId: 'a'},
                {contentId: 'b'},
                {contentId: 'c'},
                {contentId: 'd'},
                {contentId: 'e'},
                {contentId: 'f'},
                {contentId: 'g'},
                {contentId: 'h'},
                {contentId: 'i'},
                {contentId: 'j'},
                {contentId: 'k'},
                {contentId: 'l'},
                {contentId: 'm'},
                {contentId: 'n'},
                {contentId: 'o'},
                {contentId: 'p'},
                {contentId: 'q'},
                {contentId: 'r'}
            ]
        }],
        content: ZRRContents
    }
];
