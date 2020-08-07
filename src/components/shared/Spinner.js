import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

const Spinner = ({ content }) => (
  <Dimmer active>
    <Loader size="huge" content={content} />
  </Dimmer>
);

export default Spinner;
