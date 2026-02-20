from flask import Flask, request, jsonify
import os
import json
import logging
from datetime import datetime

app = Flask(__name__)

# 로그 설정
logging.basicConfig(filename='webhook_orders.log', level=logging.INFO)

@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        data = request.json
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # 신호 로그 기록
        logging.info(f"[{timestamp}] Signal Received: {json.dumps(data)}")
        print(f"\n🔔 [TradingView Signal] {timestamp}")
        print(f"내용: {json.dumps(data, indent=2, ensure_ascii=False)}")
        
        # 여기서 Polymarket 또는 Hyperliquid 주문 로직 호출 예정
        # 예: if data.get('action') == 'buy': execute_poly_order(...)
        
        return jsonify({"status": "success", "message": "Signal received"}), 200
    except Exception as e:
        logging.error(f"Error processing webhook: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    # 5000번 포트에서 실행 (ngrok으로 외부 노출 예정)
    app.run(host='0.0.0.0', port=5000)
