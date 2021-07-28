import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { generateRandomNumber, stringifyParams, writeJSONFiles } from './utils.js';

dotenv.config({ path: '.env' });

// this is the ID for @TwitterDev
const userId = '1249718482436055044';
const url = `https://api.twitter.com/2/users/${userId}/followers?`;
const bearerToken = process.env.TWITTER_BEARER_TOKEN;
const usersToGenerate = 5;

const getFollowers = async () => {
  let users = [];
  const userToDM = [];
  const params = {
    max_results: 1000,
  };

  const options = {
    method: 'GET',
    headers: {
      'User-Agent': 'v2FollowersJS',
      authorization: `Bearer ${bearerToken}`,
    },
  };

  let hasNextPage = true;
  let nextToken = null;

  console.log('Retrieving followers...');

  while (hasNextPage) {
    const { data, meta } = await getPage(params, options, nextToken);

    if (meta && meta.result_count && meta.result_count > 0) {
      if (data) {
        users = [...users, ...data];
      }
      if (meta.next_token) {
        nextToken = meta.next_token;
      } else {
        hasNextPage = false;
      }
    } else {
      hasNextPage = false;
    }
  }

  let userAlreadyPicked = false;

  while (userToDM.length < usersToGenerate && !userAlreadyPicked) {
    const randomIndex = generateRandomNumber(0, users.length - 1);

    console.log(`Finding random id: ${randomIndex}`);

    userAlreadyPicked = userToDM.some((user) => user.id === users[randomIndex].id);

    userToDM.push(users[randomIndex]);
  }

  await writeJSONFiles(userToDM, './usersToDM.json');
};

const getPage = async (params, options, nextToken) => {
  if (nextToken) {
    params.pagination_token = nextToken;
  }

  const stringParams = stringifyParams(params);
  const fetchURL = `${url}${stringParams}`;

  try {
    const resp = await fetch(fetchURL, options);
    const data = await resp.json();

    return data;
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
};

getFollowers();
