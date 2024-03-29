export const ISSUE_DISCOVERY = "ISSUE_DISCOVERY";

export const ticketsPhases = Object.freeze({
    [ISSUE_DISCOVERY]: {
        title: 'Finding Issue',
        fillColor: '#25BB87'
    },
    PROBLEM_CONFIRMATION: {
        title: 'Discovering Problem',
        fillColor: '#FBBF27',
    },
    SOLUTION_DISCOVERY: {
        title: 'Fixing Issue',
        fillColor: '#25BB87'
    }
});