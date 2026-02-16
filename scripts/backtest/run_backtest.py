import pandas as pd
import numpy as np
import os

def calculate_metrics(equity_curve):
    if equity_curve.empty:
        return 0, 0
    total_return = (equity_curve.iloc[-1] / equity_curve.iloc[0]) - 1
    
    # MDD
    rolling_max = equity_curve.cummax()
    drawdown = (equity_curve - rolling_max) / rolling_max
    mdd = drawdown.min()
    
    return total_return, mdd

def ema_scalping(df, fast=9, slow=21):
    df = df.copy()
    df['ema_fast'] = df['close'].ewm(span=fast, adjust=False).mean()
    df['ema_slow'] = df['close'].ewm(span=slow, adjust=False).mean()
    
    df['signal'] = 0
    df.loc[df['ema_fast'] > df['ema_slow'], 'signal'] = 1
    df.loc[df['ema_fast'] < df['ema_slow'], 'signal'] = -1
    
    df['position'] = df['signal'].shift(1).fillna(0)
    df['pct_change'] = df['close'].pct_change().fillna(0)
    df['strategy_return'] = df['position'] * df['pct_change']
    
    # Apply fee (0.02% per trade)
    trades = df['position'].diff().fillna(0).abs()
    df['strategy_return'] -= trades * 0.0002
    
    df['equity'] = (1 + df['strategy_return']).cumprod()
    
    active_rows = df[df['position'] != 0]
    win_rate = (active_rows[active_rows['strategy_return'] > 0].shape[0] / active_rows.shape[0]) if not active_rows.empty else 0
    
    total_return, mdd = calculate_metrics(df['equity'])
    return total_return, mdd, win_rate

def rsi_trend_following(df, period=14):
    df = df.copy()
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    rs = gain / (loss + 1e-9)
    df['rsi'] = 100 - (100 / (1 + rs))
    
    df['signal'] = 0
    curr_sig = 0
    signals = []
    for rsi in df['rsi']:
        if rsi > 60:
            curr_sig = 1
        elif rsi < 40:
            curr_sig = -1
        elif (curr_sig == 1 and rsi < 50) or (curr_sig == -1 and rsi > 50):
            curr_sig = 0
        signals.append(curr_sig)
    
    df['position'] = pd.Series(signals).shift(1).fillna(0).values
    df['pct_change'] = df['close'].pct_change().fillna(0)
    df['strategy_return'] = df['position'] * df['pct_change']
    
    trades = df['position'].diff().fillna(0).abs()
    df['strategy_return'] -= trades * 0.0002
    
    df['equity'] = (1 + df['strategy_return']).cumprod()
    
    active_rows = df[df['position'] != 0]
    win_rate = (active_rows[active_rows['strategy_return'] > 0].shape[0] / active_rows.shape[0]) if not active_rows.empty else 0
    
    total_return, mdd = calculate_metrics(df['equity'])
    return total_return, mdd, win_rate

def funding_farming(df_candles, df_funding):
    df = df_candles.copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    df_funding = df_funding.copy()
    df_funding['time'] = pd.to_datetime(df_funding['time']).dt.floor('h')
    
    df['hour'] = df['timestamp'].dt.floor('h')
    df = df.merge(df_funding[['time', 'fundingRate']], left_on='hour', right_on='time', how='left')
    df['fundingRate'] = df['fundingRate'].fillna(0)
    
    df['position'] = 0
    df.loc[df['fundingRate'] > 0, 'position'] = -1
    df.loc[df['fundingRate'] < 0, 'position'] = 1
    
    df['pct_change'] = df['close'].pct_change().fillna(0)
    
    df['funding_gain'] = 0.0
    hour_mask = df['hour'] != df['hour'].shift(1)
    df.loc[hour_mask, 'funding_gain'] = -df['position'] * (df['fundingRate'] / 1.0) # HL funding is hourly
    
    df['strategy_return'] = (df['position'] * df['pct_change']) + df['funding_gain']
    
    trades = df['position'].diff().fillna(0).abs()
    df['strategy_return'] -= trades * 0.0002
    
    df['equity'] = (1 + df['strategy_return']).cumprod()
    
    active_rows = df[df['position'] != 0]
    win_rate = (active_rows[active_rows['strategy_return'] > 0].shape[0] / active_rows.shape[0]) if not active_rows.empty else 0
    
    total_return, mdd = calculate_metrics(df['equity'])
    return total_return, mdd, win_rate

def grid_trading(df, grid_size=0.005, num_grids=10):
    df = df.copy()
    base_price = df['close'].iloc[0]
    
    # Simple Grid: Buy/Sell at fixed intervals
    # Since it's a simulation, we simulate fills
    df['grid_signal'] = 0
    pos = 0
    equity = 1.0
    last_price = base_price
    returns = []
    
    grids = [base_price * (1 + i * grid_size) for i in range(-num_grids, num_grids + 1)]
    
    for price in df['close']:
        current_return = 0
        # Check if we crossed a grid line
        for g in grids:
            if (last_price < g <= price) or (price <= g < last_price):
                # Sell if above base, Buy if below? (Standard Mean Reversion Grid)
                if g > base_price: # Sell (Short)
                    pos -= 1
                else: # Buy (Long)
                    pos += 1
                # Account for slippage/fee
                equity -= 0.0002 * abs(pos)
        
        current_return = pos * (price - last_price) / last_price
        equity *= (1 + current_return)
        returns.append(current_return)
        last_price = price
        
    df['strategy_return'] = returns
    df['equity'] = (1 + df['strategy_return']).cumprod()
    
    active_rows = [r for r in returns if r != 0]
    win_rate = (len([r for r in active_rows if r > 0]) / len(active_rows)) if active_rows else 0
    
    total_return, mdd = calculate_metrics(df['equity'])
    return total_return, mdd, win_rate

