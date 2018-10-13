const { SIG_ID, SIGS, GROUP_IDS } = process.env;

import fetch from "node-fetch";

import flatten from "lodash/flatten";

const getEvents = ({ groupId, signatureKey }) => {
  const endpoint = `https://api.meetup.com/${groupId}/events?photo-host=public&page=20&sig_id=${SIG_ID}&sig=${signatureKey}`;
  return fetch(endpoint).then(response => response.json());
};

exports.handler = async (event, context) => {
  const signatures = SIGS.split(",");
  const groupIds = GROUP_IDS.split(",");

  const promises = signatures.map((signature, i) =>
    getEvents({
      groupId: groupIds[i],
      signatureKey: signature
    })
  );

  return Promise.all(promises)
    .then(data => ({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
      },
      statusCode: 200,
      body: JSON.stringify(flatten(data))
    }))
    .catch(error => ({ statusCode: 422, body: String(error) }));
};
