const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const path = require('path');

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

webPush.setVapidDetails(
    'mailto:your-email@example.com',
    'PUBLIC_VAPID_KEY', // 공개 VAPID 키
    'PRIVATE_VAPID_KEY' // 개인 VAPID 키
);

let subscriptions = [];

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({ message: '구독이 성공적으로 추가되었습니다.' });
});

app.post('/send-notification', (req, res) => {
    const message = req.body;
    const payload = JSON.stringify({ title: '약통 알람', body: message });

    subscriptions.forEach(subscription => {
        webPush.sendNotification(subscription, payload)
            .then(response => {
                console.log('알림이 성공적으로 전송되었습니다.', response);
            })
            .catch(error => {
                console.error('알림 전송 중 오류 발생', error);
            });
    });

    res.status(200).send('알림이 전송되었습니다.');
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});