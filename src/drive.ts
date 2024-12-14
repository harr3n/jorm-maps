import { google } from 'googleapis';
import dotenv from 'dotenv';
import { Readable } from 'node:stream';

dotenv.config();

const CREDENTIALS_PATH = process.env.CREDENTIALS_PATH;
if (!CREDENTIALS_PATH) {
  throw new Error('CREDENTIALS_PATH is not set in the .env file.');
}

const FOLDER_ID = process.env.FOLDER_ID;
if (!FOLDER_ID) {
  throw new Error('FOLDER_ID is not set in the .env file.');
}

async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  return google.drive({ version: 'v3', auth });
}

async function uploadOrUpdateFile(
  data: string,
  fileName: string,
): Promise<void> {
  try {
    const drive = await authenticate();

    // Search for an existing file with the same name in the specified folder
    const response = await drive.files.list({
      q: `name = '${fileName}' and '${FOLDER_ID}' in parents`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    const existingFile = response.data.files?.[0];

    const media = {
      mimeType: 'application/vnd.google-earth.kml+xml',
      body: Readable.from([data]),
    };

    if (existingFile) {
      // Update the existing file
      const updateResponse = await drive.files.update({
        fileId: existingFile.id!,
        requestBody: { name: fileName },
        media: media,
        fields: 'id, webViewLink, webContentLink',
      });
      console.log('File updated successfully!');
      console.log('View Link:', updateResponse.data.webViewLink);
    } else {
      // Upload a new file to the specified folder
      const createResponse = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [FOLDER_ID!],
        },
        media: media,
        fields: 'id, webViewLink, webContentLink',
      });
      console.log('File uploaded successfully!');
      console.log('View Link:', createResponse.data.webViewLink);
    }
  } catch (error) {
    console.error('Error uploading or updating file:', error);
  }
}

export { uploadOrUpdateFile };
