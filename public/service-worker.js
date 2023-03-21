const closeTicket = (ticketId, baseUrl, apiKey, token) => {
    fetch(`${baseUrl}agents-inbox/api/v1/ticket/${ticketId}/close`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            "x-request-client-key": `${apiKey}`,
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
};

// eslint-disable-next-line no-restricted-globals
self.addEventListener("message", function (event) {
    if (event.data.tag === "close-ticket") {
        const { ticketId, baseUrl, apiKey, token } = event.data || {};

        closeTicket(ticketId, baseUrl, apiKey, token);
    }
});
