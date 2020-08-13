import {Epoc} from './epoc';
import {Content} from './contents/content';
import {Chapter} from './contents/chapter';
import {Assessment, SimpleQuestion} from './contents/assessment';
import {Html} from './contents/html';
import {Video} from './contents/video';

/* tslint:disable */
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
        html: '<h4>Ce que dit le règlement intérieur : </h4>' +
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
        html: '<h4>Ce qu\'il faut retenir :</h4>' +
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
        html: '<h4>Autorisations : </h4>' +
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
        html: '<h4>Ce qu\'il faut retenir :</h4>' +
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
        html: '<h4>Autorisations : </h4>' +
            '<p></p>',

    },
    {
        id: 'n',
        type: 'html',
        name: 'A retenir',
        html: '<h4>Ce qu\'il faut retenir :</h4>' +
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
        name: 'Activité noté: Test final',
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
        id: 'a1',
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
        id: 'a2',
        type: 'video',
        name: 'Les données',
        source: 'assets/demo/VP/pourquoi-le-smartphone-interesse-t-il-tant-480p.mp4',
        subtitles: '',
        summary: '<p>Pourquoi nos assistants personnels, smartphones et tablettes, sont-ils devenus tout naturellement, en une dizaine d\'années seulement, un point de collecte majeur de données personnelles.</p>' +
            '<p>Pourquoi le smartphone intéresse-t-il tant de monde ?</p>' +
            '<p>Regarder cette vidéo pour en savoir plus !</p>',

    },
    {
        id: 'a3',
        type: 'assessment',
        name: 'Activité noté',
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
        id: 'b',
        type: 'chapter',
        name: 'L\'écosystème autour des applications pour smartphones',
        image: 'assets/demo/VP/vp-chapitre-2.png',
        number: '2',
        objectives: ['Identifier les acteurs de cet écosystème autour des applications et leurs fonctions']
    },
    {
        id: 'b1',
        type: 'video',
        name: 'Écosystème autour d’une application',
        source: 'assets/demo/VP/ecosysteme-480p.mp4',
        subtitles: '',
        summary: 'Résumé de la vidéo Ecosystème',

    },
    {
        id: 'b2',
        type: 'assessment',
        name: 'Activité noté',
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
        id: 'b3',
        type: 'html',
        name: 'A retenir',
        html: '<h4>Ce qu\'il faut retenir :</h4>' +
            '<p>Le premier travail de la régie publicitaire est d\'exploiter les données personnelles brutes collectées et transmises par toutes les applications du smartphone de l\'utilisateur ' +
            'où elle est présente afin de créer un profil. Dans ce travail de collecte, il n\'y a bien sûr aucune génération de données, toutes les informations étant bel et bien générées sur ' +
            'le smartphone de l\'utilisateur, au quotidien.</p>' +
            '<p>Dans la phase de profilage qui suit, il y a par contre une interprétation des données et création de données supplémentaires (par ex. cet utilisateur est intéressé par les articles ' +
            'de mode). Ces données de profilage, absentes du smartphone, résultent d\'un travail d\'analyse, et étant associées à une personne physique, il s\'agit bien de données personnelles.</p>' +
            '<p>C\'est ce profil qui permet aux annonceurs de sélectionner s\'il est ou non pertinent d\'afficher un message publicitaire, d\'où la notion de publicité ciblée.</p>' +
            '<p>Enfin, la régie publicitaire étant à l\'interface entre annonceurs et smartphones, elle déclenche bien sûr l\'affichage du message publicitaire du gagnant de l\'enchère.</p>',

    },
    {
        id: 'b4',
        type: 'video',
        name: 'Exemple des régies publicitaires ',
        source: 'assets/demo/VP/pour-aller-plus-loin-480p.mp4',
        subtitles: '',
        summary: 'Pour aller plus loin : exemple des régies publicitaires',

    },
    {
        id: 'b5',
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
        id: 'c',
        type: 'chapter',
        name: 'Gratuité contre publicité ciblée : où est le problème ?',
        image: 'assets/demo/VP/vp-chapitre-3.jpg',
        number: '3',
        objectives: ['Découvrir des problèmes de fond du modèle économique']
    },
    {
        id: 'c1',
        type: 'simple-question',
        name: 'Selon-vous ?',
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
        id: 'c2',
        type: 'video',
        name: '3 problèmes du modèle économique ',
        source: 'assets/demo/VP/gratuite-de-public-cible-480p.mp4',
        subtitles: '',
        summary: 'Résumé de la vidéo',

    },
    {
        id: 'c3',
        type: 'assessment',
        name: 'Activité noté',
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
        id: 'c4',
        type: 'html',
        name: 'Un fait pour aller plus loin ',
        html: '<h4>La régie publicitaire InMobi</h4>' +
            '<p>A la mi-2016, la régie publicitaire InMobi a été lourdement sanctionnée aux États Unis, un tout petit peu moins qu’un million de dollars pour avoir agi de façon déloyale : ' +
            'on captait la géolocalisation des jeunes utilisateurs et des moins jeunes également, de façon déloyale, c\'est-à-dire, ni informer, ni demander l\'autorisation et en détournant ' +
            'une autorisation d’Android. </p>' +
            '<p>C\'est d\'ailleurs notre équipe qui a les premiers identifié le problème 2 ans plus tôt. Donc, la question de gratuité contre publicité ciblée est plus compliquée qu\'il n\'y ' +
            'parait et c\'est ce que nous allons creuser.</p>',

    },
    {
        id: 'd',
        type: 'chapter',
        name: 'Données personnelles : Gros plan sur les identifiants techniques',
        image: 'assets/demo/VP/vp-chapitre-4.png',
        number: '4',
        objectives: ['Apprendre des identifiants techniques de base', 'Découvrir des problèmes des identifiants stables']
    },
    {
        id: 'd1',
        type: 'simple-question',
        name: 'Selon-vous ?',
        question: {
            type: 'choice',
            score: 0,
            statement: '',
            label: ' Est-ce que les identifiants techniques de votre smartphone sont anodins ?',
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
            correctResponse: 'B',
            explanation: '<p>Les identifiants techniques font souvent l’objet de collecte. Ces identifiants ressemblent à des nombres aléatoires, parfois c\'est le cas. On aurait tendance à dire que c\'est relativement anodin, mais c\'est tout l\'inverse. Pourquoi ? Parce que ce sont des données personnelles puisque ces identifiants sont attachés à un smartphone, et donc à une personne physique, mais aussi parce qu\'ils vont permettre de tracer les utilisateurs.</p>'
        },

    },
    {
        id: 'd2',
        type: 'video',
        name: 'Identifiants techniques',
        source: 'assets/demo/VP/info-perso-sur-smartphone-480p.mp4',
        subtitles: '',
        summary: 'Dans cette vidéo, nous allons aborder les questions de fond : Qu’est-ce que c’est les identifiants techniques ? Quelle information contiennent-ils ? Pourquoi il faut les protéger ? Quels sont les types des identifiants techniques ? Est-ce qu’ils permettent de tracer les utilisateurs ?',

    },
    {
        id: 'd3',
        type: 'assessment',
        name: 'Activité noté',
        summary: 'Résumé quiz',
        items: [
            {
                type: 'drag-and-drop',
                score: 100,
                statement: '',
                label: 'Faites glisser les identifiants de smartphone avec leur fonction correspondante :',
                responses: [
                    {
                        label: 'IMEI',
                        value: 'A'
                    },
                    {
                        label: 'IMSI',
                        value: 'B'
                    }
                ],
                correctResponse: [
                    {label: 'Identifiant technique', values: ['A']},
                    {label: 'Identifiant publicitaire', values: ['B']}
                ],
                explanation: '<ul>' +
                    '<li>IMEI : identifie de façon unique le portable. Dans le cas de vol, permet de le bloquer chez les opérateurs</li>' +
                    '<li>IMSI : identifie un abonné chez un opérateur de téléphone mobile</li>' +
                    '</ul>' +
                    '<p>Chaque identifiant a une fonction bien précise. L’objectif général c’est de pouvoir identifier votre portable et de le protéger. Il faut notamment comprendre que ne se sont pas tous les identifiants. Il y en a encore plus.</p>'
            },
            {
                type: 'choice',
                score: 100,
                statement: '',
                label: 'Est-ce qu’il est possible de visualiser tous les identifiants techniques de votre smartphone ?',
                responses: [
                    {
                        label: 'Oui',
                        value: 'A'
                    },
                    {
                        label: 'Cela dépend de l’identifiant recherchée',
                        value: 'B'
                    },
                    {
                        label: 'Non',
                        value: 'C'
                    }
                ],
                correctResponse: 'B',
                explanation: '<p>Il y a certaines informations que vous pouvez trouver dans les réglages de votre smartphone. Par contre certaines informations de sont pas disponibles par mesure de sécurité</p>' +
                    '<p>Il est possible de visualiser votre IMEI (dans les réglages)</p>' +
                    '<p>IMSI est stocké sur la carte SIM de l’utilisateur donc il est disponible seulement chez votre opérateur de téléphone mobile. Il est possible de réinitialiser l’identifiant publicitaire mais pas le visualiser. Il est accessible aux annonceurs</p>' +
                    '<p>Identifiant technique</p>'
            }
        ],

    },
    {
        id: 'd4',
        type: 'html',
        name: 'Pour aller plus loin ',
        html: '<h4>Réinitialisation d’un identifiant publicitaire</h4>' +
            '<ol>' +
            '<li>la régie conserve les données qu\'elle a pu collecter avant la remise à zéro, l\'effet de la réinitialisation est purement local au téléphone et limité à l\'identifiant ;</li>' +
            '<li>la réinitialisation se fait discrètement sur le téléphone, aucun message n\'est envoyé à qui que ce soit ;</li>' +
            '<li>cet identifiant est utilisé par les régies, pas par les annonceurs qui n\'ont qu\'une information agrégée de profil, information fournie par la régie dont c\'est le travail.</li>' +
            '</ol>',

    },
    {
        id: 'e',
        type: 'chapter',
        name: 'Contrôle utilisateur',
        image: 'assets/demo/VP/vp-chapitre-5.png',
        number: '5',
        objectives: ['Comparer une contrôle utilisateur dans le cas de Google et Apple']
    },
    {
        id: 'e1',
        type: 'simple-question',
        name: 'Selon-vous ?',
        question: {
            type: 'choice',
            score: 0,
            statement: '',
            label: 'Lors de l’installation de l’application, pouvons-nous accéder à toutes autorisations dont l’application a besoin',
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
            explanation: '<p>Effectivement il est possible de visualiser des conditions d’utilisation de l’application choisi. Par contre ce qui peut être frustrant : les conditions d’utilisation ne sont pas toujours disponibles en langue de votre smartphone. La deuxième difficulté c’est la taille de texte proposé à lire. Ce n’est pas souvent que l’utilisateur lit toutes les conditions et cela n’est pas étonnant.</p>'
        },

    },
    {
        id: 'e2',
        type: 'video',
        name: 'Notion d’autorisations',
        source: 'assets/demo/VP/controle-utilisateur-480p.mp4',
        subtitles: '',
        summary: 'Quelles données personnelles peuvent être accédées ? Peuvent-elles être transmises sur Internet ? Peut-on contrôler ces autorisations dynamiquement ? Ce sont quelques questions que nous allons aborder dans ce chapitre.',

    },
    {
        id: 'e3',
        type: 'simple-question',
        name: 'Question notée',
        question: {
            type: 'choice',
            score: 100,
            statement: '',
            label: 'Le bac à sable dans lequel est exécuté une application interdit-il définitivement tout accès aux informations et services externes ?',
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
            correctResponse: 'B',
            explanation: '<p>Non, il s\'agit avant tout de contrôler l\'accès, pas de les interdire définitivement. Par défaut, une application est confinée à son bac à sable. Elle peut néanmoins en sortir à condition d\'en obtenir l\'autorisation, ce qui lui sera accordé ou interdit en fonction par exemple des permissions qu\'elle a obtenues de la part de l\'utilisateur.</p>'
        },

    },
    {
        id: 'e4',
        type: 'choice',
        name: 'Choix du parcours',
        conditionResolver: {
            type: 'choice',
            label: 'De quel OS voulez-vous que nous parlons ?\n\n(Vous pourrez toujours changer votre choix)',
            choices: [
                { label: 'iOS', value: 'A' },
                { label: 'Android', value: 'B' }
            ],
            conditionalFlag: [
                { value: 'A', flags: ['e411', 'e412', 'f21', 'f211', 'f212'] },
                { value: 'B', flags: ['e421', 'e422', 'f22', 'f221', 'f222'] },
            ]
        }
    },
    {
        id: 'e411',
        type: 'video',
        name: 'Autorisations iOS',
        source: 'assets/demo/VP/apple-controle-480p.mp4',
        subtitles: '',
        summary: 'Dans cette vidéo nous verrons les particularités des autorisations d’iOS ainsi que les autorisations qui peut attribuer l’utilisateur.',
        conditional: true

    },
    {
        id: 'e421',
        type: 'video',
        name: 'Autorisations Google',
        source: 'assets/demo/VP/android-controle-480p.mp4',
        subtitles: '',
        summary: 'Dans cette vidéo nous verrons les particularités des autorisations d’Android ainsi que les autorisations qui peut attribuer l’utilisateur.',
        conditional: true
    },
    {
        id: 'e43',
        type: 'html',
        name: 'Conclusion',
        html: '<h4>Le mécanisme d\'autorisation répond à 2 objectifs :</h4>' +
            '<ul>' +
            '<li>d\'une part connaître les possibilités d\'accès aux données personnelles par les applications du smartphone</li>' +
            '<li>d’autre part contrôler ces applications en autorisant ou en interdisant ces accès.' +
                '<ul>' +
                '<li>Nous avons vu que ces autorisations peuvent être demandées :' +
                '<ul>' +
                    '<li>à l\'installation, mais c\'est dans ce cas-là un contrôle extrêmement limité</li>' +
                    '<li>ou alors dynamiquement, ce qui est bien plus favorable.</li>' +
                '</ul>' +
                '</li>' +
                '<li>C\'était l\'approche historique d\'Apple avec iOS, et heureusement Google, avec les dernières versions d\'Android, se rallie à ce modèle également.</li>' +
                '</ul>' +
            '</li>' +
            '</ul>',

    },
    {
        id: 'e412',
        type: 'assessment',
        name: 'Activité noté',
        summary: 'Exercice vidéo iOS',
        items: [
            {
                type: 'drag-and-drop',
                score: 100,
                statement: '',
                label: 'Faites glisser les identifiants de smartphone avec leur fonction correspondante :',
                responses: [
                    {
                        label: 'IMEI',
                        value: 'A'
                    },
                    {
                        label: 'IMSI',
                        value: 'B'
                    }
                ],
                correctResponse: [
                    {label: 'Identifiant technique', values: ['A']},
                    {label: 'Identifiant publicitaire', values: ['B']}
                ],
                explanation: '<ul>' +
                    '<li>IMEI : identifie de façon unique le portable. Dans le cas de vol, permet de le bloquer chez les opérateurs</li>' +
                    '<li>IMSI : identifie un abonné chez un opérateur de téléphone mobile</li>' +
                    '</ul>' +
                    '<p>Chaque identifiant a une fonction bien précise. L’objectif général c’est de pouvoir identifier votre portable et de le protéger. Il faut notamment comprendre que ne se sont pas tous les identifiants. Il y en a encore plus.</p>'
            },
            {
                type: 'choice',
                score: 100,
                statement: '',
                label: 'Est-ce qu’il est possible de visualiser tous les identifiants techniques de votre smartphone ?',
                responses: [
                    {
                        label: 'Oui',
                        value: 'A'
                    },
                    {
                        label: 'Cela dépend de l’identifiant recherchée',
                        value: 'B'
                    },
                    {
                        label: 'Non',
                        value: 'C'
                    }
                ],
                correctResponse: 'B',
                explanation: '<p>Il y a certaines informations que vous pouvez trouver dans les réglages de votre smartphone. Par contre certaines informations de sont pas disponibles par mesure de sécurité</p>' +
                    '<p>Il est possible de visualiser votre IMEI (dans les réglages)</p>' +
                    '<p>IMSI est stocké sur la carte SIM de l’utilisateur donc il est disponible seulement chez votre opérateur de téléphone mobile. Il est possible de réinitialiser l’identifiant publicitaire mais pas le visualiser. Il est accessible aux annonceurs</p>' +
                    '<p>Identifiant technique</p>'
            }
        ],
        conditional: true
    },
    {
        id: 'e422',
        type: 'assessment',
        name: 'Activité noté',
        summary: 'Exercice vidéo Android',
        items: [
            {
                type: 'choice',
                score: 100,
                statement: '',
                label: 'Quelle version d\'Android a introduit la notion d\'autorisations dynamiques (en plus de l\'ancien système d\'autorisations à l\'installation d\'une application)?',
                responses: [
                    {
                        label: 'Android 5.0 (Lollipop), fin 2014',
                        value: 'A'
                    },
                    {
                        label: 'Android 6.0 (Marshmallow), fin 2015',
                        value: 'B'
                    },
                    {
                        label: 'Android 7.0 (Nougat), mi 2016',
                        value: 'C'
                    },
                    {
                        label: 'Android 8.0 (Oreo), mi 2017',
                        value: 'D'
                    }
                ],
                correctResponse: 'B',
                explanation: '<p>Et oui, bien après Apple/iOS, Google/Android a basculé sur une approche d\'autorisations dynamiques avec Android 6.0. La bascule s\'est faite progressivement à partir de fin 2015, à savoir que les applications historiques continuent de reposer uniquement sur l\'approche d\'autorisations à l\'installation, les nouvelles sur les autorisations dynamiques.</p>'
            },
            {
                type: 'multiple-choice',
                score: 100,
                statement: '',
                label: 'Choisissez des caractéristiques qui correspondent à Android',
                responses: [
                    {
                        label: 'Dispose d’un panel du contrôle des applications en vue détaillé et vue générale',
                        value: 'A'
                    },
                    {
                        label: 'Dispose d’un contrôle des applications seulement en vue détaillé  ',
                        value: 'B'
                    },
                    {
                        label: 'Dispose d’un contrôle des applications seulement en vue générale',
                        value: 'C'
                    },
                    {
                        label: 'La manque d’une autorisation peut empêcher un bon fonctionnement d’une application déjà installée ',
                        value: 'D'
                    },
                    {
                        label: 'La manque d’une autorisation empêche le démarrage d’une application déjà installée',
                        value: 'E'
                    },
                    {
                        label: 'La plupart des autorisations a attribué automatiquement',
                        value: 'F'
                    },
                    {
                        label: 'Aucune autorisation a attribué automatiquement ',
                        value: 'G'
                    },
                ],
                correctResponse: ['A', 'D', 'F'],
                explanation: '<p>Google/Android a basculé sur une approche d\'autorisations dynamiques avec Android 6.0. La bascule s\'est faite progressivement à partir de fin 2015. Actuellement Android dispose d’un panel du contrôle des applications en vue détaillé et vue générale. Donc l’utilisateur peut à tout moment changer l’autorisation précédemment donnée. Par contre la manque d’une autorisation peut empêcher un bon fonctionnement d’une application déjà installée. Et la plupart des autorisations a attribué automatiquement. Donc il faut rester vigilant et vérifier les autorisations données. L’utilisateur ne doit pas rester un acteur passif d’écosystème</p>'
            }
        ],
        conditional: true
    },
    {
        id: 'f',
        type: 'chapter',
        name: 'Limites du contrôle utilisateur Apple et Google',
        image: 'assets/demo/VP/vp-chapitre-6.jpg',
        number: '6',
        objectives: ['Mettre en pratique la protection de vos données']
    },
    {
        id: 'f1',
        type: 'simple-question',
        name: 'Selon-vous ?',
        question: {
            type: 'multiple-choice',
            score: 0,
            statement: '',
            label: 'De quoi dépendent des limites de contrôle dans votre portable ?',
            responses: [
                {
                    label: 'D’un système d’exploitation',
                    value: 'A'
                },
                {
                    label: 'D’un accord entre l’entreprise (Apple ou Google) et les régies publicitaires',
                    value: 'B'
                },
                {
                    label: 'De tous les accords entre tous les acteurs d’écosystème',
                    value: 'C'
                }
            ],
            correctResponse: ['B', 'C'],
            explanation: '<p>Il ne faut pas sous-estimer le rôle de l’entreprise dans l’écosystème. Comme nous avons pu voir dans le module précédent, le contrôle des autorisations peut être modifié dans les réglages de notre smartphone : à travers des autorisations dynamiques. Mais les entreprises jouent le rôle entre les intérêts des utilisateurs et des régies publicitaires.</p>'
        }
    },
    {
        id: 'f2',
        type: 'video',
        name: 'Introduction du contrôle de limites',
        source: 'assets/demo/VP/limites-ios-et-android-480p.mp4',
        subtitles: '',
        summary: 'Introduction du contrôle de limites et limites communes : Les applications ont besoin d\'autorisations pour accéder à certaines données personnelles, ou ressources du smartphone. Alors nous aborderons plus précisément des limites qui sont communes aux 2 systèmes d\'exploitation, quant aux aspects comportement de l\'application et composition des autorisations.'
    },
    {
        id: 'f21',
        type: 'video',
        name: 'Limites du contrôle iOS',
        source: 'assets/demo/VP/limites-ios-480p.mp4',
        subtitles: '',
        summary: '<p>Dans cette vidéo nous verrons les particularités des limites au sein de système d’exploitation iOS.</p>',
        conditional: true
    },
    {
        id: 'f211',
        type: 'html',
        name: 'Pour résumer : iOS',
        html: '<b>Les limites communes à Android et iOS :</b>' +
            '<ul>' +
            '<li>contrôle comportemental de l\'application</li>' +
            '<li>contrôle de la composabilité des autorisations.</li>' +
            '</ul>' +
            '<b>Les limites iOS :</b>' +
            '<ul>' +
            '<li>Un système iOS bien plus respectueux.</li>' +
            '<li>Une stratégie assumée d’Apple en faveur du respect de la vie privée.</li>' +
            '<li>Visible depuis longtemps dans iOS.</li>' +
            '</ul>',
        conditional: true

    },
    {
        id: 'f212',
        type: 'assessment',
        name: 'Activité iOS',
        summary: '',
        items: [
            {
                type: 'choice',
                score: 100,
                statement: '',
                label: 'Chez Apple/iOS, la réinitialisation de l\'identifiant publicitaire empêche-t-elle la collecte de données personnelles ?',
                responses: [
                    {
                        label: 'Oui, c\'est une remise à zéro de toutes les données collectées jusque-là par la régie',
                        value: 'A'
                    },
                    {
                        label: 'Oui, l\'utilisateur dit explicitement à la régie qu\'il ne veut plus être suivi',
                        value: 'B'
                    },
                    {
                        label: 'Non, c\'est juste destiné à imposer à la régie de partir sur un nouveau profil',
                        value: 'C'
                    },
                    {
                        label: 'Non, cet identifiant concerne les annonceurs, pas la régie publicitaire',
                        value: 'D'
                    }
                ],
                correctResponse: 'C',
                explanation: '<p>Cet identifiant publicitaire est destiné à limiter le suivi (traçage) de l\'utilisateur par les régies publicitaires : une réinitialisation de l\'identifiant permet (s\'il n\'y a pas de triche) de dissocier le profil construit par une régie avec l\'ancien identifiant de celui qu\'elle devra reconstruire à partir du nouvel identifiant. En pratique cela signifie que la régie ne peut plus exploiter l\'ancien profil (elle ne recevra plus de message associé à cet identifiant) et doit tout recommencer à zéro puisqu\'elle ne connait pas le nouvel identifiant.</p>'
            }
        ],
        conditional: true
    },
    {
        id: 'f22',
        type: 'video',
        name: 'Limites du contrôle Android',
        source: 'assets/demo/VP/limites-android-480p.mp4',
        subtitles: '',
        summary: '<p>Dans cette vidéo nous verrons les particularités des limites au sein de système d’exploitation Android.</p>',
        conditional: true
    },
    {
        id: 'f221',
        type: 'html',
        name: 'Pour résumer : Android',
        html: '<b>Les limites communes à Android et iOS :</b>' +
            '<ul>' +
            '<li>contrôle comportemental de l\'application</li>' +
            '<li>contrôle de la composabilité des autorisations.</li>' +
            '</ul>' +
            '<b>Les limites Android :</b>' +
            '<ul>' +
            '<li>Un système loin d’être satisfaisant coté Android.</li>' +
            '<li>Migration progressive d’Android vers des autorisations dynamiques = réel progrès.</li>' +
            '<li>Les autorisations Android restent très critiquables.</li>' +
            '</ul>',
        conditional: true

    },
    {
        id: 'f222',
        type: 'assessment',
        name: 'Activité Android',
        summary: '',
        items: [
            {
                type: 'multiple-choice',
                score: 100,
                statement: 'Un des objectifs de Google, en basculant sur le mode d\'autorisations dynamiques, était de permettre des installations "plus fluides" sur Android.',
                label: 'Parmi les affirmations suivantes, en se limitant aux smartphones Android. identifiez celle(s) qui est(sont) exacte(s): ',
                responses: [
                    {
                        label: 'L\'utilisateur garde un certain contrôle sur les autorisations dites "normales" : l\'autorisation est automatiquement accordée, cependant l\'utilisateur peut revenir dessus par la suite afin de révoquer cette autorisation',
                        value: 'A'
                    },
                    {
                        label: ' L\'utilisateur a un contrôle total sur les autorisations dites "normales" : il doit explicitement accorder l\'autorisation et il peut revenir dessus par la suite afin de révoquer cette autorisation',
                        value: 'B'
                    },
                    {
                        label: 'L\'utilisateur n\'est jamais sollicité pour les autorisations dites "normales" et n\'a aucun contrôle : l\'autorisation est automatiquement accordée et l\'utilisateur n\'a aucun moyen par la suite de révoquer cette autorisaton',
                        value: 'C'
                    }
                ],
                correctResponse: ['A', 'C'],
                explanation: '<p>L\'utilisateur n\'a aucun contrôle et n\'est pas informé systématiquement (il faut aller chercher). Avec les autorisations dites normales, l\'utilisateur ne peut en aucun cas révoquer ces autorisations. C\'est un choix de conception (criticable) de Google.</p>' +
                    '<p>Un exemple : l\'adresse MAC de l\'interface Wi-Fi est accessible via une autorisation normale (ACCESS_WIFI_STATE) qui est du coup automatiquement accordé, sans révocation possible par l\'utilisateur. Le traçage des utilisateurs par ce biais est possible et très simple.</p>'
            }
        ],
        conditional: true
    },
    {
        id: 'g',
        type: 'chapter',
        name: 'Cercle vertueux',
        image: 'assets/demo/VP/vp-chapitre-7.png',
        number: '7',
        objectives: ['Apprendre les particularités de cercle vertueux : modèle gratuit et payant']
    },
    {
        id: 'g1',
        type: 'simple-question',
        name: 'Selon-vous ?',
        question: {
            type: 'choice',
            score: 0,
            statement: '',
            label: 'Quel est l\'intérêt d\'avoir un cercle vertueux ?',
            responses: [
                {
                    label: 'Mettre en avant l\'utilisateur dans l\'écosystème',
                    value: 'A'
                },
                {
                    label: 'Pour que chaque acteur y trouve son intérêt',
                    value: 'B'
                }
            ],
            correctResponse: 'B',
            explanation: '<p>A VENIR</p>'
        }
    },
    {
        id: 'g2',
        type: 'video',
        name: 'Cercle vertueux',
        source: 'assets/demo/VP/cercle-vertueux-480p.mp4',
        subtitles: '',
        summary: 'Qu\'est-ce que c\'est le cercle vertueux ? Quelles sont ses particularités ? Quelles sont ses conditions pour que le modèle de cerrcle vertueux fonctionne ? Est-ce que cette notion est utopique ? Regardez cette vidéo pour apprendre plus sur le cercle vertueux !'
    },
    {
        id: 'g3',
        type: 'simple-question',
        name: 'Question notée',
        question: {
            type: 'multiple-choice',
            score: 100,
            statement: '',
            label: 'En quoi la notion de transparence est-elle souhaitable pour l\'utilisateur ?',
            responses: [
                {
                    label: 'L\'utilisateur devrait connaitre la nature des informations collectées et leur utilisation',
                    value: 'A'
                },
                {
                    label: 'L\'utilisateur devrait connaitre l\'identité de la (ou des) régies publicitaires collectant des informations personnelles',
                    value: 'B'
                },
                {
                    label: 'L\'utilisateur devrait connaitre le chiffre d\'affaires des régies publicitaires',
                    value: 'C'
                },
                {
                    label: 'L\'utilisateur devrait connaitre l\'identité de l\'annonceur affichant une publicité',
                    value: 'D'
                }
            ],
            correctResponse: ['A', 'B'],
            explanation: '<p>La transparence est indispensable afin de créer un cercle vertueux. Cependant elle est, pour l\'utilisateur, limitée aux données collectées et tout ce qui les concerne : identité du responsable de traitements (ici la régie publicitaire), traitements effectués, échanges éventuels avec d\'autres acteurs, durée de rétention, mesures de sécurité mises en jeu, etc.</p>' +
                '<p>Par contre, la connaissance du chiffre d\'affaires de la régie publicitaire est sans rapport avec la protection des données personnelles. De même l\'annonceur va en général s\'identifier auprès de l\'utilisateur, et si ce n\'est pas le cas, c\'est de toute façon sans rapport avec la protection de la vie privée.</p>'
        },

    },
    {
        id: 'h',
        type: 'chapter',
        name: 'Conclusion',
        image: 'assets/demo/VP/vp-chapitre-9.png',
        number: '8',
        objectives: ['Se rendre compte du rôle et des droits des acteurs dans l’écosystème']
    },
    {
        id: 'h1',
        type: 'simple-question',
        name: 'Selon-vous ?',
        question: {
            type: 'choice',
            score: 0,
            statement: '',
            label: 'Est-ce que l’utilisateur est un acteur passif de l’écosystème ?',
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
            correctResponse: 'B',
            explanation: '<p>Malgré les limites existants, l’utilisateur est un acteur actif. C’est à lui de décider quelle application installer et quelles autorisations il faut donner. Il peut influencer sur les ses décisions déjà prises. Donc c’est à lui de décider si exercer le droit et la possibilité d’être actif ou pas.</p>'
        }
    },
    {
        id: 'h2',
        type: 'video',
        name: 'Conclusion',
        source: 'assets/demo/VP/conclusion-480p.mp4',
        subtitles: '',
        summary: '<p>-Il faut comprendre aussi que l\'on est là au début ; ce sont vraiment des questions de fond : la généralisation du paiement sur smartphone, la multiplication des objets connectés, les montres intelligentes par exemple, cette appétence que l\'on peut avoir pour l\'automesure de ses paramètres biologiques, par exemple pour comparer ses performances sportives, mais' +
            'aussi la maison intelligente, les voitures connectées, l\'Internet des objets... Voilà. Tout cela fait que cette collecte va s\'étendre rapidement à des domaines qui sont aujourd\'hui épargnés, d\'où l\'importance de traiter de ces questions de fond.</p>'
    },
    {
        id: 'h3',
        type: 'simple-question',
        name: 'Question notée',
        question: {
            type: 'multiple-choice',
            score: 100,
            statement: '',
            label: 'Quelles sont les conséquences si on installe des applications sans arrêt',
            responses: [
                {
                    label: 'Il sera possible de facilement pister les utilisateurs',
                    value: 'A'
                },
                {
                    label: 'Il sera possible de récupèrer les données pesronnelles',
                    value: 'B'
                },
                {
                    label: 'Il n\'est pas possible que l\'utilisateur soit au courant des données qui étaient récupérées',
                    value: 'C'
                },
                {
                    label: 'La législation ne sera pas en mésure de protèger les utilisateurs',
                    value: 'D'
                }
            ],
            correctResponse: ['A', 'C'],
            explanation: 'A VENIR'
        }
    },
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
                description: 'Chercheur titulaire travaillant à l\'Inria, un institut de recherche français. Depuis 2013 je fais parti de l\'équipe Inria Privatics qui concentre sa recherche sur la vie privée.'
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
        certificateScore: 5,
        parts: [{
            title: 'Partie théorique',
            outlineTree: [
                {
                    contentId: 'a',
                    children: [
                        {
                            contentId: 'a1'
                        },
                        {
                            contentId: 'a2'
                        },
                        {
                            contentId: 'a3'
                        }
                    ]
                },
                {
                    contentId: 'b',
                    children: [
                        {
                            contentId: 'b1'
                        },
                        {
                            contentId: 'b2'
                        },
                        {
                            contentId: 'b3'
                        },
                        {
                            contentId: 'b4'
                        }
                    ]
                },
                {
                    contentId: 'c',
                    children: [
                        {
                            contentId: 'c1'
                        },
                        {
                            contentId: 'c2'
                        },
                        {
                            contentId: 'c3'
                        },
                        {
                            contentId: 'c4'
                        }
                    ]
                },
                {
                    contentId: 'd',
                    children: [
                        {
                            contentId: 'd1'
                        },
                        {
                            contentId: 'd2'
                        },
                        {
                            contentId: 'd3'
                        },
                        {
                            contentId: 'd4'
                        }
                    ]
                },
                {
                    contentId: 'e',
                    children: [
                        {
                            contentId: 'e1'
                        },
                        {
                            contentId: 'e2'
                        },
                        {
                            contentId: 'e3'
                        },
                        {
                            contentId: 'e4'
                        },
                        {
                            contentId: 'e411'
                        },
                        {
                            contentId: 'e412'
                        },
                        {
                            contentId: 'e421'
                        },
                        {
                            contentId: 'e422'
                        }
                    ]
                },
                {
                    contentId: 'f',
                    children: [
                        {
                            contentId: 'f1'
                        },
                        {
                            contentId: 'f2'
                        },
                        {
                            contentId: 'e4'
                        },
                        {
                            contentId: 'f21'
                        },
                        {
                            contentId: 'f211'
                        },
                        {
                            contentId: 'f212'
                        },
                        {
                            contentId: 'f22'
                        },
                        {
                            contentId: 'f221'
                        },
                        {
                            contentId: 'f222'
                        }
                    ]
                },
                {
                    contentId: 'g',
                    children: [
                        {
                            contentId: 'g1'
                        },
                        {
                            contentId: 'g2'
                        },
                        {
                            contentId: 'g3'
                        }
                    ]
                },
                {
                    contentId: 'h',
                    children: [
                        {
                            contentId: 'h1'
                        },
                        {
                            contentId: 'h2'
                        },
                        {
                            contentId: 'h3'
                        }
                    ]
                }
            ]
        },
        {
            title: 'Mise en pratique',
            outlineTree: [
                {
                    contentId: 'i',
                    children: []
                },
                {
                    contentId: 'j',
                    children: []
                }
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
        certificateScore: 60,
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
