import {Epoc} from './epoc';
import {Content} from './contents/content';
import {Cover} from './contents/cover';
import {Chapter} from './contents/chapter';
import {Assessment} from './contents/assessment';
import {Html} from './contents/html';
import {Video} from './contents/video';

const MockContents: (Content|Chapter|Assessment|Html|Video)[] = [
    {
        id: '1',
        type: 'cover',
        name: 'Cover',
    },
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
        value: '<h1 class="machin">Welcome!</h1>' +
            '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ultrices semper libero, ' +
            'sit amet fringilla leo. Donec facilisis volutpat augue, in interdum ligula tincidunt ac. Sed ut ' +
            'volutpat dui, sed fringilla purus. Fusce aliquet eros vel sapien dictum tempor.</p>' +
            '<h5><b>Lorem ipsum</b></h5><p>Class aptent taciti ' +
            'sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque sit amet quam ' +
            'ultricies, dignissim leo sit amet, gravida nisi. Fusce id urna quis diam laoreet rutrum. Vivamus porttitor ' +
            'sed ex sit amet finibus. Sed sed ante nisi. Praesent malesuada rutrum eros, sit amet rhoncus dui.</p>' +
            '<video src="assets/demo/video.mp4" controls="true"></video>' +
            '<h5><b>Lorem ipsum</b></h5><p>Class aptent taciti ' +
            'sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque sit amet quam ' +
            'ultricies, dignissim leo sit amet, gravida nisi. Fusce id urna quis diam laoreet rutrum. Vivamus porttitor ' +
            'sed ex sit amet finibus. Sed sed ante nisi. Praesent malesuada rutrum eros, sit amet rhoncus dui.</p>' +
            '<h1>Lorem ipsum dolor sit amet, consectetur adipisicing elit</h1><p>Sed do eiusmod tempor incididunt ut ' +
            'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ' +
            'aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
            'eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt ' +
            'mollit anim id est laborum.</p><p>Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium ' +
            'doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae ' +
            'vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed ' +
            'quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ' +
            'ipsum, quia dolor sit amet, consectetur, adipiscin] velit, sed quia non numquam do eius modi tempora incididunt, ' +
            'ut labore et dolore magnam aliquam quaerat voluptatem.</p><p>Ut enim ad minima veniam, quis nostrum exercitationem ' +
            'ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit, ' +
            'qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas ' +
            'nulla pariatur.</p><h2>Vero eos et accusamus et iusto odio dignissimos ducimus</h2><p>Qui blanditiis praesentium ' +
            'voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, ' +
            'similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum ' +
            'facilis est et expedita distinctio. </p><p>Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, ' +
            'quo minus id, quod maxime placeat, facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Qua temporibus ' +
            'autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et ' +
            'molestiae non recusandae pondere ad lineam. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis ' +
            'voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat</p><p>Quibus ego assentior, dum ' +
            'modo de iisdem rebus ne Graecos quidem legendos putent. Res vero verbis electis graviter omateque dictas quis i legat? ' +
            'Nisi qui se plane Graeciun dici velit, ut a 9 Scaeiola est praetore salutatus Athenis Albucius. Quem quidem locum cum ' +
            'multa venustate et omm sale idem Lucilius, apud quem praeclare Scaevola.</p><p>Qui autem alia matunt scribi a nobis, ' +
            'aequi esse debent, quod et seripta multa sunt, sic ut plura nemini e nostris, et scribentur fortasse plura si vita ' +
            'suppetet; et tamen qui diligenter haec quae de philosophia Htteris mandamus legere assueverit, iudicabit nulla ad ' +
            'legendum his esse potiora.</p>'
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
        id: '6',
        type: 'chapter',
        name: 'La suite du cours ZRR',
        number: '2'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
    },
    {
        id: '7',
        type: 'html',
        name: 'Chapter 2',
        value: '<h3>Tempore intellegi convenire</h3><p>Epicurus autem, in quibus sequitur Democritum, noil fere labitur, Quam- ' +
            'quam utriusque cum mutta non prolx). turn illiid in priniis, quoJ, cum in rerum nalura duo quaerenda sint, ununi ' +
            'quae materia sit ex qua quaeque res cfficiatur, alterum quae vis sit quae quidque efficiat, de materia disserucrunt, ' +
            'vim et causam efficiendi reliquerunt. Sed lioc commune vitiuni; illae Epicur propriae ruinae: censet enim eadem ilia ' +
            'indlvidua e solida corpora ferri deorsum suo pondere ad lineam i hunc naturalem esse omnium corporum motuni.</p><p>Deinde ' +
            'ibidem homo acutus, cam illud occorreret, j omnia deorsum e regione ferrentur et, ut dixi, ad lineam, numquam fore ut ' +
            'atomus altera alteram posset attingere, itaque attulit rem commenticiam.</p><p>Declinare dixit atomum perpaulum, quo ' +
            'nihil posset fieri minus; ita eifici complexiones et copulationes et adhaesiones atomorum inter se, ex quo eificeretur ' +
            'mundus omnesque partes mundi quaeque in eo essent. Quae cum res tota fieta sit piieriliter, turn ne efficit quidem^ quod ' +
            'vult. Nam et ipsa declinatio ad libidinem fiiigitur - ait enim deelinare atomum sine causa, quo nibil turpius physico quam ' +
            'fieri.</p>'
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
                type: 'choice',
                statement: '',
                label: 'Comment décririez vous cette formation ?',
                responses: [
                    {
                        label: 'Géniale',
                        value: 'A'
                    },
                    {
                        label: 'Bof',
                        value: 'B'
                    },
                    {
                        label: 'Trop longue',
                        value: 'C'
                    }
                ],
                correctResponse: 'A'
            }
        ]
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