def funding_farming_threshold(df_candles, df_funding, threshold=0.0001):
    df = df_candles.copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    df_funding = df_funding.copy()
    df_funding['time'] = pd.to_datetime(df_funding['time']).dt.floor('h')
    
    df['hour'] = df['timestamp'].dt.floor('h')
    df = df.merge(df_funding[['time', 'fundingRate']], left_on='hour', right_on='time', how='left')
    df['fundingRate'] = df['fundingRate'].fillna(0)
    
    df['position'] = 0
    # Only enter if funding rate is above threshold
    df.loc[df['fundingRate'] > threshold, 'position'] = -1
    df.loc[df['fundingRate'] < -threshold, 'position'] = 1
    
    df['pct_change'] = df['close'].pct_change().fillna(0)
    
    df['funding_gain'] = 0.0
    hour_mask = df['hour'] != df['hour'].shift(1)
    df.loc[hour_mask, 'funding_gain'] = -df['position'] * (df['fundingRate'])
    
    df['strategy_return'] = (df['position'] * df['pct_change']) + df['funding_gain']
    
    trades = df['position'].diff().fillna(0).abs()
    df['strategy_return'] -= trades * 0.0002
    
    df['equity'] = (1 + df['strategy_return']).cumprod()
    
    active_rows = df[df['position'] != 0]
    win_rate = (active_rows[active_rows['strategy_return'] > 0].shape[0] / active_rows.shape[0]) if not active_rows.empty else 0
    
    total_return, mdd = calculate_metrics(df['equity'])
    return total_return, mdd, win_rate

def funding_trend_hybrid(df_candles, df_funding, threshold=0.000005):
    df = df_candles.copy()
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Simple Trend: EMA 10
    df['ema'] = df['close'].ewm(span=10, adjust=False).mean()
    df['trend'] = 0
    df.loc[df['close'] > df['ema'], 'trend'] = 1
    df.loc[df['close'] < df['ema'], 'trend'] = -1
    
    df_funding = df_funding.copy()
    df_funding['time'] = pd.to_datetime(df_funding['time']).dt.floor('h')
    
    df['hour'] = df['timestamp'].dt.floor('h')
    df = df.merge(df_funding[['time', 'fundingRate']], left_on='hour', right_on='time', how='left')
    df['fundingRate'] = df['fundingRate'].fillna(0)
    
    df['position'] = 0
    # Condition: Funding aligns with Trend
    # If fundingRate > 0 (Short receives), and trend is Down (-1), go Short (-1)
    df.loc[(df['fundingRate'] > threshold) & (df['trend'] == -1), 'position'] = -1
    # If fundingRate < -threshold (Long receives), and trend is Up (1), go Long (1)
    df.loc[(df['fundingRate'] < -threshold) & (df['trend'] == 1), 'position'] = 1
    
    df['pct_change'] = df['close'].pct_change().fillna(0)
    df['funding_gain'] = 0.0
    hour_mask = df['hour'] != df['hour'].shift(1)
    df.loc[hour_mask, 'funding_gain'] = -df['position'] * df['fundingRate']
    
    df['strategy_return'] = (df['position'] * df['pct_change']) + df['funding_gain']
    trades = df['position'].diff().fillna(0).abs()
    df['strategy_return'] -= trades * 0.0002
    
    df['equity'] = (1 + df['strategy_return']).cumprod()
    
    active_rows = df[df['position'] != 0]
    win_rate = (active_rows[active_rows['strategy_return'] > 0].shape[0] / active_rows.shape[0]) if not active_rows.empty else 0
    
    total_return, mdd = calculate_metrics(df['equity'])
    return total_return, mdd, win_rate

if __name__ == "__main__":
    coins = ["XRP", "HBAR", "XLM"]
    results = []
    
    for coin in coins:
        try:
            df_candles = pd.read_csv(f"scripts/data/{coin}_1m.csv")
            df_funding = pd.read_csv(f"scripts/data/{coin}_funding.csv")
            
            # Hybrid
            tr_hyb, mdd_hyb, wr_hyb = funding_trend_hybrid(df_candles, df_funding)
            results.append({"Coin": coin, "Strategy": "Funding-Trend Hybrid", "Return": tr_hyb, "MDD": mdd_hyb, "WinRate": wr_hyb})
            
        except Exception as e:
            print(f"Error processing {coin}: {e}")
    
    res_df = pd.DataFrame(results)
    print(res_df)
            
    res_df = pd.DataFrame(results)
    print(res_df)
    res_df.to_csv("scripts/backtest/results.csv", index=False)
