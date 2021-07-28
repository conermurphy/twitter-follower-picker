import { promises as fs } from 'fs';

// Function used to combine parameters into one string ready to be sent to API.
export function stringifyParams(params) {
  return Object.entries(params)
    .map(([key, vals]) => {
      // Remove all spaces
      const transformedVals = vals.toString().replace(/ /g, '');
      return `${key}=${transformedVals}`;
    })
    .join('&');
}

export async function writeJSONFiles(data, filePath) {
  await fs.writeFile(filePath, JSON.stringify(data), (err) => {
    if (err) throw err;
  });
}

export function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
