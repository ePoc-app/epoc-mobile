import {Epoc} from './epoc';
import {Content} from './contents/content';
import {Cover} from './contents/cover';
import {Chapter} from './contents/chapter';
import {Assessment} from './contents/assessment';
import {Html} from './contents/html';
import {Video} from './contents/video';


const DummyHtmlContent = (length) => {
    const dummyContent = [
        '<h1>Gregor Samsa woke from troubled dreams.</h1>',
        '<ul>' +
        '  <li>Lorem ipsum dolor sit amet consectetuer.</li>' +
        '  <li>Aenean commodo ligula eget dolor.</li>' +
        '  <li>Aenean massa cum sociis natoque penatibus.</li>' +
        '</ul>',
        '<h2>The bedding was hardly able to cover it.</h2>',
        '<ul>' +
        '  <li>Lorem ipsum dolor sit amet, consectetuer adipiscing ' +
        '  elit. Aenean commodo ligula eget dolor. Aenean ' +
        '  massa.</li>' +
        '  <li>Cum sociis natoque penatibus et magnis dis ' +
        '  parturient montes, nascetur ridiculus mus. Donec quam ' +
        '  felis, ultricies nec, pellentesque eu, pretium quis, ' +
        '  sem.</li>' +
        '  <li>Nulla consequat massa quis enim. Donec pede justo, ' +
        '  fringilla vel, aliquet nec, vulputate eget, arcu.</li>' +
        '  <li>In enim justo, rhoncus ut, imperdiet a, venenatis ' +
        '  vitae, justo. Nullam dictum felis eu pede mollis ' +
        '  pretium. Integer tincidunt.</li>' +
        '</ul>',
        '<h4>Samsa was a travelling salesman.</h4>',
        '<p>One morning, when Gregor Samsa woke from troubled ' +
        'dreams, he found himself transformed in his bed into ' +
        'a horrible vermin. He lay on his armour-like back, ' +
        'and if he lifted his head a little he could see his ' +
        'brown belly, slightly domed and divided by arches into ' +
        'stiff sections. The bedding was hardly able to cover ' +
        '<strong>strong</strong> it and seemed ready to slide ' +
        'off any moment. His many legs, pitifully thin ' +
        'compared with the size of the rest of him, ' +
        '<a class="external ext" href="#">link</a> waved about ' +
        'helplessly as he looked. "What\'s happened to me? " he ' +
        'thought. It wasn\'t a dream. His room, a proper human ' +
        'room although a little too small, lay peacefully ' +
        'between its four familiar walls.</p>',
        '<p>It showed a lady fitted out with a fur hat and fur ' +
        'boa who sat upright, raising a heavy fur muff that ' +
        'covered the whole of her lower arm towards the ' +
        'viewer.</p>',
        '<h3>A collection of textile samples lay spread out on the table.</h3>',
        '<blockquote>' +
        'Gregor then turned to look out the window at the dull ' +
        'weather. Drops of rain could be heard hitting the pane, ' +
        'which made him feel quite sad. "How about if I sleep a ' +
        'little bit longer and forget all this nonsense", he ' +
        'thought, but that was something he was unable to do ' +
        'because he was used to sleeping on his right, and in ' +
        'his present state couldn\'t get into that position. ' +
        'However hard he threw himself onto his right, he ' +
        'always rolled back to where he was.' +
        '</blockquote>',
        '<h3>Samples lay spread out on the table.</h3>',
        '<table class="data">' +
        '  <tr>' +
        '    <th>Entry Header 1</th>' +
        '    <th>Entry Header 2</th>' +
        '    <th>Entry Header 3</th>' +
        '  </tr>' +
        '  <tr>' +
        '    <td>Entry First Line 1</td>' +
        '    <td>Entry First Line 2</td>' +
        '    <td>Entry First Line 3</td>' +
        '  </tr>' +
        '  <tr>' +
        '    <td>Entry Line 1</td>' +
        '    <td>Entry Line 2</td>' +
        '    <td>Entry Line 3</td>' +
        '  </tr>' +
        '  <tr>' +
        '    <td>Entry Last Line 1</td>' +
        '    <td>Entry Last Line 2</td>' +
        '    <td>Entry Last Line 3</td>' +
        '  </tr>' +
        '</table>'
    ];

    let dummy = '';
    let i = 0;

    while (dummy.length < length) {
        dummy += dummyContent[i % dummyContent.length];
        i++;
    }

    return dummy;
};

