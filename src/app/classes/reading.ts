export class Reading {
    epocId: string;
    progress: number;
    assessments: UserAssessment[];
    bookmarks: number[];
}

class UserAssessment {
    id: string;
    responses: string[];
}


