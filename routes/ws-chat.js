const WebSocket = require('ws');

const createChatServer = server => {
    const wsServer = new WebSocket.Server({ server });
    const map = new Map(); //存放對應的名稱

    wsServer.on('connection', (ws, req) => {
        console.log(wsServer.clients); //set類型
        map.set(ws, { name: '' }); //設定對應的物件 進到聊天室的暱稱 先給空字串 用ws(WebSocket)的物件當key
        ws.on('message', (message, isBinary) => {
            const mObj = map.get(ws); //取得對應的物件
            let msg; //要廣播的訊息(雖然說是廣播但其實是個別發)
            if (!mObj.name) { //如果沒有名字
                mObj.name = message.toString(); //把他傳進來的訊息當做他的名字
                msg = `${mObj.name} 進到聊天室，共 ${wsServer.clients.size} 人`;
            } else {
                msg = `${mObj.name}: ${message.toString()}`;
            }

            wsServer.clients.forEach(c => {
                if (c.readyState === WebSocket.OPEN) {
                    c.send(msg); //如果是開啟的狀態就發送剛剛準備好的訊息
                }
            });
        });
    });
};

module.exports = createChatServer;
