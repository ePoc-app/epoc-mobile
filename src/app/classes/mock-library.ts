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
        '<video src="assets/demo/video.mp4" controls="true"></video>',
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

const MockContents: (Content|Chapter|Assessment|Html|Video)[] = [
        {
        id: '2',
        type: 'chapter',
        name: 'Mise en situation pour aborder les règles de fonctionnement d\'une ZRR',
        number: '1'
    },
    {
        id: '3',
        type: 'html',
        name: 'Welcome',
        value: DummyHtmlContent(2000)
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
                correctResponse: 'A'
            }
        ]
    },
    {
        id: '6',
        type: 'chapter',
        name: 'La suite du cours ZRR',
        number: '2'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: DummyHtmlContent(1240)
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
        id: '10',
        type: 'html',
        name: 'Chapter 3',
        value: DummyHtmlContent(1240)
    }
];

export const MockLibrary: Epoc[] =  [
    {
        id: 'C042AD',
        title: 'Zone à régime restrictif',
        image: 'assets/demo/img/security.jpg',
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
        outline: Array.from('1234567'),
        content: MockContents
    },
    {
        id: 'C029CL',
        title: 'Recherche Reproductible',
        image: 'assets/demo/img/rr.jpg',
        authors: [
            {
                name: 'Arnaud Legrand',
                image: 'assets/demo/img/legrand.png',
                description: 'Fusce aliquet eros vel sapien dictum tempor. Praesent malesuada rutrum eros, sit amet rhoncus dui.'
            },
            {
                name: 'Christophe Pouzat',
                image: 'assets/demo/img/pouzat.png',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem, nostrum? At ' +
                    'autem dignissimos dolorem illum molestias quas quod repudiandae saepe.'
            },
            {
                name: 'Konrad Hinsen',
                image: 'assets/demo/img/hinsen.png',
                description: 'Sed sed ante nisi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem, nostrum? At ' +
                    'autem dignissimos dolorem illum molestias quas quod repudiandae saepe.'
            }
        ],
        summary: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices semper libero, ' +
            'sit amet fringilla leo. Donec facilisis volutpat augue, in interdum ligula tincidunt ac. Sed ut ' +
            'volutpat dui, sed fringilla purus. Fusce aliquet eros vel sapien dictum tempor.</p><p>Class aptent taciti ' +
            'sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque sit amet quam ' +
            'ultricies, dignissim leo sit amet, gravida nisi. Fusce id urna quis diam laoreet rutrum. Vivamus porttitor ' +
            'sed ex sit amet finibus. Sed sed ante nisi. Praesent malesuada rutrum eros, sit amet rhoncus dui.</p>',
        outline: Array.from('1234567'),
        content: MockContents
    },
    {
        id: 'C138VL',
        title: 'Robot cool',
        image: 'assets/demo/img/robot.jpg',
        authors: [
            {
                name: 'Elon Musk',
                image: 'assets/demo/img/musk.jpg',
                description: ''
            },
            {
                name: 'Jeff Bezos',
                image: 'assets/demo/img/bezos.jpg',
                description: ''
            }
        ],
        summary: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices semper libero, ' +
            'sit amet fringilla leo. Donec facilisis volutpat augue, in interdum ligula tincidunt ac. Sed ut ' +
            'volutpat dui, sed fringilla purus. Fusce aliquet eros vel sapien dictum tempor.</p><p>Class aptent taciti ' +
            'sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque sit amet quam ' +
            'ultricies, dignissim leo sit amet, gravida nisi. Fusce id urna quis diam laoreet rutrum. Vivamus porttitor ' +
            'sed ex sit amet finibus. Sed sed ante nisi. Praesent malesuada rutrum eros, sit amet rhoncus dui.</p>',
        outline: Array.from('1234567'),
        content: MockContents
    }
];


