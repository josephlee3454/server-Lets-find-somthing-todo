require('dotenv').config()
const express = require('express');
const cors = require("cors");
const axios = require("axios").default;
const YAPI_KEY = process.env.YAPI_KEY;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/events', async (req, res) => {
    console.log(req.query)
    try {
        res.contentType('application/json');
        res.status(200);
        if (req.query.latitude !==  undefined && req.query.longitude !== undefined) {
            var {data} = await getEventsByLatLong(req.query.latitude, req.query.longitude);
        } else {
            var {data} = await getEventsByLoc(req.query.location);
        }
        console.log("Passed data:", data);
        res.send(data.events);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }

})

app.get('/eventDetail', async (req, res) => {
    console.log("HERE", req.query.id)
    try {
        res.contentType('application/json');
        res.status(200);

        var {data} = await getEvent(req.query.id);
        console.log(data);
        res.send(data);
    } catch (e) {
        res.status(500).json(e);
    }
})

function getEventsByLatLong(latitude, longitude) {
    const url = 'https://api.yelp.com/v3/events?limit=30&latitude=' + latitude + '&longitude=' + longitude;
        console.log(url);
        return axios.get(url, {headers: {
                "Authorization": `Bearer ${YAPI_KEY}`
            }})

}
function getEventsByLoc(location) {
    const url = 'https://api.yelp.com/v3/events?limit=30&location=' + location;
        
        return axios.get(url, {headers: {
                "Authorization": `Bearer ${YAPI_KEY}`
            }})

}

function getEvent(id) {
    const url = 'https://api.yelp.com/v3/events/' + id;

    return axios.get(url, {headers: {
        "Authorization": `Bearer ${YAPI_KEY}`
    }})
}

app.listen(port, () => {
    console.log("listening on port " + port);
});