module.exports = {
    async send (req, res) {
        const { producer } = req;
        const payloads = [
            { topic: 'activity', messages:req.body.messages , partition: 0 }
        ];
        console.log(payloads);
        await producer.send(payloads, function (err, data) {
            
            console.log(data);
            return res.json(data);
        })
    } 
}