const MockContents: (Content | Chapter | Assessment | Html | Video)[] = [
    {
        id: '1',
        type: 'chapter',
        name: 'Mise en situation pour aborder les règles de fonctionnement d\'une ZRR',
        number: '1',
        toc: 1
    },
    {
        id: '2',
        type: 'video',
        name: 'Video',
        source: 'assets/demo/video.mp4',
        subtitles: 'assets/demo/soustitre.vtt',
        summary: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad autem corporis deleniti fuga minima nisi nobis ' +
            'voluptatum. Autem ducimus expedita impedit, nobis numquam optio reprehenderit unde voluptatem? Aliquid, deleniti, ' +
            'nostrum. Autem ducimus expedita impedit.',
        toc: 2
    },
    {
        id: '3',
        type: 'html',
        name: 'Welcome',
        value: DummyHtmlContent(2000),
        toc: 2
    },
    {
        id: '4',
        type: 'video',
        name: 'Video 2',
        source: 'assets/demo/video.mp4'
    },
    {
        id: '5',
        type: 'assessment',
        name: 'Que signifie ZRR ?',
        items: [
            {
                type: 'choice',
                score: 10,
                statement: '',
                label: 'Que signifie ZRR ?',
                responses: [
                    {
                        label: 'Zone à régime restrictif',
                        value: 'A'
                    },
                    {
                        label: 'Zone de recherche à accès restreint',
                        value: 'B'
                    }
                ],
                correctResponse: 'A',
                explanation: '' +
                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad autem corporis deleniti fuga minima nisi nobis ' +
                    'voluptatum. Autem ducimus expedita impedit, nobis numquam optio reprehenderit unde voluptatem? Aliquid, deleniti, ' +
                    'nostrum.'
            },
            {
                type: 'choice',
                score: 15,
                statement: '',
                label: 'Que signifie ePoc',
                responses: [
                    {
                        label: 'Enorme porte orienté couloir',
                        value: 'A'
                    },
                    {
                        label: 'Electronic Portable Open Course',
                        value: 'B'
                    },
                    {
                        label: 'Enigmatique Pokémon',
                        value: 'C'
                    }
                ],
                correctResponse: 'B'
            },
            {
                type: 'multiple-choice',
                score: 10,
                statement: '',
                label: 'Quel est la couleur du cheval blanc d\'Henri IV ?',
                responses: [
                    {
                        label: 'Bleu',
                        value: 'A'
                    },
                    {
                        label: 'Blanc',
                        value: 'B'
                    },
                    {
                        label: 'Gris car il s\'est roulé dans la poussière',
                        value: 'C'
                    }
                ],
                correctResponse: ['B', 'C']
            }
        ],
        toc: 2
    },
    {
        id: '6',
        type: 'chapter',
        name: 'La suite du cours ZRR',
        number: '2',
        toc: 1
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2 content',
        value: DummyHtmlContent(1240),
        toc: 2
    },
    {
        id: '8',
        type: 'video',
        name: 'Video 2',
        source: 'assets/demo/video.mp4'
    },
    {
        id: '9',
        type: 'assessment',
        name: 'Le référent sécurité',
        toc: 2,
        items: [
            {
                type: 'choice',
                score: 15,
                statement: '',
                label: 'Quel pouvoir à le référent sécurité ?',
                responses: [
                    {
                        label: 'Donner des baffes si l\'on ne respecte pas les règles',
                        value: 'A'
                    },
                    {
                        label: 'Boire des bières',
                        value: 'B'
                    }
                ],
                correctResponse: 'A'
            },
            {
                type: 'choice',
                score: 25,
                statement: '',
                label: 'Comment décririez vous cette formation ?',
                responses: [
                    {
                        label: 'Bof',
                        value: 'A'
                    },
                    {
                        label: 'Géniale',
                        value: 'B'
                    },
                    {
                        label: 'Trop longue',
                        value: 'C'
                    }
                ],
                correctResponse: 'B'
            }
        ]
    },
    {
        id: 'a',
        type: 'assessment',
        name: 'Quiz 2',
        toc: 2,
        items: [
            {
                type: 'reorder',
                score: 30,
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
                score: 10,
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
            }
        ]
    },
    {
        id: 'b',
        type: 'html',
        name: 'Chapter 3',
        value: DummyHtmlContent(1240),
        toc: 1
    }
];
const ZRRContents: (Content | Chapter | Assessment | Html | Video)[] = [
    {
        id: 'a',
        type: 'chapter',
        name: 'Qu\'est-ce que le dispositif de PPST ? (protection du Potentiel Scientifique et Technique de la Nation)',
        image: 'assets/demo/zrr-ppst-security.jpg',
        number: '1',
        objectives: ['Apprendre un truc'],
        toc: 1
    },
    {
        id: 'b',
        type: 'video',
        name: 'Dispositif PPST',
        source: 'assets/demo/video.mp4',
        subtitles: 'assets/demo/soustitre.vtt',
        summary: 'Qu\'est-ce que le dispositif de PPST (protection du Potentiel Scientifique et Technique de la Nation). ' +
            'Pourquoi toutes ces précautions ? Ce dispositif, est-il nouveau ? Quels sont les risques et comment ça fonctionne ? ' +
            'Les réponses dans cette vidéo.',
        toc: 2
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
        toc: 2
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
        toc: 2
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
        toc: 2
    },
    {
        id: 'f',
        type: 'chapter',
        name: 'Les risques PPST',
        number: '2',
        toc: 1
    },
    {
        id: 'g',
        type: 'video',
        name: 'Les 4 risques PPST',
        source: 'assets/demo/video.mp4',
        subtitles: 'assets/demo/soustitre.vtt',
        summary: 'Au cours de cette vidéo nous verrons les différents risques PPST',
        toc: 2
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
        toc: 2
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
        toc: 2
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
        toc: 2
    },
    {
        id: 'k',
        type: 'chapter',
        name: 'Accès aux données sensibles, accueil des visiteurs et sanctions',
        number: '3',
        toc: 1
    },
    {
        id: 'l',
        type: 'video',
        name: 'Données sensibles, visiteurs et sanctions',
        source: 'assets/demo/video.mp4',
        subtitles: 'assets/demo/soustitre.vtt',
        summary: 'Accès aux données sensibles, accueil des visiteurs et sanctions',
        toc: 2
    },
    {
        id: 'm',
        type: 'html',
        name: 'Règlement intérieur',
        value: '<h4>Autorisations : </h4>' +
            '<p></p>',
        toc: 2
    },
    {
        id: 'n',
        type: 'html',
        name: 'A retenir',
        value: '<h4>Ce qu\'il faut retenir :</h4>' +
            '<p></p>',
        toc: 2
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
        toc: 2
    },
    {
        id: 'p',
        type: 'chapter',
        name: 'Echelle de sensibilité',
        number: '4',
        toc: 1
    },
    {
        id: 'q',
        type: 'video',
        name: 'Echelle de sensibilité',
        source: 'assets/demo/video.mp4',
        subtitles: 'assets/demo/soustitre.vtt',
        summary: 'Entretien à propos de l\'échelle de sensibilité',
        toc: 2
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
        toc: 2
    }
];

export const MockLibrary: Epoc[] = [
    {
        id: 'C042AD',
        title: 'Zone à régime restrictif',
        image: 'assets/demo/zrr-intro-poster.jpg',
        teaser: 'assets/demo/zrr-intro.mp4',
        authors: [
            {
                name: 'Didier Benza',
                image: 'assets/demo/img/benza.jpg',
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
            outline: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r']
        }],
        content: ZRRContents
    }
];


