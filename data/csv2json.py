import pandas as pd
import json

df = pd.read_csv('transactions.csv')
print(df.head())
data = []
for index,item in df.iterrows():
    if index < 10:
        print(item)
    data.append({
        "date": item.date,
        "type": item.type,
        "name": item.fundname,
        "code": item.Code,
        "unitPrice": item.unitPrice if not pd.isnull(item.unitPrice) else None,
        "quantity": item.quantity if not pd.isnull(item.quantity) else None,
        "fee": item.fee if not pd.isnull(item.fee) else None,
        "value": item.value if not pd.isnull(item.value) else None 
    })

transactions = {
    "name": "etf150",
    "data": data 
}
with open('transactions.json', 'w', encoding='utf-8') as fp:
    json.dump(transactions, fp, indent=2, ensure_ascii=False)