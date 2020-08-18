import {uid} from '../types';

export abstract class Content {
    id: uid;
    type: 'html' | 'assessment' | 'video' | 'simple-question' | 'choice';
    name: string;
    conditional?: boolean;
    conditionResolver?: ScoreResolver | ChoiceResolver;
}

abstract class Resolver {
    conditionalFlag: ConditionalFlag[];
}

export class ScoreResolver extends Resolver{
    type: 'score';
}

export class ChoiceResolver extends Resolver{
    type: 'choice';
    choices: Choice[];
}

export class Choice {
    label: string;
    value: string;
}

export class ConditionalFlag {
    value: string;
    flags: uid[];
}
