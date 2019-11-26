import {Epoc} from './epoc';

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
        content: [
            {
                type: 'cover',
                name: 'Cover'
            },
            {
                type: 'chapter',
                name: 'Mise en situation pour aborder les règles de fonctionnement d\'une ZRR',
                number: '1'
            },
            {
                type: 'html',
                name: 'Welcome',
                value: '<h1>Welcome!</h1>' +
                    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices semper libero, ' +
                    'sit amet fringilla leo. Donec facilisis volutpat augue, in interdum ligula tincidunt ac. Sed ut ' +
                    'volutpat dui, sed fringilla purus. Fusce aliquet eros vel sapien dictum tempor.</p>' +
                    '<h5><b>Lorem ipsum</b></h5><p>Class aptent taciti ' +
                    'sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque sit amet quam ' +
                    'ultricies, dignissim leo sit amet, gravida nisi. Fusce id urna quis diam laoreet rutrum. Vivamus porttitor ' +
                    'sed ex sit amet finibus. Sed sed ante nisi. Praesent malesuada rutrum eros, sit amet rhoncus dui.</p>' +
                    '<video src="assets/demo/video.mp4" controls="true"></video>'
            },
            {
                type: 'assessment',
                id: 'assessment-1',
                name: 'Que signifie ZRR ?',
                score: 10,
                items: [
                    {
                        type: 'choice',
                        statement: '',
                        label: 'Que signifie ZRR ?',
                        responses: [
                            {
                                label: 'Zone de recherche à accès restreint',
                                value: 'A'
                            },
                            {
                                label: 'Zone à régime restrictif',
                                value: 'B'
                            }
                        ],
                        correctResponse: 'B'
                    }
                ]
            },
            {
                type: 'assessment',
                id: 'assessment-2',
                name: 'Le référent sécurité',
                score: 30,
                items: [
                    {
                        type: 'choice',
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
                        type: 'multipleChoice',
                        statement: '',
                        label: 'Comment décririez vous cette formation ?',
                        responses: [
                            {
                                label: 'Géniale',
                                value: 'A'
                            },
                            {
                                label: 'Passionnante',
                                value: 'B'
                            },
                            {
                                label: 'Trop longue',
                                value: 'C'
                            }
                        ],
                        correctResponse: 'AB'
                    }
                ]
            }
        ]
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
        content: [
            {
                type: 'html'
            },
            {
                type: 'video'
            },
            {
                type: 'video-slide'
            },
            {
                type: 'video-slide'
            },
        ]
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
        content: [
            {
                type: 'html'
            },
            {
                type: 'video'
            },
            {
                type: 'video-slide'
            },
            {
                type: 'video-slide'
            },
        ]
    }
];
