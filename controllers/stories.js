const Story = require('../models/stories');

exports.insert = function (req, res) {
    const storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        const story = new Story({
            text: storyData.text,
            image: storyData.image,
            date: storyData.date,
            user_id: storyData.user_id
        });
        console.log('received: ' + storyData);

        storyData.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(story));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

exports.getRatings = function (req, res) {

};