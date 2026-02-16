import os
from hyperliquid.utils import constants
from hyperliquid.exchange import Exchange
from eth_account import Account
from pathlib import Path

ENV_PATH = Path('secrets/hyperliquid.env')
if not ENV_PATH.exists():
    raise SystemExit('Missing secrets/hyperliquid.env')

# Parse env manually (case-insensitive keys)
values = {}
for line in ENV_PATH.read_text().splitlines():
    if not line.strip() or '=' not in line:
        continue
    k,v = line.split('=',1)
    values[k.strip().lower()] = v.strip()

public_address = values.get('public_address')
api_address = values.get('api_address')
private_key = values.get('api_private_key')

if not public_address or not private_key:
    raise SystemExit('Missing required keys (public_address or api_private_key)')

# signer uses API wallet private key
account = Account.from_key(private_key)

# Sanity: ensure api_address matches signer (if provided)
if api_address and account.address.lower() != api_address.lower():
    print('WARNING: API_Address does not match private key address')

exchange = Exchange(account, constants.MAINNET_API_URL, account_address=public_address)

asset = 'XRP'
leverage = 5
print(f'Setting leverage: {asset} -> {leverage}x (cross)')
resp = exchange.update_leverage(leverage, asset, is_cross=True)
print('Response:', resp)
