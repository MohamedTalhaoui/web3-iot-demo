import time
import rlp
import json
import time

import Adafruit_DHT
from web3 import Web3, HTTPProvider
from web3.utils.threads import Timeout
from web3.exceptions import TransactionNotFound

DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 12

web3 = Web3(HTTPProvider('https://rinkeby.infura.io/v3/' + '91d62b1aafc648358eb9ac3f6d884549'))
contract_addr = web3.toChecksumAddress('0x23eb8e8c933f4a39838892497d852bf598d4c3f8')
from_addr = web3.toChecksumAddress('0x44b1451f16ddd490ee0be676c7c85096bb61134d')

with open('./secrets.json') as f:
    sercrets_json = json.load(f)
key = sercrets_json["key"]
print(key)

with open("./abi.json") as f:
    abi_json = json.load(f)
abi = abi_json[0]
contract = web3.eth.contract(address=contract_addr, abi=abi_json)

def sendTransaction(txCount, encodedData):
    transaction = {
        'to': contract_addr,
        'from': from_addr,
        'value': 0x0,
        'gas': web3.toHex(700000),
        'gasPrice': web3.toHex(web3.toWei('10', 'gwei')),
        'nonce': txCount,
        'data': encodedData
    }

    signed_txn = web3.eth.account.signTransaction(transaction, key)
    transaction_id = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    print(web3.toHex(transaction_id))
    txn_receipt = wait_for_transaction_receipt(transaction_id)
    print(txn_receipt)

def payout():
    count = contract.functions.getHoldersCount().call()
    for i in range(0,count):
        payout_address = contract.functions.holders(i).call()
        if payout_address != '0x0000000000000000000000000000000000000000':
            print("Payout Holder at " + payout_address)
            txCount = web3.eth.getTransactionCount(from_addr)
            print("Nounce " + str(txCount))
            sendTransaction(txCount, contract.encodeABI(fn_name='payout', args=[i]))

def main():
    while True:
        humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)

        if humidity is not None and temperature is not None:
            print("Temp={0:0.1f}*C  Humidity={1:0.1f}%".format(temperature, humidity))
        
            if temperature > 30 or humidity > 90:
                print("Triggerring Smart Contract ...")
                payout()

        else:
            print("Failed to retrieve data from humidity sensor")

def count():
    txCount = web3.eth.getTransactionCount(from_addr)
    print("Nounce " + str(txCount))
    count = contract.functions.getHoldersCount().call()
    for i in range(0,count):
        holder = contract.functions.holders(i).call()
        print("Holder[{0}]: {1}", i, holder)

def wait_for_transaction_receipt(txn_hash, timeout=120, poll_latency=0.1):
    with Timeout(timeout) as _timeout:
        while True:
            txn_receipt = web3.eth.getTransactionReceipt(txn_hash)
            if txn_receipt is not None:
                break
            time.sleep(poll_latency)
    return txn_receipt

if __name__== "__main__":
  #count()
  #payout()

