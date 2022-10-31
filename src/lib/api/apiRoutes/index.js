const accountsService = "accounts-service/api/v1/";
const agentsInbox = "agents-inbox/api/v1/";
const kSam = "k-sam/api/v1/";

const apiRoutes = {
    authenticate: `${agentsInbox}app-message-user/authenticate`,
    userTickets: `${agentsInbox}app-message-user/tickets`,
    initiateChat: `${agentsInbox}app-message-user/chat`,
    decryptToken: `${agentsInbox}app-message-user/token/decrypt`,
    getAuthToken: (code, tickedId) =>
        `${agentsInbox}app-message-user/conversation/${code}/${tickedId}`,
    getTicketMessages: (ticketId) => `${agentsInbox}messages/${ticketId}`,
    updateTicketDiscovery: (ticketId) =>
        `${agentsInbox}ticket/${ticketId}/issueDiscovered`,
    changeTicketChoice: (ticketId) =>
        `${agentsInbox}ticket/${ticketId}/change-choice`,
    restartTicket: (ticketId) => `${agentsInbox}ticket/${ticketId}/restart`,
    closeTicket: (ticketId) => `${agentsInbox}ticket/${ticketId}/close`,
    rateTicket: (ticketId) => `${agentsInbox}ticket/${ticketId}/rating`,
    sendAgentTicket: `${agentsInbox}ticket/assign-by-capsule`,
    investigateMesage: `${kSam}issue/investigate-message`,
    createTicket: `${agentsInbox}ticket`,
    validateSessionOtp: (sessionId) =>
        `${agentsInbox}app-message-user/session/${sessionId}/otp/validate`,
    resendSessionOtp: (sessionId) =>
        `${agentsInbox}app-message-user/session/${sessionId}/otp/resend`,
    chatSettings: (workspaceSlug) =>
        `${accountsService}workspace/chat-appearance/${workspaceSlug}`,
    getActionBranches: `${kSam}branches/action-branch`,
    fileUpload: `agents-inbox/file-upload/file-upload`,
};

export default apiRoutes;
