
import {createLogger} from '../logger';
import {DynamoDB} from 'aws-sdk';

const logger = createLogger(__filename);
const REGION = process.env.AWS_REGION || 'sa-east-1';
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || 'dna-test';

const dynamoDb = new DynamoDB.DocumentClient({region: REGION});

/**
 * @param {array<string>} dna
 * @param {boolean} mutant
 * @return {object}
*/
export async function save(dna, mutant) {
  logger.info(`Saving dna`);
  const timestamp = new Date().getTime();
  const dnakey = dna.join('');

  const params = {
    TableName: DYNAMODB_TABLE,
    Item: {
      dnakey,
      mutant,
      createdAt: timestamp,
    },
  };

  try {
    const data = await dynamoDb.put(params).promise();
    logger.info(`DNA saved successfully`);
    return data;
  } catch (error) {
    logger.error(error.stack);
    throw error;
  }
}