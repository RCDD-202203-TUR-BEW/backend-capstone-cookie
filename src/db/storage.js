const firebaseAdmin = require('firebase-admin');

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: 'gs://cookie-223e4.appspot.com',
});

const bucket = firebaseAdmin.storage().bucket();
// only delete the image from the bucket on firebase storage
async function deleteImage(fileName) {
  bucket
    .file(fileName)
    .delete()

    .then(() => {
      // eslint-disable-next-line prettier/prettier
      console.log('File deleted successfully');
    })
    .catch((error) => {
      // eslint-disable-next-line prettier/prettier
      console.log('Uh-oh, an error occurred!');
    });
}
async function uploadImage(reqFile, fileName) {
  const file = bucket.file(fileName);
  await file.save(reqFile.buffer);
  await file.makePublic();
  const publicUrl = file.publicUrl();
  return publicUrl;
}
async function updateImage(reqFile, oldfileName, newFileName) {
  await deleteImage(oldfileName);

  const publicUrl = await uploadImage(reqFile, newFileName);
  return publicUrl;
}

module.exports = {
  uploadImage,
  updateImage,
  deleteImage,
};
