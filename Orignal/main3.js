// Initialize the first Firebase app
const firebaseConfig1 = {
    // Your Firebase config for app1

    apiKey: "AIzaSyCKvGUZiIhsigi-SEOsGK6-vUmcA5qcJu0",
    authDomain: "esp32-demo-test-600f6.firebaseapp.com",
    databaseURL: "https://esp32-demo-test-600f6-default-rtdb.firebaseio.com",
    projectId: "esp32-demo-test-600f6",
    storageBucket: "esp32-demo-test-600f6.appspot.com",
    messagingSenderId: "1015960027724",
    appId: "1:1015960027724:web:379b00131438edf17c6ae9",
    measurementId: "G-5WSL062SV2"
  };
  const app1 = firebase.initializeApp(firebaseConfig1, "app1");
  
  // Initialize the second Firebase app
  const firebaseConfig2 = {
    // Your Firebase config for app2
    apiKey: "AIzaSyCfXZXLGpqwhM0wDdtt2kEdgixdbCJA8qo",
    authDomain: "smsforyou-qr.firebaseapp.com",
    databaseURL: "https://smsforyou-qr-default-rtdb.firebaseio.com",
    projectId: "smsforyou-qr",
    storageBucket: "smsforyou-qr.appspot.com",
    messagingSenderId: "972579624026",
    appId: "1:972579624026:web:53567556943fdd911bf463",
    measurementId: "G-L91W337EP7"
  };
  const app2 = firebase.initializeApp(firebaseConfig2, "app2");


// Retrieve the real-time data from the first database
const database1 = app1.database().ref();
database1.on('child_added', handleDataUpdate);
database1.on('child_changed', handleDataUpdate);

function handleDataUpdate(snapshot1) {
  const data1 = snapshot1.val();

  // Retrieve the data from the second database
  const database2 = app2.database().ref();
  database2.once('value').then(snapshot2 => {
    const data2 = snapshot2.val();

    // Convert data2 object to an array
    const dataArray2 = Object.values(data2);

    // Compare the real-time data with the data from the second database
    const result = document.getElementById('result');
    const table = document.querySelector('table');
    const tableBody = table.querySelector('tbody');

    // Clear the table body
    tableBody.innerHTML = '';

    // Iterate over the data from the first database
    let srNo = 1;
    const promises = []; // Array to hold the promises for updating values

    for (const key in data1) {
      if (key === 'qr-verify') {
        continue; // Skip "qr-verify" entry
      }

      const matchingData = dataArray2.find(item => item.id === data1[key].id && item.order_number === data1[key].order_number);
      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `<td>${srNo}</td>
                            <td>${key}</td>
                            <td>${data1[key].id}</td>
                            <td>${data1[key].order_number}</td>
                            <td class="${matchingData ? 'true' : 'false'}">${matchingData ? 'True' : 'False'}</td>`;
      tableBody.appendChild(tableRow);
      srNo++;

      // Update the value of 'qr-verify' in the first database
      const database1Ref = app1.database().ref().child("parent-node");
      const promise = database1Ref.set({ 'qr-verify': matchingData ? true : false });
   
    }

    // Wait for all the update promises to resolve before displaying the table
    
  });
}