import React, { useState, useEffect } from "react";

const ClientSideOnlyRenderer = React.memo(function ClientSideOnlyRenderer({
    initialSsrDone = false,
    renderDone,
    renderLoading,
  }) {
    const [ssrDone, setSsrDone] = useState(initialSsrDone);
  
    useEffect(
      function afterMount() {
        setSsrDone(true);
      },
      [],
    );
  
    if (!ssrDone) {
      return renderLoading();
    }
  
    return renderDone();
  });


export default ClientSideOnlyRenderer;