const WebSocket = require('ws');

const createChatServer = server => {
    const wsServer = new WebSocket.Server({ server });
    const map = new Map(); //存放對應的名稱

    wsServer.on('connection', (ws, req) => {
        ws.on('message', (message, isBinary) => {
            const mObj = map.get(ws); //取得對應的物件
            let msg = message.toString(); //要廣播的訊息
            wsServer.clients.forEach(c => {
                if (c.readyState === WebSocket.OPEN) {
                    c.send(msg); //如果是開啟的狀態就發送剛剛準備好的訊息
                }
            });
        });
    });
};

module.exports = createChatServer;
