'use client'
import React, { useMemo, useState, useEffect } from 'react'
import SolanaLogo from '../icons/SolanaLogo'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { Connection, PublicKey } from '@solana/web3.js';
import { Skeleton } from "@/components/ui/skeleton"


const TOKEN_ADDRESS = 'AJACqc19iQkvou7LiMGhpkiQ4MMKMZTpP5b7qAw4x7HY'
const SliderInfo = ({ walletBalance }: { walletBalance: number }) => {
  const QUICKNODE_RPC = 'https://solana-mainnet.g.alchemy.com/v2/z1PFeuw7Wp6LE8OUoJt2sR871gkmP0dw'; // 👈 Replace with your QuickNode Endpoint OR clusterApiUrl('mainnet-beta')
  // const SOLANA_CONNECTION =  new Connection(QUICKNODE_RPC);
  const SOLANA_CONNECTION = useMemo(() => new Connection(QUICKNODE_RPC), []);
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  async function getTokenBalanceWeb3(connection: Connection) {
    setLoading(true)
    const tokenAccountPubKey = new PublicKey('4aQ1FoSrFHApnuhYBgB9rYGmVFVU4FfWNNHRBKwASLX2');
    const info = await connection.getTokenAccountBalance(tokenAccountPubKey);
    if (info.value.uiAmount == null) {
      setLoading(false)
      throw new Error('No balance found');
    }
    setBalance(info.value.uiAmount)
    setLoading(false)

  }
  useEffect(() => {

    getTokenBalanceWeb3(SOLANA_CONNECTION)
      .then(balance => console.log(`Token balance: ${balance}`))
      .catch(err => console.error(err));
  }, [SOLANA_CONNECTION, walletBalance])
  const calculatePercent = useMemo(() => {
    if (!balance) return 0
    const percent = (((18546430203 - balance) / 18546430203) * 100)
    return percent
  }, [balance])

  const calulateAmountRaised = useMemo(() => {
    if (!balance) return 0
    const amountForSupply = 18546430203
    const presaleAmount = amountForSupply - balance
    const amountDollars = presaleAmount * 0.00001

    return amountDollars
  }, [balance])
  return (
    <div className="flex space-y-4 flex-col">
      <span className="text-white changa-one-regular text-center  text-[25px] font-bold">
        Next Price Increase
      </span>
      <div className="bg-[#00FF4F] text-lg grid grid-cols-4 rounded-[24px] p-3">
        <div className="font-bold changa-one-regular">
          <h1>DAYS</h1>

          <p>00</p>
        </div>
        <div className="font-bold changa-one-regular">
          <h1>HOURS</h1>

          <p>00</p>
        </div>
        <div className="font-bold changa-one-regular">
          <h1>MINUTES</h1>

          <p>00</p>
        </div>
        <div className="font-bold changa-one-regular">
          <h1>SECONDS</h1>

          <p>00</p>
        </div>
      </div>
      <div>
        <p className="text-white text-center changa-one-regular font-bold text-lg">
          USDT RAISED: <span>$3,758,595,595 / $4,122,458</span>
        </p>
      </div>

      <Slider disabled={true} value={[60]} max={100} step={1} />
      <div>
        <p className="text-white text-center changa-one-regular font-bold text-lg">
          1 $wai: <span>$0.042828</span>
        </p>
      </div>
      <div className="flex md:flex-row flex-col gap-4 items-center justify-center">
        <Button
          variant={"secondary"}
          size={"sm"}
          className="reqular bg-brand-cyan uppercase text-black font-bold flex gap-4 "
        >
          <SolanaLogo />

          <div>
            <h3>Sol</h3>
            {/* <p className="text-sm font-normal text-brand-gray">Sol</p> */}
          </div>
        </Button>
        <Button
          variant={"secondary"}
          size={"sm"}
          className="text-white font-bold flex gap-4 "
        >
          <SolanaLogo />

          <div>
            <h3>USDT</h3>
            {/* <p className="text-sm font-normal text-brand-gray">Sol</p> */}
          </div>
        </Button>
      </div>
    </div>
  );
}

export default SliderInfo