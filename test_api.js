import http from 'http';

const data = JSON.stringify({
    cropType: "Wheat",
    location: "Punjab",
    farmSize: 5,
    soilType: "Loamy",
    soilPh: 6.8,
    rainfall: 800,
    temperature: 30,
    humidity: 85
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/recommend-crops',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let body = '';
    res.on('data', d => { body += d; });
    res.on('end', () => {
        console.log(JSON.stringify(JSON.parse(body), null, 2));
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
