const { GROUP_IDS, ACCESS_TOKEN } = process.env;

import fetch from "node-fetch";

import flatten from "lodash/flatten";

const getEvents = ({ groupId }) => {
  const endpoint = `https://api.meetup.com/${groupId}/events?photo-host=public&page=20`;
  return fetch(endpoint, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  }).then((response) => response.json());
};

exports.handler = async (event, context) => {
  const groupIds = GROUP_IDS.split(",");

  const promises = groupIds.map((groupId) =>
    getEvents({
      groupId: groupId,
    })
  );

  return Promise.all(promises)
    .then((data) => ({
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "*",
      },
      statusCode: 200,
      body: JSON.stringify(flatten(data)),
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
};
