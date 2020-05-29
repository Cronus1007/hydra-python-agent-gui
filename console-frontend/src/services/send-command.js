import axios from "axios";

const agentEndpoint = "http://localhost:3001";

const getRawOutput = (body) => {
  return axios
    .post(`${agentEndpoint}/send-command`, body)
    .then((response) => {
      return response;
    })
    .catch((err) => console.error(err));
};

export default getRawOutput;
