const accountsService = "accounts-service/api/v1/";
const agentsInbox = "agents-inbox/api/v1/";
const kSam = "k-sam/api/v1/";


const apiRoutes = {
    authenticate: `${agentsInbox}app-message-user/authenticate`,
    userTickets: `${agentsInbox}app-message-user/tickets`,
    initiateChat: `${agentsInbox}app-message-user/chat`,
    getTicketMessages: (ticketId) => `${agentsInbox}messages/${ticketId}`,
    changeTicketChoice: (ticketId) => `${agentsInbox}ticket/${ticketId}/change-choice`,
    restartTicket: (ticketId) => `${agentsInbox}ticket/${ticketId}/restart`,
    closeTicket: (ticketId) => `${agentsInbox}ticket/${ticketId}/close`,

    investigateMesage: `${kSam}issue/investigate-message`,
    createTicket: `${agentsInbox}ticket`,
    validateSessionOtp:  (sessionId) => `${agentsInbox}app-message-user/session/${sessionId}/otp/validate`,
    resendSessionOtp:  (sessionId) => `${agentsInbox}app-message-user/session/${sessionId}/otp/resend`,
    chatSettings:  (workspaceSlug) => `${accountsService}workspace/chat-appearance/${workspaceSlug}`
};

export default apiRoutes;