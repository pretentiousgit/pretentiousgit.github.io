// A demonstration of how to access data from a local, public file
async function promiseData(url){
  return new Promise( async (resolve, reject) => {
    try {
      const request = await fetch(url);
      console.log('fetching a data file', request);
      const json = await request.json();
      console.log('extracting the data', json);
      resolve(json);
    } catch (err) {
      reject(err);
    }
  }) 
}

// How to use:
// (async () => await promiseData("/_data.json"))()

// here we make our little async function
// available for use in other code
export default promiseData;